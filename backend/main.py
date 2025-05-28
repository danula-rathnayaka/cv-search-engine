from backend.src.services.pdf_service import process_cv_to_json
import asyncio

if __name__ == '__main__':
    for doc in asyncio.run(process_cv_to_json()):
        print(doc)
