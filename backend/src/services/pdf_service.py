import json
import os
import shutil
import uuid
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate

from src import logger

from dotenv import load_dotenv

load_dotenv()  # Load environment variables from a .env file


def _load_pdf_file(file_name, folder_path=Path("data")):
    """
    Load a single PDF file.

    :param file_name: String, name of the file to load
    :param folder_path: String, path of the folder
    :return:
    """
    if not file_name.endswith('.pdf'):
        logger.error("Provided file is not a PDF.")
        return []

    if not os.path.exists(folder_path / file_name):
        logger.error(f"File does not exist: {folder_path / file_name}")
        return []

    try:
        # Load PDF content as LangChain Documents
        loader = PyPDFLoader(folder_path / file_name)
        documents = loader.load()
        logger.info(f"Loaded {len(documents)} documents from file: {folder_path / file_name}")
        return documents
    except Exception as e:
        logger.error(f"Failed to load {folder_path / file_name}: {e}")
        return []


def _load_pdfs_from_folder(folder_path=Path("data")):
    """
    Load all PDF files from a specified folder.

    :param folder_path: String, path of the folder to load
    :return: List of the data read from folders pdf files
    """
    if not os.path.exists(folder_path):
        logger.error(f"Folder does not exist: {folder_path}")
        return []

    # Filter only PDF files from the folder
    pdf_files = [f for f in os.listdir(folder_path) if f.endswith('.pdf')]
    all_documents = []

    for pdf_file in pdf_files:
        pdf_path = os.path.join(folder_path, pdf_file)
        try:
            loader = PyPDFLoader(pdf_path)
            documents = loader.load()
            all_documents.extend(documents)
        except Exception as e:
            logger.error(f"Failed to load {pdf_file}: {e}")

    logger.info(f"Loaded {len(all_documents)} documents from folder: {folder_path}")
    return all_documents


async def _parse_cv_to_json(cv, prompt_file_path=Path("src/prompts/cv_data_extraction_prompt.txt"), max_attempts=3,
                            model="llama-3.1-8b-instant"):
    # Initialize Groq LLM with specified parameters
    llm = ChatGroq(
        model=model,
        temperature=0,
        max_tokens=None,
        timeout=None
    )

    # Load prompt template from file
    with open(prompt_file_path, "r") as file:
        prompt_template = file.read()

    # Construct the prompt with expected variable
    prompt = PromptTemplate(
        input_variables=["context"],
        template=prompt_template
    )

    # System instruction sets behavior expectations for the LLM
    system_prompt = (
        "You are an expert information extractor trained to analyze resumes/CVs and convert them into structured JSON. "
        "Only extract factual data present in the text. Follow the given schema strictly and do not infer or guess missing details. "
        "Return only a valid JSON object with no extra commentary or formatting."
    )

    for attempt in range(max_attempts):
        try:
            messages = [
                ("system", system_prompt),
                ("human", prompt.format(context=cv)),
            ]
            response = await llm.ainvoke(messages)

            # Parse the raw string response as JSON
            parsed_json = json.loads(response.content)

            return parsed_json

        except json.JSONDecodeError as e:
            logger.warning(f"Attempt {attempt + 1}: LLM output is not valid JSON. Retrying...: {e}")
        except Exception as e:
            logger.error(f"Unexpected error while parsing CV: {e}")
            break

    logger.error("Failed to parse a valid JSON from the CV after multiple attempts.")
    return None


async def process_cv_to_json(file_name=None, folder_path=Path("data")):
    """
    Process one or multiple CVs (PDFs) and return structured JSON data.

    :param file_name: Optional; name of a single PDF file to process.
    :param folder_path: Path object or string pointing to the folder containing PDFs.
    :return: A list of JSON objects extracted from the CVs.
    """
    if file_name:
        documents = _load_pdf_file(file_name, folder_path)
        if not documents:
            logger.error(f"No documents found in file: {file_name} to parse to json")
            return []
        all_documents = documents
    else:
        all_documents = _load_pdfs_from_folder(folder_path)
        if not all_documents:
            logger.error(f"No documents found in folder: {folder_path} to parse to json")
            return []

    # Group pages by document source
    cv_collection = {}
    for page in all_documents:
        # Concatenate all page content from the same source document
        if page.metadata["source"] in cv_collection:
            cv_collection[page.metadata["source"]] += page.page_content
        else:
            cv_collection[page.metadata["source"]] = page.page_content

    parsed_jsons = []

    # Convert each full CV text into structured JSON using the LLM
    for data in cv_collection.values():
        parsed = await _parse_cv_to_json(data)
        if parsed:
            parsed_jsons.append(parsed)
        else:
            logger.warning("Failed to parse one of the documents.")

    logger.info(f"Successfully parsed {len(parsed_jsons)} CV(s) to JSON.")
    return parsed_jsons


def save_pdf(pdf_file, folder_path=Path("data")):
    """
    Save an uploaded PDF file using a UUID filename to the specified folder.

    :param pdf_file: The uploaded PDF file.
    :param folder_path: Optional, Directory where the file should be saved.
    """
    folder_path.mkdir(parents=True, exist_ok=True)

    # Generate a unique filename with the same .pdf extension
    filename = f"{uuid.uuid4()}.pdf"
    save_path = folder_path / filename

    with save_path.open("wb") as buffer:
        shutil.copyfileobj(pdf_file.file, buffer)

    return filename
