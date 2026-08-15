const API_BASE_URL = "http://127.0.0.1:8000";


/* ================================
   HEALTH CHECK
================================ */

export async function checkBackend() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("Backend is not responding.");
  }

  return response.json();
}


/* ================================
   DOCUMENT UPLOAD
================================ */

export async function uploadDocument(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/upload-document`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Document upload failed."
    );
  }

  return data;
}


/* ================================
   DOCUMENT SIMPLIFICATION
================================ */

export async function simplifyText(text, level = "simple") {
  const response = await fetch(
    `${API_BASE_URL}/simplify`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        text,
        level,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Text simplification failed."
    );
  }

  return data;
}


/* ================================
   QUIZ GENERATION
================================ */

export async function generateQuiz(
  documentName,
  level = "simple",
  numQuestions = 5
) {
  const response = await fetch(
    `${API_BASE_URL}/generate-quiz`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        document_name: documentName,
        level,
        num_questions: numQuestions,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Quiz generation failed."
    );
  }

  return data;
}


/* ================================
   FLASHCARD GENERATION
================================ */

export async function generateFlashcards(
  documentName,
  level = "simple",
  numCards = 5
) {
  const response = await fetch(
    `${API_BASE_URL}/generate-flashcards`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        document_name: documentName,
        level,
        num_cards: numCards,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Flashcard generation failed."
    );
  }

  return data;
}


/* ================================
   ASK DOCUMENT / RAG
================================ */

export async function askDocument(
  question,
  documentName,
  language = "English"
) {
  const response = await fetch(
    `${API_BASE_URL}/ask-document`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        question,
        document_name: documentName,
        language,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Unable to get answer."
    );
  }

  return data;
}


/* ================================
   GENERAL AI QUESTION
================================ */

export async function askQuestion(question) {
  const response = await fetch(
    `${API_BASE_URL}/ask`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        question,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Unable to get AI answer."
    );
  }

  return data;
}


/* ================================
   VOICE QUESTION
================================ */

export async function askVoice(audioFile) {
  const formData = new FormData();

  formData.append("file", audioFile);

  const response = await fetch(
    `${API_BASE_URL}/ask-voice`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Voice processing failed."
    );
  }

  return data;
}