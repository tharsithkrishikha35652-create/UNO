# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Attributes required for reflection and JS interfaces
-keepattributes JavascriptInterface
-keepattributes *Annotation*
-keepattributes EnclosingMethod
-keepattributes InnerClasses
-keepattributes Signature

# Capacitor JavaScript interfaces
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve Capacitor Core & Bridge
-keep class com.getcapacitor.** { *; }
-keep public class * extends com.getcapacitor.Plugin { *; }
-keepclassmembers class * extends com.getcapacitor.Plugin {
    @com.getcapacitor.PluginMethod public void *(com.getcapacitor.PluginCall);
}

# Preserve Capacitor Official & Community Plugins
-keep class io.capawesome.capacitorjs.plugins.firebase.authentication.** { *; }
-keep class com.getcapacitor.plugin.** { *; }

# Firebase & Google Play Services & Identity
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**
-keep class androidx.credentials.** { *; }
-dontwarn androidx.credentials.**
-keep class com.google.android.libraries.identity.googleid.** { *; }
-dontwarn com.google.android.libraries.identity.googleid.**

# AndroidX Core SplashScreen
-keep class androidx.core.splashscreen.** { *; }

# Unused third-party authentication providers in @capacitor-firebase/authentication
-dontwarn com.facebook.**
-dontwarn com.twitter.**
-dontwarn com.google.android.play.core.**
-dontwarn com.google.errorprone.annotations.**
