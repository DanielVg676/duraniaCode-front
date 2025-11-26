from faster_whisper import WhisperModel
from app.core.config import settings

# Cargamos el modelo usando la configuración
model = WhisperModel(
    settings.WHISPER_MODEL,
    device=settings.WHISPER_DEVICE,
    compute_type=settings.WHISPER_COMPUTE_TYPE
)


def transcribe_audio(audio_path: str) -> str:
    """
    Transcribe un archivo de audio a texto usando Whisper.
    
    Args:
        audio_path: Ruta al archivo de audio
    
    Returns:
        String con el texto transcrito
    """
    segments, _ = model.transcribe(audio_path, language=settings.WHISPER_LANGUAGE)

    text = ""
    for segment in segments:
        text += segment.text + " "

    return text.strip()
