from pydantic import BaseModel


class ChatRequest(BaseModel):
    """Modelo para solicitudes de chat"""
    message: str


class ChatResponse(BaseModel):
    """Modelo para respuestas de chat"""
    response: str


class TranscriptionResponse(BaseModel):
    """Modelo para respuesta de transcripción"""
    text: str
