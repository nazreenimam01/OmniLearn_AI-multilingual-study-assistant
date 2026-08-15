from document_service import process_document


text = """
Photosynthesis is the process by which green plants make their food.
Plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.
Chlorophyll helps plants absorb sunlight.
This process mainly takes place in the leaves.
""" * 100


number_of_chunks = process_document(
    "photosynthesis_test.txt",
    text
)

print(f"Stored {number_of_chunks} chunks successfully!")