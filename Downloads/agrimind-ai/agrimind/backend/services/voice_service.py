"""
AgriMind AI - Voice Service
Speech-to-text (Whisper/SpeechRecognition) and Text-to-Speech (gTTS)
"""

import os
import uuid
from gtts import gTTS

LANGUAGE_MAP = {
    "en": "en",
    "ta": "ta",
    "hi": "hi",
}

OUTPUT_DIR = "uploads"


class VoiceService:
    def __init__(self):
        os.makedirs(OUTPUT_DIR, exist_ok=True)

    async def transcribe(self, audio_path: str, language: str = "en") -> str:
        """
        Transcribe audio file to text.
        Uses SpeechRecognition with Google Web Speech API.
        """
        try:
            import speech_recognition as sr

            recognizer = sr.Recognizer()
            lang_code = {"en": "en-IN", "ta": "ta-IN", "hi": "hi-IN"}.get(language, "en-IN")

            with sr.AudioFile(audio_path) as source:
                recognizer.adjust_for_ambient_noise(source, duration=0.5)
                audio_data = recognizer.record(source)

            transcript = recognizer.recognize_google(audio_data, language=lang_code)
            return transcript

        except Exception as e:
            return f"[Transcription unavailable: {str(e)}]"

    async def synthesize(self, text: str, language: str = "en") -> str:
        """
        Convert text to speech using gTTS.
        Returns path to generated audio file.
        """
        tts_lang = LANGUAGE_MAP.get(language, "en")
        filename = f"tts_{uuid.uuid4()}.mp3"
        output_path = os.path.join(OUTPUT_DIR, filename)

        try:
            tts = gTTS(text=text, lang=tts_lang, slow=False)
            tts.save(output_path)
            return output_path
        except Exception as e:
            raise RuntimeError(f"TTS generation failed: {str(e)}")
