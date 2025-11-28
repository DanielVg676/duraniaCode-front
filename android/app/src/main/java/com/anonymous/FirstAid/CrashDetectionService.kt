package com.anonymous.FirstAid

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import kotlin.math.sqrt

class CrashDetectionService : Service(), SensorEventListener {

    private lateinit var sensorManager: SensorManager
    private var accelerometer: Sensor? = null
    private var gyroscope: Sensor? = null

    // Umbrales (ajústalos con pruebas reales)
    private val LIGHT_CRASH_THRESHOLD = 50f   // m/s² choque leve
    private val HEAVY_CRASH_THRESHOLD = 100f   // m/s² choque fuerte
    private val SHARP_TURN_THRESHOLD = 20f   // rad/s giro brusco
    private val IMPACT_COOLDOWN_MS = 3000L    // 3 segundos

    // Filtro para separar gravedad y aceleración lineal
    private val gravity = FloatArray(3) { 0f }
    private val linearAcceleration = FloatArray(3) { 0f }
    private val alpha = 0.8f

    private var lastEventTime: Long = 0L

    // Notificaciones
    private val CHANNEL_ID = "crash_detection_channel"
    private val ALERT_CHANNEL_ID = "crash_alert_channel"
    private val NOTIFICATION_ID = 1001

    companion object {
        var isRunning: Boolean = false
            private set
    }

    override fun onCreate() {
        super.onCreate()
        isRunning = true

        // Inicializar sensores
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        gyroscope = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)

        // Crear canales de notificación
        createNotificationChannels()

        // Registrar listeners
        accelerometer?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }
        gyroscope?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }

        // Iniciar como foreground service
        startForeground(NOTIFICATION_ID, createMonitoringNotification())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        isRunning = false
        sensorManager.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        event ?: return

        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> handleAccelerometerData(event)
            Sensor.TYPE_GYROSCOPE -> handleGyroscopeData(event)
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // No necesario para este caso
    }

    // ---- ACELERÓMETRO: CHOQUE LEVE / FUERTE ----
    private fun handleAccelerometerData(event: SensorEvent) {
        // Filtrar gravedad (low-pass)
        gravity[0] = alpha * gravity[0] + (1 - alpha) * event.values[0]
        gravity[1] = alpha * gravity[1] + (1 - alpha) * event.values[1]
        gravity[2] = alpha * gravity[2] + (1 - alpha) * event.values[2]

        // Aceleración lineal (sin gravedad)
        linearAcceleration[0] = event.values[0] - gravity[0]
        linearAcceleration[1] = event.values[1] - gravity[1]
        linearAcceleration[2] = event.values[2] - gravity[2]

        val x = linearAcceleration[0]
        val y = linearAcceleration[1]
        val z = linearAcceleration[2]

        val magnitude = sqrt((x * x + y * y + z * z).toDouble()).toFloat()
        val now = System.currentTimeMillis()

        // Evitar spam de eventos
        if (now - lastEventTime < IMPACT_COOLDOWN_MS) return

        when {
            magnitude > HEAVY_CRASH_THRESHOLD -> {
                lastEventTime = now
                showAlertNotification(
                    "Choque fuerte detectado",
                    "Se ha detectado un impacto severo"
                )
            }
            magnitude > LIGHT_CRASH_THRESHOLD -> {
                lastEventTime = now
                showAlertNotification(
                    "Choque leve detectado",
                    "Se ha detectado un impacto moderado"
                )
            }
        }
    }

    // ---- GIROSCOPIO: GIRO BRUSCO ----
    private fun handleGyroscopeData(event: SensorEvent) {
        val x = event.values[0]
        val y = event.values[1]
        val z = event.values[2]

        val angularVelocity = sqrt((x * x + y * y + z * z).toDouble()).toFloat()

        if (angularVelocity > SHARP_TURN_THRESHOLD) {
            // Si quieres, aquí también puedes aplicar cooldown separado
            showAlertNotification(
                "Giro brusco detectado",
                "Se ha detectado un cambio de dirección repentino"
            )
        }
    }

    // ---- NOTIFICACIONES ----
    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Canal para notificación de monitoreo persistente
            val monitoringChannel = NotificationChannel(
                CHANNEL_ID,
                "Monitoreo de Choques",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Notificación persistente para monitoreo de choques"
                setShowBadge(false)
            }

            // Canal para alertas de choques
            val alertChannel = NotificationChannel(
                ALERT_CHANNEL_ID,
                "Alertas de Choques",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notificaciones de alerta cuando se detecta un choque"
                enableVibration(true)
                enableLights(true)
            }

            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(monitoringChannel)
            notificationManager.createNotificationChannel(alertChannel)
        }
    }

    private fun createMonitoringNotification(): Notification {
        val notificationIntent = packageManager.getLaunchIntentForPackage(packageName)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Monitoreo activo")
            .setContentText("Monitoreando choques y giros bruscos…")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    private fun showAlertNotification(title: String, message: String) {
        val notificationIntent = packageManager.getLaunchIntentForPackage(packageName)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, ALERT_CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(message)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .build()

        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }
}
