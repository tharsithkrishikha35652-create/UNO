#!/usr/bin/env bash
set -e

KEYSTORE_PATH="android/calcredit-release.keystore"
ALIAS="calcredit"
STOREPASS="tharsith11raghu08"
DNAME="CN=Team Calcredit, OU=Engineering, O=CalCredit, L=Chennai, ST=Tamil Nadu, C=IN"

if [ -f "$KEYSTORE_PATH" ]; then
    echo "[INFO] Keystore already exists at: $KEYSTORE_PATH"
else
    echo "[1/2] Generating 2048-bit RSA Release Keystore..."
    keytool -genkeypair -v \
      -keystore "$KEYSTORE_PATH" \
      -alias "$ALIAS" \
      -keyalg RSA \
      -keysize 2048 \
      -validity 10000 \
      -storepass "$STOREPASS" \
      -keypass "$STOREPASS" \
      -dname "$DNAME"
    echo "[SUCCESS] Keystore created."
fi

echo ""
echo "[2/2] Extracting Certificate Fingerprints for Firebase Console:"
echo "============================================================"
keytool -list -v -keystore "$KEYSTORE_PATH" -alias "$ALIAS" -storepass "$STOREPASS" | grep -E "SHA1:|SHA256:"
echo "============================================================"
