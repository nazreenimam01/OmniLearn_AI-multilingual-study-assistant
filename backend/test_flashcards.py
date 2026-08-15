from flashcard_service import generate_flashcards


text = """
Photosynthesis is the process by which green plants make their food.
Plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.
Chlorophyll helps plants absorb sunlight.
The process mainly takes place in the leaves.
"""


flashcards = generate_flashcards(
    text,
    level="simple",
    num_cards=5
)

print("\nFLASHCARDS:\n")

for i, card in enumerate(flashcards["flashcards"], start=1):

    print(f"Card {i}")
    print("Q:", card["question"])
    print("A:", card["answer"])
    print("-" * 50)