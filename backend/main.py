from typing import List
from urllib.parse import unquote

from fastapi import FastAPI, File, UploadFile, HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Query

from src.services.embedding_service import EmbeddingService
from src.services.cv_analyse_service import analyse_cv_to_json
from src.utils.common import json_to_text, extract_from_json
from src import logger
from src.services.db_service import DbService
from src.services.pdf_service import save_pdf, process_cv_to_json

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_service: DbService
embedding_service: EmbeddingService


@app.on_event("startup")
async def startup_event():
    global db_service, embedding_service
    db_service = DbService()
    embedding_service = EmbeddingService()
    logger.info("Initializing DB Service and Embedding Service")


@app.get("/search_cv")
async def search_cv(
        query: str,
        num_of_results: int,
        requiredSkills: List[str] = Query([]),
        softSkills: List[str] = Query([]),
        languages: List[str] = Query([]),
        experience: str = "",
        education: str = "",
        location: str = ""
):
    try:

        parts = [query]

        requiredSkills = [skill.strip() for skill in requiredSkills if skill.strip()]
        softSkills = [skill.strip() for skill in softSkills if skill.strip()]
        languages = [lang.strip() for lang in languages if lang.strip()]

        if requiredSkills:
            parts.append("Required skills: " + ", ".join(requiredSkills))
        if softSkills:
            parts.append("Soft skills: " + ", ".join(softSkills))
        if languages:
            parts.append("Languages: " + ", ".join(languages))
        if experience.strip() != "":
            parts.append(f"Experience: {experience.strip()}")
        if education.strip() != "":
            parts.append(f"Education: {education.strip()}")
        if location.strip() != "":
            parts.append(f"Location: {location.strip()}")

        full_query = " | ".join(parts)

        query_embedding = embedding_service.get_embedding(full_query)

        results = db_service.vector_search(query_embedding, num_of_results)

        return {"status": "Successfully processed",
                "results": extract_from_json(results)}

    except Exception as e:
        logger.error(f"Search failed: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": "Search failed"}
        )


@app.post("/upload_pdf")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

        saved_filename = save_pdf(file)

        json_cv_list = await process_cv_to_json(saved_filename)

        candidate_id = db_service.insert_one_candidate(json_cv_list[0])

        embeddings = embedding_service.get_embedding(json_to_text(json_cv_list[0]))
        db_service.add_or_update_embedding(candidate_id, embeddings)

        return {"filename": file.filename, "status": "Successfully processed"}

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": "File processing failed"}
        )


@app.post("/analyse_cv")
async def analyse_cv(request: Request):
    body = await request.body()
    body_str = body.decode('utf-8')
    decoded_body_str = unquote(body_str)

    try:
        cv_str = decoded_body_str.split("&")[0].split("=")[1]
        job_req_str = decoded_body_str.split("&")[1].split("=")[1]
    except IndexError:
        return {"status": "Failed", "message": "Invalid data format"}

    analyse_json = await analyse_cv_to_json(cv_str, job_req_str)

    return {
        "status": "Analysis successful",
        "results": analyse_json
    }
