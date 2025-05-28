from backend.src.services.read_store_pdf import load_pdfs_from_folder, load_pdf_file

if __name__ == '__main__':
    for page in load_pdfs_from_folder():
        print(page.page_content)

    for page in load_pdf_file("11188218.pdf"):
        print(page.page_content)
