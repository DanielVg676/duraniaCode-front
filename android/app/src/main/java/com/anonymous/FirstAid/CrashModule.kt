// android/app/src/main/java/com/anonymous/FirstAid/CrashModule.kt
package com.anonymous.FirstAid

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class CrashModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "CrashModule"

    companion object {
        private const val REQUEST_NOTIFICATION_PERMISSION = 1001 // por si luego lo usas
    }

    // Saber si el servicio está corriendo (lo usa isMonitoringActive en JS)
    @ReactMethod
    fun isMonitoring(promise: Promise) {
        try {
            promise.resolve(CrashDetectionService.isRunning)
        } catch (e: Exception) {
            promise.reject("STATUS_ERROR", e)
        }
    }

    // Iniciar el servicio en foreground
    @ReactMethod
    fun startMonitoring(promise: Promise) {
        try {
            val context = reactApplicationContext

            // Para Android 13+ (API 33+), verificar permiso de notificaciones
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                val hasPermission = ContextCompat.checkSelfPermission(
                    context,
                    Manifest.permission.POST_NOTIFICATIONS
                ) == PackageManager.PERMISSION_GRANTED

                if (!hasPermission) {
                    // NO intentamos pedir el permiso aquí, solo avisamos al JS
                    promise.reject(
                        "PERMISSION_ERROR",
                        "Notification permission required on Android 13+"
                    )
                    return
                }
            }

            val intent = Intent(context, CrashDetectionService::class.java)
            ContextCompat.startForegroundService(context, intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("START_ERROR", e.message ?: "Unknown error")
        }
    }

    // Detener el servicio
    @ReactMethod
    fun stopMonitoring(promise: Promise) {
        try {
            val context = reactApplicationContext
            val intent = Intent(context, CrashDetectionService::class.java)
            context.stopService(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("STOP_ERROR", e)
        }
    }
}
