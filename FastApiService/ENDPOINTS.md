# 🚀 Endpoints de FastAlert API

Documentación completa de todos los endpoints disponibles en la API.

---

## 📋 Índice

- [Información General](#información-general)
- [Endpoints de Chat](#endpoints-de-chat)
- [Endpoints de Audio](#endpoints-de-audio)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Documentación Interactiva](#documentación-interactiva)

---

## Información General

### Base URL
```
http://localhost:8000
```

### Endpoint Principal

#### **GET /** - Información de la API
Obtiene información general y lista de endpoints disponibles.

**Request:**
```bash
GET http://localhost:8000/
```

**Response:**
```json
{
  "message": "FastAlert API",
  "endpoints": {
    "chat": "/chat/",
    "chat_stream": "/chat/stream/",
    "stt": "/audio/stt/",
    "stt_chat_stream": "/audio/stt/chat-stream/"
  }
}
```

---

## Endpoints de Chat

### 1. Chat Simple

#### **POST /chat/** - Respuesta Completa
Envía un mensaje y recibe una respuesta completa de la IA.

**Request:**
```bash
POST http://localhost:8000/chat/
Content-Type: application/json
```

**Body:**
```json
{
  "message": "¿Cuál es la capital de Francia?"
}
```

**Response:**
```json
{
  "response": "La capital de Francia es París. Es una de las ciudades más importantes de Europa..."
}
```

---

### 2. Chat con Streaming ⭐

#### **POST /chat/stream/** - Respuesta en Tiempo Real
Envía un mensaje y recibe la respuesta token por token en tiempo real.

**Request:**
```bash
POST http://localhost:8000/chat/stream/
Content-Type: application/json
```

**Body:**
```json
{
  "message": "Cuéntame un chiste corto"
}
```

**Response:** 
Stream de texto plano que llega token por token.

```
¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter.
```

---

## Endpoints de Audio

### 3. Speech-to-Text Simple

#### **POST /audio/stt/** - Solo Transcripción
Transcribe un archivo de audio a texto.

**Request:**
```bash
POST http://localhost:8000/audio/stt/
Content-Type: multipart/form-data
```

**Body (Form Data):**
- `file`: Archivo de audio (mp3, wav, m4a, webm, ogg, etc.)

**Response:**
```json
{
  "text": "Hola, este es el texto transcrito del audio"
}
```

**Formatos de audio soportados:**
- MP3
- WAV
- M4A
- WebM
- OGG
- FLAC

---

### 4. STT + Chat con Streaming ⭐⭐ **PRINCIPAL**

#### **POST /audio/stt/chat-stream/** - Transcripción + Respuesta IA en Tiempo Real
El endpoint más completo. Transcribe el audio, muestra el texto del usuario, y retorna la respuesta de la IA en tiempo real.

**Request:**
```bash
POST http://localhost:8000/audio/stt/chat-stream/
Content-Type: multipart/form-data
```

**Body (Form Data):**
- `file`: Archivo de audio

**Response (Stream de texto):**
```
USER: ¿Cuál es la diferencia entre Python y JavaScript?

AI: Python y JavaScript son dos lenguajes de programación muy diferentes. Python es un lenguaje interpretado de alto nivel, conocido por su sintaxis clara y legible...
```

**Formato de respuesta:**
1. Primera línea: `USER: [texto transcrito]`
2. Línea vacía
3. Respuesta de la IA en tiempo real: `AI: [respuesta token por token]`

---

## Ejemplos de Uso

### Con cURL

#### Chat Simple
```bash
curl -X POST http://localhost:8000/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola, ¿cómo estás?"}'
```

#### Chat con Streaming
```bash
curl -X POST http://localhost:8000/chat/stream/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Explícame qué es Python"}' \
  --no-buffer
```

#### STT Simple
```bash
curl -X POST http://localhost:8000/audio/stt/ \
  -F "file=@ruta/a/tu/audio.mp3"
```

#### STT + Chat Streaming (Principal)
```bash
curl -X POST http://localhost:8000/audio/stt/chat-stream/ \
  -F "file=@ruta/a/tu/audio.wav" \
  --no-buffer
```

**Nota:** El flag `--no-buffer` es importante para ver el streaming en tiempo real.

---

### Con Python (requests)

```python
import requests

# ====================================
# 1. Chat Simple
# ====================================
response = requests.post(
    "http://localhost:8000/chat/",
    json={"message": "Hola, ¿cómo estás?"}
)
print(response.json()["response"])


# ====================================
# 2. Chat Streaming
# ====================================
response = requests.post(
    "http://localhost:8000/chat/stream/",
    json={"message": "Cuéntame un chiste"},
    stream=True
)

print("Respuesta: ", end="", flush=True)
for chunk in response.iter_content(chunk_size=1):
    if chunk:
        print(chunk.decode('utf-8'), end='', flush=True)
print("\n")


# ====================================
# 3. STT Simple
# ====================================
with open('audio.mp3', 'rb') as audio_file:
    files = {'file': audio_file}
    response = requests.post(
        "http://localhost:8000/audio/stt/",
        files=files
    )
    print(f"Transcripción: {response.json()['text']}")


# ====================================
# 4. STT + Chat Streaming (Principal)
# ====================================
with open('audio.mp3', 'rb') as audio_file:
    files = {'file': audio_file}
    response = requests.post(
        "http://localhost:8000/audio/stt/chat-stream/",
        files=files,
        stream=True
    )
    
    for chunk in response.iter_content(chunk_size=1):
        if chunk:
            print(chunk.decode('utf-8'), end='', flush=True)
    print("\n")
```

---

### Con JavaScript (Fetch)

```javascript
// ====================================
// 1. Chat Simple
// ====================================
async function chatSimple() {
  const response = await fetch('http://localhost:8000/chat/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Hola, ¿cómo estás?' })
  });
  
  const data = await response.json();
  console.log(data.response);
}


// ====================================
// 2. Chat Streaming
// ====================================
async function chatStreaming() {
  const response = await fetch('http://localhost:8000/chat/stream/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Cuéntame un chiste' })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const text = decoder.decode(value);
    console.log(text); // O mostrar en el DOM en tiempo real
  }
}


// ====================================
// 3. STT Simple
// ====================================
async function sttSimple(audioBlob) {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');

  const response = await fetch('http://localhost:8000/audio/stt/', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  console.log('Transcripción:', data.text);
}


// ====================================
// 4. STT + Chat Streaming (Principal)
// ====================================
async function sttChatStreaming(audioBlob) {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');

  const response = await fetch('http://localhost:8000/audio/stt/chat-stream/', {
    method: 'POST',
    body: formData
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let fullText = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const text = decoder.decode(value);
    fullText += text;
    
    // Mostrar en el chat en tiempo real
    document.getElementById('chat').innerHTML = fullText;
  }
}


// ====================================
// Ejemplo de uso con grabación de audio
// ====================================
let mediaRecorder;
let audioChunks = [];

// Iniciar grabación
async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  
  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };
  
  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    audioChunks = [];
    
    // Enviar a la API
    await sttChatStreaming(audioBlob);
  };
  
  mediaRecorder.start();
}

// Detener grabación
function stopRecording() {
  mediaRecorder.stop();
}
```

---

### Con Postman

#### 1. Chat Simple
1. Método: `POST`
2. URL: `http://localhost:8000/chat/`
3. Headers: `Content-Type: application/json`
4. Body → raw → JSON:
   ```json
   {
     "message": "Hola, ¿cómo estás?"
   }
   ```

#### 2. Chat Streaming
1. Método: `POST`
2. URL: `http://localhost:8000/chat/stream/`
3. Headers: `Content-Type: application/json`
4. Body → raw → JSON:
   ```json
   {
     "message": "Cuéntame sobre Python"
   }
   ```
5. **Importante:** Habilitar "Stream" en las opciones de respuesta

#### 3. STT Simple
1. Método: `POST`
2. URL: `http://localhost:8000/audio/stt/`
3. Body → form-data
4. Key: `file` (cambiar tipo a "File")
5. Value: Seleccionar tu archivo de audio

#### 4. STT + Chat Streaming
1. Método: `POST`
2. URL: `http://localhost:8000/audio/stt/chat-stream/`
3. Body → form-data
4. Key: `file` (cambiar tipo a "File")
5. Value: Seleccionar tu archivo de audio
6. **Importante:** Habilitar "Stream" en las opciones de respuesta

---

## Documentación Interactiva

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva:

### Swagger UI (Recomendado)
```
http://localhost:8000/docs
```
Interfaz interactiva donde puedes probar todos los endpoints directamente desde el navegador.

### ReDoc
```
http://localhost:8000/redoc
```
Documentación alternativa con un formato más limpio y organizado.

---

## Iniciar el Servidor

```bash
# Navegar al directorio del proyecto
cd /c/Users/kille/Desktop/DuraniaAppFast/fastalert-api

# Activar el entorno virtual (si no está activado)
source venv/Scripts/activate

# Iniciar el servidor
uvicorn main:app --reload
```

El servidor estará disponible en: `http://localhost:8000`

---

## Notas Importantes

### Formatos de Audio Soportados
- MP3 (más común)
- WAV (mejor calidad)
- M4A (Apple)
- WebM (navegadores web)
- OGG
- FLAC (sin pérdida)

### Límites y Consideraciones
- El modelo Whisper procesa audio en español (`es`) por defecto
- Los archivos de audio se eliminan automáticamente después de procesarse
- El directorio temporal `temp_audio/` se crea automáticamente
- Para streaming, asegúrate de usar `--no-buffer` en cURL o habilitar streaming en tu cliente

### Configuración
Todas las configuraciones están en `app/core/config.py` y pueden ser sobrescritas con variables de entorno:

- `OLLAMA_URL`: URL del servidor Ollama (default: `http://localhost:11434/api/chat`)
- `OLLAMA_MODEL`: Modelo de IA (default: `phi3.5:3.8b`)
- `WHISPER_MODEL`: Modelo de Whisper (default: `base`)
- `WHISPER_LANGUAGE`: Idioma (default: `es`)
- `TEMP_DIR`: Directorio temporal (default: `temp_audio`)

---

## Solución de Problemas

### El servidor no inicia
```bash
# Verificar que Ollama está corriendo
ollama list

# Verificar que el modelo está descargado
ollama pull phi3.5:3.8b

# Reinstalar dependencias
pip install -r requirements.txt
```

### Error al procesar audio
- Verifica que el archivo de audio sea válido
- Asegúrate de que no esté corrupto
- Intenta con un formato diferente (WAV es el más compatible)

### Respuesta lenta de la IA
- Depende del modelo Ollama y tu hardware
- Considera usar un modelo más pequeño si es muy lento
- Para producción, considera usar GPU

---

## Contacto y Soporte

Para más información, consulta el `README.md` principal del proyecto.
