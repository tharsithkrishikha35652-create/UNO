# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Capacitor JavaScript interfaces
-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve Capacitor plugins
-keep public class * extends com.getcapacitor.Plugin
-keep public class com.getcapacitor.** { *; }

# Firebase & Google Play Services
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**
-dontwarn androidx.credentials.**

# Unused third-party authentication providers in @capacitor-firebase/authentication
-dontwarn com.facebook.**
-dontwarn com.twitter.**
-dontwarn com.google.android.play.core.**
