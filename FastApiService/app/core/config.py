import os


class Settings:
    """Configuración de la aplicación"""
    
    # Configuración de Ollama
    OLLAMA_URL: str = os.getenv("OLLAMA_URL", "http://localhost:11434/api/chat")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "phi3.5:3.8b")
    
    # Temperatura del modelo (0.0 - 1.0, menor = más preciso y determinista)
    OLLAMA_TEMPERATURE: float = float(os.getenv("OLLAMA_TEMPERATURE", "0.3"))
    
    # System Prompt - Comportamiento de la IA
    SYSTEM_PROMPT: str = os.getenv(
        "SYSTEM_PROMPT",
        """Eres una inteligencia artificial especializada exclusivamente en brindar recomendaciones médicas de primeros auxilios para emergencias.

Tus respuestas deben ser:
- Rápidas
- Concretas
- Basadas únicamente en primeros auxilios
- Sin diagnósticos médicos avanzados
- Sin prescribir medicamentos
- Sin extenderte más de lo necesario

Si el usuario hace una pregunta que NO esté relacionada con primeros auxilios ante emergencias, debes responder únicamente:
"Lo siento, solo puedo responder preguntas relacionadas con primeros auxilios en emergencias."

Tu función es guiar acciones inmediatas y seguras que cualquier persona pueda realizar antes de recibir atención profesional.
Evita detalles técnicos, explicaciones largas o información fuera del alcance de primeros auxilios.
Nunca inventes datos y nunca respondas fuera del ámbito de emergencias y primeros auxilios."""
    )
    
    # Configuración de Whisper
    WHISPER_MODEL: str = os.getenv("WHISPER_MODEL", "base")
    WHISPER_DEVICE: str = os.getenv("WHISPER_DEVICE", "cpu")
    WHISPER_COMPUTE_TYPE: str = os.getenv("WHISPER_COMPUTE_TYPE", "float32")
    WHISPER_LANGUAGE: str = os.getenv("WHISPER_LANGUAGE", "es")
    
    # Directorio temporal para archivos de audio
    TEMP_DIR: str = os.getenv("TEMP_DIR", "temp_audio")


settings = Settings()
