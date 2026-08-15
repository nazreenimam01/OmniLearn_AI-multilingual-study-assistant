from rag_service import generate_rag_answer


question = "How do plants make their food?"

answer = generate_rag_answer(question)

print("\nRAG ANSWER:\n")
print(answer)