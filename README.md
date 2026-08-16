# OmniLearn – AI Multilingual Study Assistant

OmniLearn is an AI-powered study assistant designed to make learning simpler, interactive, and accessible. It allows users to process study materials, simplify complex content, generate quizzes and flashcards, and interact with the system through multilingual text and voice.

## Features

- 📄 **Document Processing** – Upload and process study documents.
- 🧠 **Content Simplification** – Convert complex study material into easier explanations.
- ❓ **Quiz Generation** – Automatically generate questions from study material.
- 🃏 **Flashcard Generation** – Create revision flashcards from documents.
- 🔍 **RAG-based Question Answering** – Ask questions based on uploaded study material.
- 🌐 **Multilingual Support** – Generate responses in different languages.
- 🎙️ **Voice Interaction** – Process voice input and provide responses.
- 📚 **Document-based Learning** – Answers are grounded in the provided study material.

## Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- CSS

**Backend**
- Python
- FastAPI
- REST APIs

**AI / ML**
- Ollama
- Large Language Models (LLMs)
- Retrieval-Augmented Generation (RAG)
- Embeddings
- Vector-based document retrieval

**Tools & Libraries**
- Git & GitHub
- Python Virtual Environment
- npm

## How It Works

OmniLearn follows a document-processing and Retrieval-Augmented Generation (RAG) pipeline. The system first processes the uploaded study material and then uses relevant parts of that material to generate answers, quizzes, flashcards, and simplified explanations.

### 1. Document Upload

The user starts by uploading a study document such as a PDF or other supported file.

The frontend sends the uploaded document to the backend for processing.

### 2. Content Extraction

The backend reads the uploaded document and extracts its text.

This step converts the original document into usable text that can be processed by the application.

### 3. Text Chunking

Large documents are divided into smaller sections called **chunks**.

Chunking makes the content easier to process and allows the system to retrieve only the relevant portions instead of processing the entire document every time.

### 4. Embedding Generation

Each text chunk is converted into a numerical representation called an **embedding**.

Embeddings capture the semantic meaning of the text, which allows the system to find content based on meaning rather than just exact keyword matches.

### 5. Vector Storage

The generated embeddings are stored along with their corresponding text chunks.

This creates a searchable knowledge base for the uploaded study material.

### 6. Query and Retrieval

When the user asks a question, the question is also converted into an embedding.

The system compares the question with the stored embeddings and retrieves the most relevant chunks from the uploaded study material.

### 7. Answer Generation

The retrieved content is provided to the LLM as context.

The LLM then generates an answer based on the retrieved study material rather than relying only on its general knowledge.

### 8. Frontend Response

The generated response is sent back to the frontend and displayed to the user.

The same processed study material can also be used for features such as:

- Text simplification
- Question answering
- Quiz generation
- Flashcard generation
- Multilingual responses
- Voice-based interaction

---

## System Workflow

```mermaid
flowchart TD

    A[User Uploads Study Document] --> B[Frontend]
    B --> C[Backend API]

    C --> D[Document Processing]
    D --> E[Text Extraction]
    E --> F[Text Chunking]

    F --> G[Generate Embeddings]
    G --> H[Store Embeddings + Text]

    H --> I[(Knowledge Base)]

    J[User Question] --> K[Generate Query Embedding]
    K --> L[Retrieve Relevant Chunks]
    I --> L

    L --> M[Relevant Context]
    M --> N[LLM]
    N --> O[Generated Answer]
    O --> B
    B --> P[Display Response]


## Project Structure

```text
OmniLearn/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── document_processor.py
│   ├── document_service.py
│   ├── embedding_service.py
│   ├── retrieval_service.py
│   ├── rag_service.py
│   ├── simplification_service.py
│   ├── quiz_service.py
│   ├── flashcard_service.py
│   └── voice_service.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── data/
├── tests/
├── .gitignore
└── README.md
