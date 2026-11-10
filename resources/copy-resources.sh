#!/bin/bash
# Copy notification icons into Android project
# Run after: npx cap add android
for density in mdpi hdpi xhdpi xxhdpi xxxhdpi; do
  cp "resources/android/notification/drawable-${density}/ic_stat_icon.png" \
     "android/app/src/main/res/drawable-${density}/ic_stat_icon.png"
  echo "✓ Copied ic_stat_icon.png to drawable-${density}"
done
echo "Done! Notification icons installed."
