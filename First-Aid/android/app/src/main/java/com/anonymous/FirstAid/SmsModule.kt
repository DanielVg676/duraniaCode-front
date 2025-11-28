// android/app/src/main/java/com/anonymous/FirstAid/SmsModule.kt
package com.anonymous.FirstAid

import android.Manifest
import android.app.Activity
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.telephony.SmsManager
import android.util.Log
import android.widget.Toast
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray

class SmsModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "SmsModule"
        private const val SMS_SENT_ACTION = "com.anonymous.FirstAid.SMS_SENT"
    }

    // Receptor para saber si el sistema marcó el SMS como enviado o error
    private val sentReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            when (resultCode) {
                Activity.RESULT_OK -> {
                    Log.d(TAG, "✅ Sistema: SMS marcado como ENVIADO")
                    Toast.makeText(
                        context,
                        "SMS enviado por el sistema",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                SmsManager.RESULT_ERROR_GENERIC_FAILURE -> {
                    Log.e(TAG, "❌ Sistema: Error genérico al enviar SMS")
                    Toast.makeText(
                        context,
                        "Error al enviar SMS (genérico)",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                SmsManager.RESULT_ERROR_NO_SERVICE -> {
                    Log.e(TAG, "❌ Sistema: Sin servicio de red para SMS")
                    Toast.makeText(
                        context,
                        "Sin servicio de red para SMS",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                SmsManager.RESULT_ERROR_NULL_PDU -> {
                    Log.e(TAG, "❌ Sistema: PDU nulo")
                    Toast.makeText(
                        context,
                        "Error al enviar SMS (PDU nulo)",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                SmsManager.RESULT_ERROR_RADIO_OFF -> {
                    Log.e(TAG, "❌ Sistema: Radio apagado (modo avión / sin modem)")
                    Toast.makeText(
                        context,
                        "Radio apagado (no se puede enviar SMS)",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else -> {
                    Log.e(TAG, "❌ Sistema: Error desconocido al enviar SMS, code=$resultCode")
                    Toast.makeText(
                        context,
                        "Error desconocido al enviar SMS",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }
    }

    init {
        // Registramos el receiver para la acción SMS_SENT
        Log.d(TAG, "Registrando BroadcastReceiver para SMS_SENT_ACTION")
        val filter = IntentFilter(SMS_SENT_ACTION)
        reactContext.registerReceiver(sentReceiver, filter)
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        try {
            Log.d(TAG, "Desregistrando BroadcastReceiver de SMS_SENT_ACTION")
            reactContext.unregisterReceiver(sentReceiver)
        } catch (e: Exception) {
            Log.e(TAG, "Error al desregistrar receiver: ${e.message}")
        }
    }

    override fun getName() = "SmsModule"

    @ReactMethod
    fun sendEmergencySms(contacts: ReadableArray, message: String, promise: Promise) {
        try {
            val activity: Activity? = reactContext.currentActivity

            if (activity == null) {
                Log.e(TAG, "No hay Activity activa")
                promise.reject("NO_ACTIVITY", "No hay Activity activa")
                return
            }

            // Verificar permiso SEND_SMS
            val hasPermission = ContextCompat.checkSelfPermission(
                reactContext,
                Manifest.permission.SEND_SMS
            ) == PackageManager.PERMISSION_GRANTED

            if (!hasPermission) {
                Log.w(TAG, "Permiso SEND_SMS NO concedido")
                promise.reject("PERMISSION_DENIED", "Permiso SEND_SMS no concedido")
                return
            }

            // Obtener SmsManager (compat con APIs nuevas)
            val smsManager: SmsManager? = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                reactContext.getSystemService(SmsManager::class.java)
            } else {
                SmsManager.getDefault()
            }

            if (smsManager == null) {
                Log.e(TAG, "SmsManager es null, no se puede enviar")
                promise.reject("NO_SMS_SERVICE", "No se pudo obtener SmsManager")
                return
            }

            var sentCount = 0
            val errors = mutableListOf<String>()

            Log.d(TAG, "=== INICIANDO ENVÍO DE SMS ===")
            Log.d(TAG, "Total de contactos: ${contacts.size()}")
            Log.d(TAG, "Mensaje: $message")

            for (i in 0 until contacts.size()) {
                val number = contacts.getString(i)
                Log.d(TAG, "------")
                Log.d(TAG, "Procesando contacto[$i]: '$number'")
                Log.d(TAG, "Es nulo: ${number == null}")
                Log.d(TAG, "Es vacío: ${number?.isEmpty()}")
                Log.d(TAG, "Longitud: ${number?.length}")

                if (!number.isNullOrEmpty()) {
                    try {
                        // PendingIntent para saber el resultado del envío
                        val sentIntent = PendingIntent.getBroadcast(
                            reactContext,
                            i, // requestCode distinto por contacto
                            Intent(SMS_SENT_ACTION),
                            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                        )

                        Log.d(TAG, "▶️ Enviando SMS a: $number")
                        smsManager.sendTextMessage(
                            number,
                            null,
                            message,
                            sentIntent, // aquí conectamos el receiver
                            null
                        )
                        sentCount++
                        Log.d(TAG, "✅ sendTextMessage llamado para $number")
                    } catch (e: Exception) {
                        val errorMsg = "Error enviando SMS a $number: ${e.message}"
                        Log.e(TAG, "❌ $errorMsg")
                        e.printStackTrace()
                        errors.add(errorMsg)
                    }
                } else {
                    val errorMsg = "Número vacío o nulo en índice $i"
                    Log.w(TAG, "⚠️ $errorMsg")
                    errors.add(errorMsg)
                }
            }

            Log.d(TAG, "=== RESUMEN DE ENVÍO ===")
            Log.d(TAG, "SMS 'disparados' (sendTextMessage llamado): $sentCount de ${contacts.size()}")
            if (errors.isNotEmpty()) {
                Log.w(TAG, "Errores encontrados: ${errors.joinToString("; ")}")
            }

            if (sentCount > 0) {
                promise.resolve("SMS_SENT_$sentCount")
            } else {
                promise.reject("NO_RECIPIENTS", "No se pudo disparar SMS a ningún número válido")
            }

        } catch (e: Exception) {
            e.printStackTrace()
            Log.e(TAG, "Excepción en sendEmergencySms: ${e.message}")
            promise.reject("SMS_ERROR", e.message)
        }
    }
}
