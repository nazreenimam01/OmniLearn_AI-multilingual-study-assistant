from quiz_service import generate_quiz


text = """
Photosynthesis is the process by which green plants make their food.
Plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.
Chlorophyll helps plants absorb sunlight.
The process mainly takes place in the leaves.
"""


quiz = generate_quiz(
    text,
    level="simple",
    num_questions=5
)

print("\nQUIZ:\n")

for i, question in enumerate(quiz["questions"], start=1):

    print(f"{i}. {question['question']}")

    for option, value in question["options"].items():
        print(f"   {option}. {value}")

    print("Correct answer:", question["correct_answer"])
    print("Explanation:", question["explanation"])
    print()