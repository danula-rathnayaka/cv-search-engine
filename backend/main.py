from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from src.utils.common import json_to_text, extract_from_json
from src import logger
from src.services.db_service import DbService
from src.services.embedding_service import get_embedding
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


@app.on_event("startup")
async def startup_event():
    global db_service
    db_service = DbService()
    logger.info("Initializing DB Service")


@app.get("/search_cv")
async def search_cv(query: str, num_of_results: int):
    try:
        query_embedding = get_embedding(query)
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

        embeddings = get_embedding(json_to_text(json_cv_list[0]))
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
