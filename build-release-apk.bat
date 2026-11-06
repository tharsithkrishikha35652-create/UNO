@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   CALCREDIT - Production Release APK Builder
echo ============================================================
echo.

set KEYSTORE_PATH=android\calcredit-release.keystore
set PROPERTIES_PATH=android\keystore.properties

if not exist "%KEYSTORE_PATH%" (
    echo [ERROR] Release keystore not found at %KEYSTORE_PATH%!
    echo Please run 'generate-release-keystore.bat' to generate a signed keystore first.
    exit /b 1
)

if not exist "%PROPERTIES_PATH%" (
    echo [ERROR] Signing properties file not found at %PROPERTIES_PATH%!
    echo Please run 'generate-release-keystore.bat' to configure credentials first.
    exit /b 1
)

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
    echo Ensure release credentials in %PROPERTIES_PATH% are valid.
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
if not exist "public\release-apk" mkdir "public\release-apk"
if not exist "release-apk" mkdir "release-apk"

copy /Y "%APK_SOURCE%" "dist\release-apk\CalCredit-v1.0.1.apk" >nul
copy /Y "%APK_SOURCE%" "public\release-apk\CalCredit-v1.0.1.apk" >nul
copy /Y "%APK_SOURCE%" "release-apk\CalCredit-v1.0.1.apk" >nul

if not exist "dist\release-apk\CalCredit-v1.0.1.apk" (
    echo [ERROR] Failed to place APK in dist\release-apk\CalCredit-v1.0.1.apk!
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
call "%APKSIGNER_CMD%" verify --verbose --print-certs "dist\release-apk\CalCredit-v1.0.1.apk"
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
certutil -hashfile "dist\release-apk\CalCredit-v1.0.1.apk" SHA256 | findstr /V ":"

echo.
echo ============================================================
echo   [SUCCESS] Production Release APK Verified and Ready!
echo ============================================================
echo Output Locations:
echo   - dist\release-apk\CalCredit-v1.0.1.apk   (included in Firebase deploy)
echo   - public\release-apk\CalCredit-v1.0.1.apk (persisted for future builds)
echo   - release-apk\CalCredit-v1.0.1.apk        (standalone archive)
echo.
pause
