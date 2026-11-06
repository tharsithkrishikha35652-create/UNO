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
    echo [CRITICAL SAFETY CHECK]
    echo A release keystore already exists at: %KEYSTORE_PATH%
    echo.
    echo To prevent catastrophic loss of your Android app signing identity,
    echo this script will NEVER overwrite or delete an existing keystore.
    echo.
    echo If you intentionally need to replace this signing identity:
    echo   1. Create a secure, verified offline backup of '%KEYSTORE_PATH%'.
    echo   2. Manually remove or rename '%KEYSTORE_PATH%'.
    echo   3. Re-run this generator.
    echo.
    echo Generation aborted.
    exit /b 1
)

:prompt_pass
echo.
echo Please enter a strong release keystore password (minimum 12 characters):
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

for /f "usebackq delims=" %%L in (`powershell -Command "if ('!STOREPASS!'.Length -lt 12) { Write-Output 'TOO_SHORT' } else { Write-Output 'OK' }"`) do set "LEN_CHECK=%%L"
if "!LEN_CHECK!"=="TOO_SHORT" (
    echo [ERROR] Password must be at least 12 characters long.
    goto prompt_pass
)

echo.
echo [1/3] Generating 2048-bit RSA Production Release Keystore...
set "CALCREDIT_KEYPASS=!STOREPASS!"

keytool -genkeypair -v ^
  -keystore "%KEYSTORE_PATH%" ^
  -alias "%ALIAS%" ^
  -keyalg RSA ^
  -keysize 2048 ^
  -validity 10000 ^
  -storepass:env CALCREDIT_KEYPASS ^
  -keypass:env CALCREDIT_KEYPASS ^
  -dname %DNAME%

set KEYTOOL_ERR=%ERRORLEVEL%

if %KEYTOOL_ERR% neq 0 (
    set "CALCREDIT_KEYPASS="
    echo.
    echo [ERROR] Failed to generate keystore with keytool.
    echo Ensure 'keytool' is in your PATH (included with JDK / Android Studio jbr).
    exit /b %KEYTOOL_ERR%
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
keytool -list -v -keystore "%KEYSTORE_PATH%" -alias "%ALIAS%" -storepass:env CALCREDIT_KEYPASS | findstr /R /C:"SHA1:" /C:"SHA256:"
echo ============================================================

set "CALCREDIT_KEYPASS="
set "STOREPASS="
set "CONFIRMPASS="

echo.
echo [SUCCESS] Fresh release keystore and local %PROPERTIES_PATH% configured!
echo.
echo Next Step:
echo Copy the SHA1 fingerprint above into your Firebase Console:
echo Project Settings -^> General -^> Your Apps -^> com.calcredit.app -^> Add fingerprint
echo.
pause
