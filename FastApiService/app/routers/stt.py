from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
import uuid
import aiofiles
from pathlib import Path
from app.services.stt_service import transcribe_audio
from app.services.ollama_client import ask_ollama
from app.models.schemas import TranscriptionResponse
from app.core.config import settings

router = APIRouter()


@router.post("/stt/", response_model=TranscriptionResponse)
async def speech_to_text(file: UploadFile = File(...)):
    """
    Endpoint simple que transcribe audio a texto.
    """
    # Crear directorio temporal si no existe
    Path(settings.TEMP_DIR).mkdir(exist_ok=True)
    
    # Guardar archivo temporal con nombre único
    file_extension = Path(file.filename).suffix
    temp_filename = f"{uuid.uuid4()}{file_extension}"
    temp_path = Path(settings.TEMP_DIR) / temp_filename

    try:
        # Guardar archivo de forma asíncrona
        async with aiofiles.open(temp_path, "wb") as buffer:
            content = await file.read()
            await buffer.write(content)

        # Procesar con Whisper
        text = transcribe_audio(str(temp_path))

        return {"text": text}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar audio: {str(e)}") from e
    
    finally:
        # Borrar archivo temporal
        if temp_path.exists():
            temp_path.unlink()


@router.post("/stt/chat-stream/")
async def speech_to_text_chat_stream(file: UploadFile = File(...)):
    """
    Endpoint que:
    1. Transcribe el audio a texto
    2. Envía el texto a la IA
    3. Retorna la respuesta de la IA en tiempo real (streaming)
    
    Formato de respuesta:
    - Primera línea: "USER: [texto transcrito]"
    - Siguientes líneas: tokens de la respuesta de la IA en tiempo real
    """
    # Crear directorio temporal si no existe
    Path(settings.TEMP_DIR).mkdir(exist_ok=True)
    
    # Guardar archivo temporal con nombre único
    file_extension = Path(file.filename).suffix
    temp_filename = f"{uuid.uuid4()}{file_extension}"
    temp_path = Path(settings.TEMP_DIR) / temp_filename

    try:
        # Guardar archivo de forma asíncrona
        async with aiofiles.open(temp_path, "wb") as buffer:
            content = await file.read()
            await buffer.write(content)

        # Procesar con Whisper
        transcribed_text = transcribe_audio(str(temp_path))

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al transcribir audio: {str(e)}") from e
    
    finally:
        # Borrar archivo temporal
        if temp_path.exists():
            temp_path.unlink()

    # Función generadora para el streaming
    def generate():
        # Primero enviamos el texto del usuario
        yield f"USER: {transcribed_text}\n\n"
        yield "AI: "
        
        # Luego enviamos la respuesta de la IA en streaming
        try:
            for token in ask_ollama(transcribed_text, stream=True):
                yield token
        except Exception:
            yield "\n\nError al obtener respuesta de la IA"

    return StreamingResponse(generate(), media_type="text/plain")
