#!/usr/bin/env bash
set -e

KEYSTORE_PATH="android/calcredit-release.keystore"
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "[ERROR] Keystore not found at $KEYSTORE_PATH!"
    echo "Please run './generate-release-keystore.sh' first."
    exit 1
fi

echo "[1/4] Building optimized web distribution..."
npm run build

echo "[2/4] Syncing web assets into Capacitor Android project..."
npx cap sync android

echo "[3/4] Assembling Signed Release APK with Gradle..."
cd android
./gradlew assembleRelease
cd ..

echo "[4/4] Finalizing Release Artifact..."
mkdir -p release-apk
mkdir -p public/release-apk
cp -f "android/app/build/outputs/apk/release/app-release.apk" "release-apk/CalCredit-v1.0.1.apk"
cp -f "android/app/build/outputs/apk/release/app-release.apk" "public/release-apk/CalCredit-v1.0.1.apk"

echo "============================================================"
echo "  [SUCCESS] Signed Production Release APK Generated!"
echo "  Artifact Location: release-apk/CalCredit-v1.0.1.apk"
echo "  Web Download:      public/release-apk/CalCredit-v1.0.1.apk"
echo "============================================================"
