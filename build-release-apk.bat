@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   CALCREDIT - Production Release APK Builder
echo ============================================================
echo.

set KEYSTORE_PATH=android\calcredit-release.keystore
if not exist "%KEYSTORE_PATH%" (
    echo [ERROR] Keystore not found at %KEYSTORE_PATH%!
    echo Please run 'generate-release-keystore.bat' first.
    exit /b 1
)

echo [1/4] Building optimized web distribution...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Web build failed!
    exit /b %ERRORLEVEL%
)

echo.
echo [2/4] Syncing web assets into Capacitor Android project...
call npx cap sync android
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Capacitor sync failed!
    exit /b %ERRORLEVEL%
)

echo.
echo [3/4] Assembling Signed Release APK with Gradle...
cd android
call gradlew.bat assembleRelease
set GRADLE_ERR=%ERRORLEVEL%
cd ..

if %GRADLE_ERR% neq 0 (
    echo [ERROR] Gradle assembleRelease failed!
    exit /b %GRADLE_ERR%
)

echo.
echo [4/4] Finalizing Release Artifact...
if not exist "release-apk" mkdir release-apk
if not exist "public\release-apk" mkdir public\release-apk

copy /Y "android\app\build\outputs\apk\release\app-release.apk" "release-apk\CalCredit-v1.0.1.apk" >nul
copy /Y "android\app\build\outputs\apk\release\app-release.apk" "public\release-apk\CalCredit-v1.0.1.apk" >nul

echo.
echo ============================================================
echo   [SUCCESS] Signed Production Release APK Generated!
echo ============================================================
echo Artifact Location: release-apk\CalCredit-v1.0.1.apk
echo Web Download:      public\release-apk\CalCredit-v1.0.1.apk
echo.
pause
