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
    echo "[CRITICAL SAFETY CHECK]"
    echo "A release keystore already exists at: $KEYSTORE_PATH"
    echo ""
    echo "To prevent catastrophic loss of your Android app signing identity,"
    echo "this script will NEVER overwrite or delete an existing keystore."
    echo ""
    echo "If you intentionally need to replace this signing identity:"
    echo "  1. Create a secure, verified offline backup of '$KEYSTORE_PATH'."
    echo "  2. Manually remove or rename '$KEYSTORE_PATH'."
    echo "  3. Re-run this generator."
    echo ""
    echo "Generation aborted."
    exit 1
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
export CALCREDIT_KEYPASS="$STOREPASS"

keytool -genkeypair -v \
  -keystore "$KEYSTORE_PATH" \
  -alias "$ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass:env CALCREDIT_KEYPASS \
  -keypass:env CALCREDIT_KEYPASS \
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
keytool -list -v -keystore "$KEYSTORE_PATH" -alias "$ALIAS" -storepass:env CALCREDIT_KEYPASS | grep -E "SHA1:|SHA256:"
echo "============================================================"

unset CALCREDIT_KEYPASS
unset STOREPASS
unset CONFIRMPASS

echo ""
echo "[SUCCESS] Fresh release keystore and local $PROPERTIES_PATH configured!"
