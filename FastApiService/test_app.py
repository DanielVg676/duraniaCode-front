#!/usr/bin/env python
"""
Script de prueba para verificar el funcionamiento de la API.
"""

import asyncio
import sys
from pathlib import Path

# Agregar el directorio raíz al path
sys.path.insert(0, str(Path(__file__).parent))


async def test_imports():
    """Prueba que todos los módulos se importen correctamente"""
    print("✓ Probando imports...")
    
    try:
        from app.core.config import settings
        print(f"  ✓ Config cargada: {settings.OLLAMA_MODEL}")
        
        from app.models.schemas import ChatRequest, ChatResponse, TranscriptionResponse
        print("  ✓ Modelos cargados")
        
        from app.services.ollama_client import ask_ollama
        print("  ✓ Servicio Ollama cargado")
        
        from app.services.stt_service import transcribe_audio
        print("  ✓ Servicio STT cargado")
        
        from app.routers.chat import router as chat_router
        print("  ✓ Router de chat cargado")
        
        from app.routers.stt import router as stt_router
        print("  ✓ Router de STT cargado")
        
        from main import app
        print("  ✓ App principal cargada")
        
        print("\n✅ Todos los módulos se importaron correctamente!")
        return True
        
    except Exception as e:
        print(f"\n❌ Error al importar: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_app_creation():
    """Prueba que la app FastAPI se cree correctamente"""
    print("\n✓ Probando creación de la app...")
    
    try:
        from main import app
        
        # Verificar rutas
        routes = [route.path for route in app.routes]
        print(f"  ✓ Rutas disponibles: {len(routes)}")
        for route in routes:
            print(f"    - {route}")
        
        print("\n✅ App creada correctamente!")
        return True
        
    except Exception as e:
        print(f"\n❌ Error al crear app: {e}")
        import traceback
        traceback.print_exc()
        return False


async def main():
    """Función principal"""
    print("=" * 60)
    print("🧪 PRUEBA DE FUNCIONAMIENTO - FastAlert API")
    print("=" * 60 + "\n")
    
    # Ejecutar pruebas
    test1 = await test_imports()
    if not test1:
        return
    
    test2 = await test_app_creation()
    if not test2:
        return
    
    print("\n" + "=" * 60)
    print("✅ TODAS LAS PRUEBAS PASARON EXITOSAMENTE")
    print("=" * 60)
    print("\n💡 Puedes iniciar el servidor con:")
    print("   uvicorn main:app --reload")
    print("\n📚 Documentación disponible en:")
    print("   http://localhost:8000/docs")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
