@echo off
cd android
IF NOT EXIST gradlew.bat (
  echo gradlew.bat not found!
  exit /b 1
)
call gradlew.bat clean
call gradlew.bat assembleDebug
echo.
echo APK is located at: android\app\build\outputs\apk\debug\app-debug.apk
pause
