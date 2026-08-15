import ollama


def create_embedding(text: str):
    response = ollama.embed(
        model="qwen3-embedding:0.6b",
        input=text
    )

    return response["embeddings"][0]