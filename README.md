# AI-Powered CV Sorter and Finder System

Automate the screening and ranking of CVs using state-of-the-art AI, vector embeddings, and semantic search.

---

## Project Overview

This project provides a scalable, AI-driven solution for parsing, storing, and searching CVs. It leverages advanced embedding models (BAAI/bge-base-en-v1.5) for semantic understanding, MongoDB Atlas for efficient vector storage, and a modern React frontend for intuitive user interaction.

---

## Key Features

- **PDF CV Parsing:** Extract structured information from CVs in PDF format.
- **Semantic Embeddings:** Generate vector embeddings for each CV using HuggingFaceEmbeddings.
- **Vector Storage:** Store embeddings in MongoDB Atlas with vector search indexing.
- **Semantic Search:** Find and rank CVs based on job descriptions or keywords.
- **Automated Scoring:** Rank candidates by matching CVs to user-defined job requirements.
- **Modern UI:** Built with React, Tailwind CSS, and ShadCN UI for a responsive, user-friendly experience.

---

## Technology Stack

- **Embedding Model:** BAAI/bge-base-en-v1.5 (via HuggingFaceEmbeddings)
- **Vector Database:** MongoDB Atlas (Vector Search)
- **Backend API:** FastAPI
- **Frontend:** React.js, Tailwind CSS, ShadCN UI
- **PDF Parsing:** pypdf
- **LLM Integration:** Groq Cloud (Llama-3-8b-8192) for advanced reasoning and feedback

---

## Installation

1. **Clone the repository:**

```
git clone https://github.com/your-username/cv-search-system.git
cd cv-search-system
```

2. **Install dependencies:**
```
pip install -r backend/requirements.txt
cd frontend
npm install
```


3. **Set up environment variables:**
- Create `.env` files in the `backend`.
- Add your MongoDB Atlas connection string, API keys, and other necessary credentials.

4. **Run the backend:**
```
cd backend
uvicorn main:app --reload
```

5. **Run the frontend:**
```
cd frontend
npm run dev
```

---

## Usage

1. **Upload CVs:**  
Use the web interface to upload PDF CVs. The system will parse, store, and generate embeddings for each CV.
2. **Search and Rank:**  
Enter a job description or keywords to search for relevant CVs. The system will return ranked results based on semantic similarity and user-defined criteria.
3. **Customize Criteria:**  
Adjust scoring weights for skills, experience, education, and other factors to prioritize candidates that best match your needs.

---

## Advanced Features

- **Automated Resume Parsing:** Extract and structure information from PDFs, DOCX, and images.
- **Dynamic Job Description Parsing:** Parse and extract key requirements from job postings.
- **Bias Detection:** Anonymize and detect bias in CV screening.
- **Feedback for Candidates:** Provide automated suggestions for resume improvement.
- **HR System Integration:** Connect with ATS, HRIS, or job boards for seamless workflow.

---

## Future Scope

- **UI/UX enhancements**
- **Resume feedback using LLMs**
- **Multimodal support for images and videos**

---

## License

This project is open-source and available under the MIT License.
