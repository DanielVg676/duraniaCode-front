// android/app/src/main/java/com/anonymous/FirstAid/CrashPackage.kt
package com.anonymous.FirstAid

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class CrashPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext)
        : List<NativeModule> {
        return listOf(
            CrashModule(reactContext),
            SmsModule(reactContext)   
        )
    }

    override fun createViewManagers(reactContext: ReactApplicationContext)
        : List<ViewManager<*, *>> {
        return emptyList()
    }
}
