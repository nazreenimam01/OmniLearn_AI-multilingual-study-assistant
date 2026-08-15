import whisper


# Load the Whisper model once when the application starts
model = whisper.load_model("medium")


def transcribe_audio(audio_path: str):

    result = model.transcribe(
        audio_path,
        task="transcribe",
        fp16=False,
        temperature=0,
        beam_size=5,
        condition_on_previous_text=False
    )

    return {
        "text": result["text"].strip(),
        "language": result["language"]
    }