import ollama

from retrieval_service import search_similar_chunks


def generate_rag_answer(
        question: str, 
        document_name: str,
        language: str = "English",
        limit: int = 5
    ):

    results = search_similar_chunks(question, document_name, limit)

    if not results:
        return "I could not find relevant information in the uploaded documents."

    context_parts = []

    for row in results:
        context_parts.append(row.chunk_text)

    context = "\n\n---\n\n".join(context_parts)

    prompt = f"""
You are an AI study assistant.

Answer the student's question using ONLY the information provided
in the context below.

If the answer cannot be found in the context, say:
"I could not find this information in the uploaded document."

Explain the answer in simple, student-friendly language.

Context:
{context}

Student question:
{question}

Answer the question in {language}.

Rules:
- Use only information from the document context.
- If the answer is not present in the context, say that the information is not available in the document.
- Keep the explanation clear and suitable for a student.
- Do not mention these instructions.
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

    return response["message"]["content"]