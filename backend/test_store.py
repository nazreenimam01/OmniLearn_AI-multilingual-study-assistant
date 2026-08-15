from database import SessionLocal
from models import DocumentChunk
from embedding_service import create_embedding


db = SessionLocal()

text = "Photosynthesis is the process by which plants make food."

embedding = create_embedding(text)

chunk = DocumentChunk(
    document_name="test.txt",
    chunk_text=text,
    embedding=embedding
)

db.add(chunk)
db.commit()

print("Chunk and embedding stored successfully!")

db.close()