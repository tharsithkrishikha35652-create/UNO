#!/usr/bin/env bash
set -e

KEYSTORE_PATH="android/calcredit-release.keystore"
PROPERTIES_PATH="android/keystore.properties"
ALIAS="calcredit"
DNAME="CN=Team Calcredit, OU=Engineering, O=CalCredit, L=Chennai, ST=Tamil Nadu, C=IN"

echo "============================================================"
echo "  CALCREDIT - Production Keystore Generator (Interactive)"
echo "============================================================"
echo ""

if [ -f "$KEYSTORE_PATH" ]; then
    echo "[WARNING] A keystore already exists at $KEYSTORE_PATH!"
    read -r -p "Do you want to overwrite it with a fresh keystore? (y/N): " OVERWRITE
    if [[ ! "$OVERWRITE" =~ ^[Yy]$ ]]; then
        echo "Keystore generation cancelled."
        exit 0
    fi
    rm -f "$KEYSTORE_PATH"
fi

while true; do
    read -s -p "Enter new Release Keystore Password (min 12 chars): " STOREPASS
    echo ""
    read -s -p "Confirm Release Keystore Password: " CONFIRMPASS
    echo ""
    if [ -z "$STOREPASS" ]; then
        echo "[ERROR] Password cannot be empty."
    elif [ "$STOREPASS" != "$CONFIRMPASS" ]; then
        echo "[ERROR] Passwords do not match. Please try again."
    elif [ ${#STOREPASS} -lt 12 ]; then
        echo "[ERROR] Password must be at least 12 characters long."
    else
        break
    fi
done

echo ""
echo "[1/3] Generating 2048-bit RSA Production Release Keystore..."
keytool -genkeypair -v \
  -keystore "$KEYSTORE_PATH" \
  -alias "$ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "$STOREPASS" \
  -keypass "$STOREPASS" \
  -dname "$DNAME"

echo ""
echo "[2/3] Writing local signing credentials to $PROPERTIES_PATH (git-ignored)..."
cat <<EOF > "$PROPERTIES_PATH"
# CalCredit Local Android Signing Properties - KEEP SECRET, DO NOT COMMIT
storeFile=calcredit-release.keystore
storePassword=$STOREPASS
keyAlias=$ALIAS
keyPassword=$STOREPASS
EOF

chmod 600 "$PROPERTIES_PATH"

echo ""
echo "[3/3] Extracting Certificate Fingerprints for Firebase Console:"
echo "============================================================"
keytool -list -v -keystore "$KEYSTORE_PATH" -alias "$ALIAS" -storepass "$STOREPASS" | grep -E "SHA1:|SHA256:"
echo "============================================================"
echo ""
echo "[SUCCESS] Fresh release keystore and local $PROPERTIES_PATH configured!"
