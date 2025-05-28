import os
from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader

from backend.src import logger


def load_pdf_file(file_name, folder_path=Path("data")):
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
        loader = PyPDFLoader(folder_path / file_name)
        documents = loader.load()
        logger.info(f"Loaded {len(documents)} documents from file: {folder_path / file_name}")
        return documents
    except Exception as e:
        logger.error(f"Failed to load {folder_path / file_name}: {e}")
        return []


def load_pdfs_from_folder(folder_path=Path("data")):
    """
    Load all PDF files from a specified folder.

    :param folder_path: String, path of the folder to load
    :return: List of the data read from folders pdf files
    """
    if not os.path.exists(folder_path):
        logger.error(f"Folder does not exist: {folder_path}")
        return []

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
