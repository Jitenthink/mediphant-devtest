#!/bin/bash

# Mediphant Mobile App Build and Test Script

echo "🏗️ Building Mediphant Mobile App..."

# Clean and build
echo "📦 Cleaning project..."
./gradlew clean

echo "🔨 Building debug APK..."
./gradlew assembleDebug

# Run tests
echo "🧪 Running unit tests..."
./gradlew test

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📱 APK location: app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Start the web API: cd ../web && npm run dev"
    echo "2. Install APK on device: adb install app/build/outputs/apk/debug/app-debug.apk"
    echo "3. Run the app and test the features"
    echo ""
    echo "📋 See TESTING.md for detailed testing instructions"
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi
