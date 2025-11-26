# FastAlert API

API para chat con IA y transcripción de audio usando Ollama y Whisper.

## 📋 Requisitos Previos

- Python 3.8+
- Ollama instalado y corriendo localmente

### Instalar Ollama

1. **Descargar Ollama:**
   - Visita: https://ollama.com/download
   - Descarga e instala según tu sistema operativo (Windows, macOS, Linux)

2. **Descargar el modelo de IA:**
   ```bash
   ollama pull phi3.5:3.8b
   ```

3. **Verificar instalación:**
   ```bash
   ollama list
   ```

4. **Iniciar Ollama** (si no inicia automáticamente):
   ```bash
   ollama serve
   ```

### Modelos Alternativos

Si `phi3.5:3.8b` es muy lento o pesado para tu hardware, prueba con:
```bash
# Más rápido, menos preciso
ollama pull phi3.5:mini

# O usa otro modelo
ollama pull llama3.2:3b
```

Luego actualiza la variable `OLLAMA_MODEL` en tu archivo `.env`

## 🚀 Instalación

1. Clonar el repositorio

2. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```

3. (Opcional) Crear archivo `.env` basado en `.env.example` para personalizar configuración

## ▶️ Ejecutar

```bash
uvicorn main:app --reload
```

La API estará disponible en: `http://localhost:8000`

## 📚 Documentación

- **Endpoints detallados**: Ver [ENDPOINTS.md](ENDPOINTS.md) para ejemplos completos de uso
- **Swagger UI**: `http://localhost:8000/docs` (documentación interactiva)
- **ReDoc**: `http://localhost:8000/redoc`

## 📁 Estructura del Proyecto

```
fastalert-api/
├── app/
│   ├── core/              # Configuración central
│   ├── models/            # Modelos Pydantic
│   ├── routers/           # Endpoints
│   ├── services/          # Lógica de negocio
│   └── utils/             # Utilidades
├── temp_audio/            # Directorio temporal (auto-generado)
├── main.py                # Punto de entrada
├── requirements.txt
├── ENDPOINTS.md           # Documentación de endpoints
└── README.md
```

## 🔧 Configuración

Variables de entorno disponibles (crear archivo `.env`):

- `OLLAMA_URL`: URL del servidor Ollama (default: `http://localhost:11434/api/chat`)
- `OLLAMA_MODEL`: Modelo de Ollama (default: `phi3.5:3.8b`)
- `OLLAMA_TEMPERATURE`: Temperatura del modelo 0.0-1.0 (default: `0.3`)
- `SYSTEM_PROMPT`: Instrucciones de comportamiento de la IA (opcional)
- `WHISPER_MODEL`: Modelo de Whisper (default: `base`)
- `WHISPER_DEVICE`: cpu o cuda (default: `cpu`)
- `WHISPER_LANGUAGE`: Idioma (default: `es`)
- `TEMP_DIR`: Directorio temporal (default: `temp_audio`)

### Personalizar el Comportamiento de la IA

El sistema prompt por defecto configura la IA como asistente de primeros auxilios. Para personalizarlo:

1. Edita directamente `app/core/config.py` en la variable `SYSTEM_PROMPT`
2. O crea un archivo `.env` y define `SYSTEM_PROMPT` con tu texto personalizado

## 🎯 Endpoints Principales

### 1. Chat con Streaming
```
POST /chat/stream/
```
Envía un mensaje y recibe respuesta en tiempo real.

### 2. STT + Chat Streaming ⭐
```
POST /audio/stt/chat-stream/
```
Transcribe audio y obtiene respuesta de IA en tiempo real.

**Ver [ENDPOINTS.md](ENDPOINTS.md) para ejemplos detallados de uso con cURL, Python, JavaScript y Postman.**

## 📝 Notas

- Los archivos de audio se eliminan automáticamente después de ser procesados
- El directorio `temp_audio` se crea automáticamente si no existe
- Formatos de audio soportados: MP3, WAV, M4A, WebM, OGG, FLAC
- Para mejor rendimiento en transcripción, considera usar GPU con CUDA