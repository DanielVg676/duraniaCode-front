from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.schemas import ChatRequest, ChatResponse
from app.services.ollama_client import ask_ollama

router = APIRouter(tags=["Chat"])


@router.post("/", response_model=ChatResponse)
def chat(req: ChatRequest):
    """
    Endpoint de chat simple que retorna la respuesta completa.
    """
    response = ask_ollama(req.message)
    return {"response": response}


@router.post("/stream/")
async def chat_stream(req: ChatRequest):
    """
    Endpoint de chat con streaming en tiempo real.
    Retorna la respuesta token por token.
    """
    def generate():
        try:
            for token in ask_ollama(req.message, stream=True):
                yield token
        except Exception:
            yield "\n\nError al obtener respuesta de la IA"

    return StreamingResponse(generate(), media_type="text/plain")
