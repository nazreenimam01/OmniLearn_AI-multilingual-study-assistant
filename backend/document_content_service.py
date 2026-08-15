from sqlalchemy import text
from database import SessionLocal


def get_document_text(document_name: str):

    db = SessionLocal()

    try:
        query = text("""
            SELECT chunk_text
            FROM document_chunks
            WHERE document_name = :document_name
            ORDER BY id
        """)

        result = db.execute(
            query,
            {
                "document_name": document_name
            }
        )

        rows = result.fetchall()

        if not rows:
            return None

        document_text = "\n\n".join(
            row.chunk_text
            for row in rows
        )

        return document_text

    finally:
        db.close()