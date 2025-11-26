import requests
from app.core.config import settings


def ask_ollama(message: str, model: str = None, stream: bool = False):
    """
    Envía un mensaje a Ollama y obtiene una respuesta.
    
    Args:
        message: El mensaje del usuario
        model: Modelo a usar (por defecto usa el de configuración)
        stream: Si True, devuelve un generador para streaming
    
    Returns:
        String con la respuesta o generador si stream=True
    """
    if model is None:
        model = settings.OLLAMA_MODEL
        
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": settings.SYSTEM_PROMPT},
            {"role": "user", "content": message}
        ],
        "stream": stream,
        "options": {
            "temperature": settings.OLLAMA_TEMPERATURE
        }
    }

    response = requests.post(settings.OLLAMA_URL, json=payload, stream=stream, timeout=300)
    response.raise_for_status()
    
    if stream:
        # Retorna un generador para streaming
        return _stream_response(response)
    else:
        data = response.json()
        return data["message"]["content"]


def _stream_response(response):
    """Generador para procesar respuestas en streaming de Ollama"""
    import json
    
    for line in response.iter_lines():
        if line:
            try:
                chunk = json.loads(line)
                if "message" in chunk and "content" in chunk["message"]:
                    yield chunk["message"]["content"]
            except json.JSONDecodeError:
                continue
