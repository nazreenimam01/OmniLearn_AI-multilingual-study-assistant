import os
import shutil
from fastapi import UploadFile, File, HTTPException
from voice_service import transcribe_audio
from document_processor import extract_text_from_pdf, extract_text_from_docx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_service import generate_rag_answer
from document_service import process_document
from simplification_service import simplify_text
from quiz_service import generate_quiz
from flashcard_service import generate_flashcards
from document_content_service import get_document_text
import ollama

app = FastAPI(
    title="AI Multilingual Study Assistant",
    description="Backend API for the AI multilingual study assistant",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QuestionRequest(BaseModel):
    question: str

class DocumentQuestion(BaseModel):
    question: str
    document_name: str
    language: str = "English"

class SimplifyRequest(BaseModel):
    text: str
    level: str = "simple"

class QuizRequest(BaseModel):
    document_name: str
    level: str = "simple"
    num_questions: int = 5

class FlashcardRequest(BaseModel):
    document_name: str
    level: str = "simple"
    num_cards: int = 5

@app.get("/")
def root():
    return {
        "message": "AI Multilingual Study Assistant is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/ask")
def ask_question(request: QuestionRequest):
    response = ollama.chat(
        model="qwen3:4b",
        messages=[
            {
                "role": "user",
                "content": request.question
            }
        ]
    )

    return {
        "question": request.question,
        "answer": response["message"]["content"]
    }
@app.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):

    allowed_extensions = [".pdf", ".docx"]

    file_extension = os.path.splitext(file.filename)[1].lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported."
        )

    upload_folder = "uploads"
    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(upload_folder, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if file_extension == ".pdf":
        text = extract_text_from_pdf(file_path)
    else:
        text = extract_text_from_docx(file_path)

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text found in the document."
        )

    number_of_chunks = process_document(
        file.filename,
        text
    )

    return {
        "filename": file.filename,
        "text_length": len(text),
        "chunks_stored": number_of_chunks,
        "message": "Document processed and stored successfully."
    }

@app.post("/ask-document")
async def ask_document(data: DocumentQuestion):
    answer = generate_rag_answer(data.question, data.document_name, language=data.language)

    return {
        "question": data.question,
        "document_name": data.document_name,
        "language": data.language,
        "answer": answer
    }

@app.post("/simplify")
def simplify(request: SimplifyRequest):

    simplified = simplify_text(
        request.text,
        request.level
    )

    return {
        "original_text": request.text,
        "simplified_text": simplified,
        "level": request.level
    }

@app.post("/generate-quiz")
def generate_quiz_endpoint(request: QuizRequest):

    # Validate difficulty
    if request.level.lower() not in ["simple", "medium", "advanced"]:
        raise HTTPException(
            status_code=400,
            detail="Level must be simple, medium, or advanced."
        )

    # Validate number of questions
    if request.num_questions < 1 or request.num_questions > 20:
        raise HTTPException(
            status_code=400,
            detail="Number of questions must be between 1 and 20."
        )

    # Get document text
    try:
        document_text = get_document_text(request.document_name)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading document: {str(e)}"
        )

    if not document_text:
        raise HTTPException(
            status_code=404,
            detail="Document not found or document is empty."
        )

    # Generate quiz
    try:
        quiz = generate_quiz(
            document_text,
            request.level,
            request.num_questions
        )

    except ValueError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Quiz generation returned invalid JSON: {str(e)}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Quiz generation failed: {str(e)}"
        )

    # Validate generated quiz
    if not isinstance(quiz, dict):
        raise HTTPException(
            status_code=500,
            detail="Quiz generation returned an invalid response."
        )

    if "questions" not in quiz:
        raise HTTPException(
            status_code=500,
            detail="Generated quiz does not contain questions."
        )

    return {
        "document_name": request.document_name,
        "level": request.level,
        "num_questions": request.num_questions,
        "quiz": quiz
    }
@app.post("/generate-flashcards")
def generate_flashcards_endpoint(request: FlashcardRequest):

    if request.level.lower() not in [
        "simple",
        "medium",
        "advanced"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Level must be simple, medium, or advanced."
        )

    if request.num_cards < 1 or request.num_cards > 20:
        raise HTTPException(
            status_code=400,
            detail="Number of flashcards must be between 1 and 20."
        )

    document_text = get_document_text(
        request.document_name
    )

    if not document_text:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    try:

        flashcards = generate_flashcards(
            document_text,
            request.level,
            request.num_cards
        )

        return {
            "document_name": request.document_name,
            "level": request.level,
            "num_cards": request.num_cards,
            "flashcards": flashcards["flashcards"]
        }

    except Exception as e:

        print("FLASHCARD GENERATION ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@app.post("/ask-voice")
async def ask_voice(file: UploadFile = File(...)):

    # Save uploaded audio temporarily
    audio_folder = "uploads"
    os.makedirs(audio_folder, exist_ok=True)

    audio_path = os.path.join(audio_folder, file.filename)

    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Transcribe audio and detect language
    result = transcribe_audio(audio_path)

    question = result["text"]
    language = result["language"]

    # Ask Ollama in the detected language
    prompt = f"""
You are a multilingual AI study assistant.

The user asked this question in language code: {language}

Question:
{question}

Answer the question clearly and educationally.
Give the answer in the SAME LANGUAGE as the question.
"""

    response = ollama.chat(
        model="qwen3:4b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return {
        "question": question,
        "language": language,
        "answer": response["message"]["content"]
    }