# Solución: Notificación de Monitoreo de Accidentes No Se Muestra

## Problema
La notificación persistente "Monitoreando choques..." no aparece cuando se activa el servicio de detección de accidentes.

## Causa Raíz
En **Android 13+ (API 33+)**, el permiso `POST_NOTIFICATIONS` debe solicitarse explícitamente en tiempo de ejecución, no solo declararse en el `AndroidManifest.xml`.

## Cambios Implementados

### 1. CrashModule.kt - Verificación de Permisos
**Ubicación:** `android/app/src/main/java/com/anonymous/FirstAid/CrashModule.kt`

Se agregó verificación de permisos antes de iniciar el servicio:
- Verifica si el dispositivo usa Android 13+
- Solicita el permiso `POST_NOTIFICATIONS` si no está otorgado
- Rechaza la promesa con error si no hay permisos

### 2. index.ts - Solicitud de Permisos desde JS
**Ubicación:** `src/native/crash/index.ts`

Se agregó función para solicitar permisos usando `expo-notifications`:
- Verifica permisos existentes
- Solicita permisos al usuario
- Muestra alerta si se deniegan
- Solo inicia el servicio si los permisos están otorgados

### 3. Dependencia Instalada
```bash
npx expo install expo-notifications
```

## Cómo Probar

### Paso 1: Reconstruir la Aplicación
```bash
cd C:\dev\ui2\First-Aid
npx expo run:android
```

### Paso 2: Primera Vez - Otorgar Permisos
1. Abrir la aplicación
2. Navegar a la pantalla Home
3. Activar el switch de monitoreo de accidentes
4. **IMPORTANTE:** Aparecerá un diálogo de Android solicitando permiso de notificaciones
5. Presionar **"Permitir"** o **"Allow"**

### Paso 3: Verificar la Notificación
Una vez otorgado el permiso:
- Deslizar desde la parte superior de la pantalla (panel de notificaciones)
- Deberías ver una notificación persistente que dice:
  - **Título:** "Monitoreo activo"
  - **Contenido:** "Monitoreando choques y giros bruscos…"
  - **Icono:** ℹ️ (información)

### Paso 4: Probar Alertas
Para verificar que el sistema funciona correctamente:
1. Con el monitoreo activo
2. Sacude el dispositivo bruscamente (simula un choque)
3. Deberías recibir una alerta de notificación:
   - "Choque leve detectado" o
   - "Choque fuerte detectado" o
   - "Giro brusco detectado"

## Debugging

### Si la notificación no aparece:

#### Opción A: Verificar Permisos Manualmente
1. Ir a **Configuración** del dispositivo
2. **Aplicaciones** → **First Aid**
3. **Permisos** → **Notificaciones**
4. Asegurarse de que esté **ACTIVADO**

#### Opción B: Verificar en Logcat
```bash
adb logcat | grep -i "crash\|notification"
```

Buscar mensajes como:
- "PERMISSION_ERROR: Notification permission required"
- "START_ERROR: ..."

#### Opción C: Limpiar y Reconstruir
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

### Si el diálogo de permisos no aparece:
Desinstalar la app completamente y reinstalar:
```bash
adb uninstall com.anonymous.FirstAid
npx expo run:android
```

## Flujo de Funcionamiento

```
Usuario activa el switch
         ↓
startCrashMonitoring() en JS
         ↓
Solicitar permiso de notificaciones (expo-notifications)
         ↓
   ¿Permiso otorgado?
    /            \
  NO             SÍ
   ↓              ↓
Mostrar       CrashModule.startMonitoring()
Alert            ↓
               Verificar permiso en nativo
                  ↓
               ¿Permiso confirmado?
                /        \
              NO         SÍ
               ↓          ↓
            Reject    startForegroundService()
            Promise        ↓
                      CrashDetectionService.onCreate()
                           ↓
                      createNotificationChannels()
                           ↓
                      startForeground(NOTIFICATION_ID, notification)
                           ↓
                      ✅ NOTIFICACIÓN VISIBLE
```

## Configuración Técnica

### AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>

<service 
    android:name=".CrashDetectionService" 
    android:enabled="true" 
    android:exported="false" 
    android:foregroundServiceType="location"/>
```

### Umbrales de Detección
- **Choque Leve:** > 15 m/s²
- **Choque Fuerte:** > 25 m/s²
- **Giro Brusco:** > 3.0 rad/s
- **Cooldown:** 3 segundos entre eventos

## Notas Importantes

1. **Android 13+:** El permiso de notificaciones es OBLIGATORIO
2. **Foreground Service:** Requiere notificación persistente por ley de Android
3. **Testing:** Usar dispositivo físico para pruebas precisas de sensores
4. **Battery:** El servicio consume batería - informar al usuario

## Checklist de Verificación

- [ ] Aplicación reconstruida con cambios
- [ ] Permiso de notificaciones otorgado
- [ ] Notificación persistente visible
- [ ] Switch de monitoreo funciona correctamente
- [ ] Alertas de choque se disparan al sacudir
- [ ] Servicio se detiene correctamente
- [ ] Estado persiste al minimizar la app
