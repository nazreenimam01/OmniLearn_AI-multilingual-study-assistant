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
