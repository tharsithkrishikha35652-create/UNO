#!/usr/bin/env bash
set -e

KEYSTORE_PATH="android/calcredit-release.keystore"
PROPERTIES_PATH="android/keystore.properties"

echo "============================================================"
echo "  CALCREDIT - Production Release APK Builder"
echo "============================================================"
echo ""

if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "[ERROR] Keystore not found at $KEYSTORE_PATH!"
    echo "Please run './generate-release-keystore.sh' first."
    exit 1
fi

if [ ! -f "$PROPERTIES_PATH" ]; then
    echo "[ERROR] Signing properties file not found at $PROPERTIES_PATH!"
    echo "Please run './generate-release-keystore.sh' first."
    exit 1
fi

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
mkdir -p public/release-apk
mkdir -p release-apk

cp -f "$APK_SOURCE" "dist/release-apk/CalCredit-v1.0.1.apk"
cp -f "$APK_SOURCE" "public/release-apk/CalCredit-v1.0.1.apk"
cp -f "$APK_SOURCE" "release-apk/CalCredit-v1.0.1.apk"

echo ""
echo "[5/5] Verifying Signature & Computing Checksum..."
if command -v apksigner >/dev/null 2>&1; then
    echo "Verifying cryptographic signature with apksigner:"
    apksigner verify --verbose "dist/release-apk/CalCredit-v1.0.1.apk"
else
    echo "[NOTE] 'apksigner' not found in PATH."
fi

echo ""
echo "Release APK Checksum (SHA-256):"
sha256sum "dist/release-apk/CalCredit-v1.0.1.apk"

echo ""
echo "============================================================"
echo "  [SUCCESS] Production Release APK Ready for Distribution!"
echo "  Hosting Path: dist/release-apk/CalCredit-v1.0.1.apk"
echo "============================================================"
