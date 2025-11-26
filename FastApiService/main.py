from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.chat import router as chat_router
from app.routers.stt import router as stt_router

app = FastAPI(
    title="FastAlert API",
    description="API para chat con IA y transcripción de audio",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(stt_router, prefix="/audio", tags=["Audio"])


@app.get("/")
def root():
    return {
        "message": "FastAlert API",
        "endpoints": {
            "chat": "/chat/",
            "chat_stream": "/chat/stream/",
            "stt": "/audio/stt/",
            "stt_chat_stream": "/audio/stt/chat-stream/"
        }
    }
