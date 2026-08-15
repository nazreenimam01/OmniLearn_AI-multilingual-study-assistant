import ollama


def simplify_text(text: str, level: str = "simple"):

    level_instructions = {
        "simple": """
Explain the text using very simple language.
Assume the student is a beginner.
Use short sentences and explain difficult terms.
""",

        "medium": """
Simplify the text while keeping important technical terminology.
Assume the student has basic knowledge of the subject.
""",

        "advanced": """
Make the text clearer and easier to understand while preserving
technical terminology, important details, and relationships between concepts.
"""
    }

    instructions = level_instructions.get(
        level.lower(),
        level_instructions["simple"]
    )

    prompt = f"""
You are an AI study assistant.

Your task is to simplify educational content.

{instructions}

Rules:
- Preserve the original meaning.
- Do not remove important facts.
- Do not invent information.
- Explain difficult terminology when appropriate.
- Organize the answer using headings or bullet points when useful.

Original text:
{text}

Simplified text:
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