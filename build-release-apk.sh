#!/usr/bin/env bash
set -e

APK_NAME="CalCredit-v1.2.0.apk"

echo "============================================================"
echo "  CALCREDIT - Debug-Key Signed Release APK Builder"
echo "============================================================"
echo ""

echo "[1/5] Building optimized web distribution (dist/)..."
npm run build

echo ""
echo "[2/5] Syncing web assets into Capacitor Android project..."
npx cap sync android

echo ""
echo "[3/5] Assembling Signed Release APK with Gradle..."
cd android
./gradlew assembleRelease
cd ..

APK_SOURCE="android/app/build/outputs/apk/release/app-release.apk"

if [ ! -f "$APK_SOURCE" ]; then
    echo "[ERROR] Expected release artifact not found at $APK_SOURCE!"
    exit 1
fi

echo ""
echo "[4/5] Deploying APK to dist and hosting distribution paths..."
mkdir -p dist/release-apk
mkdir -p release-apk

cp -f "$APK_SOURCE" "dist/release-apk/$APK_NAME"
cp -f "$APK_SOURCE" "release-apk/$APK_NAME"

echo ""
echo "[5/5] Mandatory Cryptographic Signature Verification..."
APKSIGNER_CMD=""

if command -v apksigner >/dev/null 2>&1; then
    APKSIGNER_CMD="apksigner"
elif [ -n "$ANDROID_HOME" ] && compgen -G "$ANDROID_HOME/build-tools/*/apksigner" >/dev/null; then
    APKSIGNER_CMD=$(ls -1r "$ANDROID_HOME/build-tools/"*/apksigner 2>/dev/null | head -n 1)
fi

if [ -z "$APKSIGNER_CMD" ]; then
    echo ""
    echo "============================================================"
    echo "[SECURITY ERROR] Mandatory verification tool 'apksigner' NOT found!"
    echo "============================================================"
    echo "Release policy strictly forbids declaring an unverified APK as production ready."
    echo "Please install Android SDK Build-Tools and ensure 'apksigner' is on your PATH,"
    echo "or set ANDROID_HOME to your Android SDK root."
    echo ""
    echo "Build failed. Distribution halted."
    exit 1
fi

echo "Running apksigner verification:"
"$APKSIGNER_CMD" verify --verbose --print-certs "dist/release-apk/$APK_NAME"

echo ""
echo "Cryptographic signature verified successfully (v1/v2/v3)."
echo ""
echo "Release APK Checksum (SHA-256):"
sha256sum "dist/release-apk/$APK_NAME"

echo ""
echo "============================================================"
echo "  [SUCCESS] Debug-key signed APK verified and ready!"
echo "  Hosting Path: dist/release-apk/$APK_NAME"
echo "============================================================"
