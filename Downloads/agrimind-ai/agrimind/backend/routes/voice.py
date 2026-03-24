"""
AgriMind AI - Voice Routes
Speech-to-text and text-to-speech endpoints
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from typing import Optional
import os
import uuid
import aiofiles
from services.voice_service import VoiceService

router = APIRouter()
voice_service = VoiceService()


@router.post("/voice/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: Optional[str] = Form("en")
):
    """
    Transcribe audio to text (speech-to-text).
    Supports English, Tamil, Hindi.
    """
    content = await file.read()
    ext = os.path.splitext(file.filename)[1].lower()
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join("uploads", filename)

    async with aiofiles.open(filepath, "wb") as f:
        await f.write(content)

    try:
        transcript = await voice_service.transcribe(filepath, language)
        os.remove(filepath)
        return {"transcript": transcript, "language": language}
    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")


@router.post("/voice/synthesize")
async def synthesize_speech(
    text: str = Form(...),
    language: Optional[str] = Form("en")
):
    """
    Convert text to speech (TTS).
    Returns an audio file for playback.
    """
    try:
        audio_path = await voice_service.synthesize(text, language)
        return FileResponse(
            audio_path,
            media_type="audio/mpeg",
            filename="response.mp3"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")
