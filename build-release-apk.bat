@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   CALCREDIT - Debug-Key Signed Release APK Builder
echo ============================================================
echo.

set APK_NAME=CalCredit-v1.0.2.apk

echo [1/5] Building optimized web distribution (dist/)...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Web build failed!
    exit /b %ERRORLEVEL%
)

echo.
echo [2/5] Syncing web assets into Capacitor Android project...
call npx cap sync android
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Capacitor sync failed!
    exit /b %ERRORLEVEL%
)

echo.
echo [3/5] Assembling Signed Release APK with Gradle...
cd android
call gradlew.bat assembleRelease
set GRADLE_ERR=%ERRORLEVEL%
cd ..

if %GRADLE_ERR% neq 0 (
    echo.
    echo [ERROR] Gradle assembleRelease failed!
    exit /b %GRADLE_ERR%
)

set APK_SOURCE=android\app\build\outputs\apk\release\app-release.apk

if not exist "%APK_SOURCE%" (
    echo [ERROR] Expected release artifact not found at %APK_SOURCE%!
    exit /b 1
)

echo.
echo [4/5] Deploying APK to dist and hosting distribution paths...
if not exist "dist\release-apk" mkdir "dist\release-apk"
if not exist "release-apk" mkdir "release-apk"

copy /Y "%APK_SOURCE%" "dist\release-apk\%APK_NAME%" >nul
copy /Y "%APK_SOURCE%" "release-apk\%APK_NAME%" >nul

if not exist "dist\release-apk\%APK_NAME%" (
    echo [ERROR] Failed to place APK in dist\release-apk\%APK_NAME%!
    exit /b 1
)

echo.
echo [5/5] Mandatory Cryptographic Signature Verification...
set "APKSIGNER_CMD="

where apksigner >nul 2>nul
if %ERRORLEVEL% equ 0 (
    set "APKSIGNER_CMD=apksigner"
) else (
    if defined ANDROID_HOME (
        for /f "delims=" %%F in ('dir /b /s /o:-n "%ANDROID_HOME%\build-tools\*apksigner.bat" 2^>nul') do (
            if not defined APKSIGNER_CMD set "APKSIGNER_CMD=%%F"
        )
    )
    if not defined APKSIGNER_CMD (
        if exist "%LOCALAPPDATA%\Android\Sdk\build-tools" (
            for /f "delims=" %%F in ('dir /b /s /o:-n "%LOCALAPPDATA%\Android\Sdk\build-tools\*apksigner.bat" 2^>nul') do (
                if not defined APKSIGNER_CMD set "APKSIGNER_CMD=%%F"
            )
        )
    )
)

if not defined APKSIGNER_CMD (
    echo.
    echo ============================================================
    echo [SECURITY ERROR] Mandatory verification tool 'apksigner' NOT found!
    echo ============================================================
    echo Release policy strictly forbids declaring an unverified APK as production ready.
    echo Please install Android SDK Build-Tools and ensure 'apksigner' is on your PATH,
    echo or set ANDROID_HOME to your Android SDK root.
    echo.
    echo Build failed. Distribution halted.
    exit /b 1
)

echo Running apksigner verification:
call "%APKSIGNER_CMD%" verify --verbose --print-certs "dist\release-apk\%APK_NAME%"
if %ERRORLEVEL% neq 0 (
    echo.
    echo ============================================================
    echo [SECURITY ERROR] apksigner verification FAILED!
    echo ============================================================
    echo The APK signature is missing, invalid, or corrupted.
    echo Release build aborted. Do NOT distribute this file.
    exit /b 1
)

echo.
echo Cryptographic signature verified successfully (v1/v2/v3).
echo.
echo Release APK Checksum (SHA-256):
certutil -hashfile "dist\release-apk\%APK_NAME%" SHA256 | findstr /V ":"

echo.
echo ============================================================
echo   [SUCCESS] Debug-key signed APK verified and ready!
echo ============================================================
echo Output Locations:
echo   - dist\release-apk\%APK_NAME%   (included in Firebase deploy)
echo   - release-apk\%APK_NAME%        (standalone archive)
echo.
pause
