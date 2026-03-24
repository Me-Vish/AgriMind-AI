"""
AgriMind AI - Chat Assistant Routes
RAG-based conversational AI with multilingual support
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from services.chat_service import ChatService

router = APIRouter()
chat_service = ChatService()


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    language: Optional[str] = "en"
    context: Optional[dict] = None  # Optional soil/weather context


class ChatResponse(BaseModel):
    response: str
    sources: Optional[List[str]] = []
    suggested_questions: Optional[List[str]] = []
    language: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Multi-turn conversational assistant with RAG knowledge base.
    Supports English, Tamil, and Hindi responses.
    """
    try:
        result = await chat_service.respond(
            message=request.message,
            history=request.history,
            language=request.language,
            context=request.context
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
