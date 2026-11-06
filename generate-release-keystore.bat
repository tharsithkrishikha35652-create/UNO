@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   CALCREDIT - Android Release Keystore Generator
echo ============================================================
echo.

set KEYSTORE_PATH=android\calcredit-release.keystore
set ALIAS=calcredit
set STOREPASS=tharsith11raghu08
set DNAME="CN=Team Calcredit, OU=Engineering, O=CalCredit, L=Chennai, ST=Tamil Nadu, C=IN"

if exist "%KEYSTORE_PATH%" (
    echo [INFO] Keystore already exists at: %KEYSTORE_PATH%
    echo Skipping generation to avoid overwriting existing key.
    goto print_fingerprint
)

echo [1/2] Generating 2048-bit RSA Release Keystore...
keytool -genkeypair -v ^
  -keystore "%KEYSTORE_PATH%" ^
  -alias "%ALIAS%" ^
  -keyalg RSA ^
  -keysize 2048 ^
  -validity 10000 ^
  -storepass "%STOREPASS%" ^
  -keypass "%STOREPASS%" ^
  -dname %DNAME%

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to generate keystore.
    echo Ensure 'keytool' is in your PATH or run this inside Android Studio's terminal.
    exit /b %ERRORLEVEL%
)

echo.
echo [SUCCESS] Keystore created: %KEYSTORE_PATH%
echo.

:print_fingerprint
echo [2/2] Extracting Certificate Fingerprints for Firebase Console:
echo ============================================================
keytool -list -v -keystore "%KEYSTORE_PATH%" -alias "%ALIAS%" -storepass "%STOREPASS%" | findstr /R /C:"SHA1:" /C:"SHA256:"
echo ============================================================
echo.
echo Next Step:
echo Copy the SHA1 fingerprint above into your Firebase Console:
echo Project Settings -^> General -^> Your Apps -^> com.calcredit.app -^> Add fingerprint
echo.
pause
