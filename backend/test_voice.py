from voice_service import transcribe_audio


audio_path = "test_audio_2.wav"

result = transcribe_audio(audio_path)

print("\nTranscribed text:")
print(result["text"])

print("\nDetected language:")
print(result["language"])