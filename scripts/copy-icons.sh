#!/bin/bash
# Copy CaliBodi icons to Android resources
# Run AFTER: npx cap add android / npx cap sync android
echo "📱 Copying CaliBodi icons to Android resources..."
ANDROID_RES="android/app/src/main/res"
if [ ! -d "$ANDROID_RES" ]; then
  echo "❌ Android folder not found. Run 'npx cap add android' first."
  exit 1
fi
ICONS_DIR="public/icons"
if [ ! -d "$ICONS_DIR" ]; then
  echo "❌ Icons folder not found at $ICONS_DIR"
  exit 1
fi
for folder in mipmap-mdpi mipmap-hdpi mipmap-xhdpi mipmap-xxhdpi mipmap-xxxhdpi; do
  src="$ICONS_DIR/$folder"
  dest="$ANDROID_RES/$folder"
  if [ -d "$src" ]; then
    mkdir -p "$dest"
    cp "$src/ic_launcher.png" "$dest/ic_launcher.png"
    cp "$src/ic_launcher_round.png" "$dest/ic_launcher_round.png"
    cp "$src/ic_launcher_foreground.png" "$dest/ic_launcher_foreground.png"
    echo "  ✅ $folder copied"
  fi
done
echo "✅ All CaliBodi icons installed!"

# ═══ NOTIFICATION ICON ═══
NOTIF_DIR="resources/android/notification"
if [ -d "$NOTIF_DIR" ]; then
  for density in mdpi hdpi xhdpi xxhdpi xxxhdpi; do
    src="$NOTIF_DIR/drawable-${density}/ic_stat_icon.png"
    dest="$ANDROID_RES/drawable-${density}"
    if [ -f "$src" ]; then
      mkdir -p "$dest"
      cp "$src" "$dest/ic_stat_icon.png"
      echo "  ✅ Notification icon copied to drawable-${density}"
    fi
  done
  echo "✅ Notification icon CB installed!"
else
  echo "⚠️ No notification icons found in $NOTIF_DIR"
fi

# ═══ PERMISSIONS ANDROID ═══
MANIFEST="android/app/src/main/AndroidManifest.xml"
if [ -f "$MANIFEST" ]; then
  if ! grep -q "android.permission.CAMERA" "$MANIFEST"; then
    sed -i '/<uses-permission android:name="android.permission.INTERNET"/a\    <uses-permission android:name="android.permission.CAMERA" />' "$MANIFEST"
    echo "✅ Permission CAMERA ajoutée au AndroidManifest.xml"
  else
    echo "✅ Permission CAMERA déjà présente"
  fi
  if ! grep -q "AD_ID" "$MANIFEST"; then
    sed -i '/<uses-permission android:name="android.permission.INTERNET"/a\    <uses-permission android:name="com.google.android.gms.permission.AD_ID" />' "$MANIFEST"
    echo "✅ Permission AD_ID ajoutée au AndroidManifest.xml"
  else
    echo "✅ Permission AD_ID déjà présente"
  fi
  echo "--- Permissions actuelles ---"
  grep "uses-permission" "$MANIFEST"
  echo "---"
else
  echo "❌ AndroidManifest.xml introuvable"
fi

# ═══ COPY ANDROID ASSETS ═══
ASSETS_SRC="android-assets"
ASSETS_DEST="android/app/src/main/assets"
if [ -d "$ASSETS_SRC" ]; then
  mkdir -p "$ASSETS_DEST"
  cp "$ASSETS_SRC"/* "$ASSETS_DEST/"
  echo "✅ Android assets copied (adi-registration.properties)"
fi

# ═══ UPDATE BUILD.GRADLE ═══
BUILD_GRADLE="android/app/build.gradle"
if [ -f "$BUILD_GRADLE" ]; then
  sed -i 's/versionCode [0-9]*/versionCode 9/g' "$BUILD_GRADLE"
  sed -i 's/versionName "[^"]*"/versionName "1.0.3"/g' "$BUILD_GRADLE"
  echo "✅ versionCode=9, versionName=1.0.3"
fi

# ═══ UPDATE VARIABLES.GRADLE (targetSdk + compileSdk) ═══
VARIABLES_GRADLE="android/variables.gradle"
if [ -f "$VARIABLES_GRADLE" ]; then
  sed -i 's/compileSdkVersion = [0-9]*/compileSdkVersion = 35/g' "$VARIABLES_GRADLE"
  sed -i 's/targetSdkVersion = [0-9]*/targetSdkVersion = 35/g' "$VARIABLES_GRADLE"
  echo "✅ variables.gradle mis à jour SDK 35"
else
  echo "❌ variables.gradle introuvable"
fi
