import ollama


def generate_flashcards(
    text: str,
    level: str = "simple",
    num_cards: int = 10
):

    level_instructions = {
        "simple": """
Create beginner-friendly flashcards.
Focus on definitions, important facts, key terms,
and basic concepts.
Keep answers short and easy to understand.
""",

        "medium": """
Create intermediate-level flashcards.
Focus on conceptual understanding, relationships
between concepts, and simple applications.
""",

        "advanced": """
Create advanced-level flashcards.
Focus on deeper understanding, comparisons,
reasoning, applications, and important details.
"""
    }

    instructions = level_instructions.get(
        level.lower(),
        level_instructions["simple"]
    )

    # -------------------------------------------------
    # JSON SCHEMA
    # -------------------------------------------------

    flashcard_schema = {
        "type": "object",
        "properties": {
            "flashcards": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "question": {
                            "type": "string"
                        },
                        "answer": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "question",
                        "answer"
                    ],
                    "additionalProperties": False
                },
                "minItems": num_cards,
                "maxItems": num_cards
            }
        },
        "required": [
            "flashcards"
        ],
        "additionalProperties": False
    }

    # -------------------------------------------------
    # PROMPT
    # -------------------------------------------------

    prompt = f"""
You are OmniLearn, an AI study assistant.

Your ONLY task is to create flashcards from the
study material provided below.

IMPORTANT:

1. Create exactly {num_cards} flashcards.
2. Use ONLY information found in the study material.
3. Do NOT generate code.
4. Do NOT describe classes, objects, properties,
   methods, implementations, or program structure
   unless the study material itself is specifically
   teaching that concept.
5. Every flashcard must have:
   - question
   - answer
6. Questions should test important concepts from
   the study material.
7. Answers should be concise and educational.
8. Do not invent information.

Difficulty level:

{level}

{instructions}

The response MUST follow the provided JSON schema.

Study material:

{text}
"""

    try:

        print("\n========== FLASHCARD INPUT ==========")
        print("Text length:", len(text))
        print("Requested cards:", num_cards)
        print("Level:", level)
        print("=====================================\n")

        response = ollama.chat(
            model="qwen3:4b",

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a flashcard generator. "
                        "Always follow the requested JSON schema. "
                        "Never return any structure other than "
                        "the flashcards object."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            # IMPORTANT:
            # Use JSON SCHEMA instead of just format="json"
            format=flashcard_schema,

            options={
                "temperature": 0
            }
        )

        content = response["message"]["content"].strip()

        print("\n========== RAW AI RESPONSE ==========")
        print(content)
        print("=====================================\n")

        # -------------------------------------------------
        # PARSE JSON
        # -------------------------------------------------

        import json

        try:
            result = json.loads(content)

        except json.JSONDecodeError as e:

            print("\n========== JSON ERROR ==========")
            print(str(e))
            print("================================\n")

            raise ValueError(
                "AI returned invalid JSON."
            )

        print("\n========== PARSED JSON ==========")
        print(result)
        print("=================================\n")

        # -------------------------------------------------
        # VALIDATE TOP LEVEL
        # -------------------------------------------------

        if not isinstance(result, dict):

            raise ValueError(
                "AI response is not a JSON object."
            )

        if "flashcards" not in result:

            raise ValueError(
                "AI response does not contain 'flashcards'."
            )

        cards = result["flashcards"]

        if not isinstance(cards, list):

            raise ValueError(
                "'flashcards' must be a list."
            )

        # -------------------------------------------------
        # VALIDATE EACH FLASHCARD
        # -------------------------------------------------

        valid_cards = []

        for card in cards:

            if not isinstance(card, dict):
                continue

            question = card.get("question")
            answer = card.get("answer")

            if question is None or answer is None:
                continue

            question = str(question).strip()
            answer = str(answer).strip()

            if not question or not answer:
                continue

            valid_cards.append({
                "question": question,
                "answer": answer
            })

        # -------------------------------------------------
        # FINAL VALIDATION
        # -------------------------------------------------

        if not valid_cards:

            raise ValueError(
                "AI response contained no valid flashcards."
            )

        if len(valid_cards) < num_cards:

            print(
                f"WARNING: Requested {num_cards} cards "
                f"but received {len(valid_cards)}."
            )

        # Return only requested number
        valid_cards = valid_cards[:num_cards]

        print(
            f"Successfully generated "
            f"{len(valid_cards)} flashcards."
        )

        return {
            "flashcards": valid_cards
        }

    except Exception as e:

        print(
            "\n========== FLASHCARD SERVICE ERROR =========="
        )

        print(str(e))

        print(
            "=============================================\n"
        )

        raise