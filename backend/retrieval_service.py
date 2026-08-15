from sqlalchemy import text
from database import SessionLocal
from embedding_service import create_embedding


def search_similar_chunks(
    question: str,
    document_name: str,
    limit: int = 5
):
    question_embedding = create_embedding(question)

    db = SessionLocal()

    try:
        query = text("""
            SELECT
                id,
                document_name,
                chunk_text,
                embedding <=> CAST(:embedding AS vector) AS distance
            FROM document_chunks
            WHERE document_name = :document_name
            ORDER BY embedding <=> CAST(:embedding AS vector)
            LIMIT :limit
        """)

        result = db.execute(
            query,
            {
                "embedding": str(question_embedding),
                "document_name": document_name,
                "limit": limit
            }
        )

        return result.fetchall()

    finally:
        db.close()