from retrieval_service import search_similar_chunks


question = "How do plants make their food?"

results = search_similar_chunks(question, limit=3)

print("\nRetrieved chunks:\n")

for row in results:
    print("Document:", row.document_name)
    print("Distance:", row.distance)
    print("Text:", row.chunk_text[:300])
    print("-" * 60)