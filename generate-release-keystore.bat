@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   CALCREDIT - Production Keystore Generator
echo ============================================================
echo.

set KEYSTORE_PATH=android\calcredit-release.keystore
set PROPERTIES_PATH=android\keystore.properties
set ALIAS=calcredit
set DNAME="CN=Team Calcredit, OU=Engineering, O=CalCredit, L=Chennai, ST=Tamil Nadu, C=IN"

if exist "%KEYSTORE_PATH%" (
    echo [WARNING] A keystore already exists at %KEYSTORE_PATH%!
    echo Overwriting an existing keystore will invalidate updates for already-installed apps.
    set /p OVERWRITE="Do you want to overwrite it with a fresh keystore? (y/N): "
    if /i not "!OVERWRITE!"=="y" (
        echo Keystore generation cancelled.
        exit /b 0
    )
    del "%KEYSTORE_PATH%"
)

:prompt_pass
echo.
echo Please enter a strong release keystore password (not hardcoded, kept locally in %PROPERTIES_PATH%):
for /f "usebackq delims=" %%P in (`powershell -Command "$p = Read-Host -Prompt 'Enter new Release Keystore Password (min 12 chars)' -AsSecureString; $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($p); [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)"`) do set "STOREPASS=%%P"

for /f "usebackq delims=" %%P in (`powershell -Command "$p = Read-Host -Prompt 'Confirm Release Keystore Password' -AsSecureString; $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($p); [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)"`) do set "CONFIRMPASS=%%P"

if not "!STOREPASS!"=="!CONFIRMPASS!" (
    echo [ERROR] Passwords do not match. Please try again.
    goto prompt_pass
)

if "!STOREPASS!"=="" (
    echo [ERROR] Password cannot be empty.
    goto prompt_pass
)

echo.
echo [1/3] Generating 2048-bit RSA Production Release Keystore...
keytool -genkeypair -v ^
  -keystore "%KEYSTORE_PATH%" ^
  -alias "%ALIAS%" ^
  -keyalg RSA ^
  -keysize 2048 ^
  -validity 10000 ^
  -storepass "!STOREPASS!" ^
  -keypass "!STOREPASS!" ^
  -dname %DNAME%

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to generate keystore with keytool.
    echo Ensure 'keytool' is in your PATH (included with JDK / Android Studio jbr).
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Writing local signing credentials to %PROPERTIES_PATH% (git-ignored)...
(
echo # CalCredit Local Android Signing Properties - KEEP SECRET, DO NOT COMMIT
echo storeFile=calcredit-release.keystore
echo storePassword=!STOREPASS!
echo keyAlias=%ALIAS%
echo keyPassword=!STOREPASS!
) > "%PROPERTIES_PATH%"

echo.
echo [3/3] Extracting Certificate Fingerprints for Firebase Console:
echo ============================================================
keytool -list -v -keystore "%KEYSTORE_PATH%" -alias "%ALIAS%" -storepass "!STOREPASS!" | findstr /R /C:"SHA1:" /C:"SHA256:"
echo ============================================================
echo.
echo [SUCCESS] Fresh release keystore and local %PROPERTIES_PATH% configured!
echo.
echo Next Step:
echo Copy the SHA1 fingerprint above into your Firebase Console:
echo Project Settings -^> General -^> Your Apps -^> com.calcredit.app -^> Add fingerprint
echo.
pause
