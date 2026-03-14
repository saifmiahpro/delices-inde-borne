@echo off
REM ============================================
REM   LANCEMENT BORNE - LES DELICES DE L'INDE
REM ============================================

REM Fermer Chrome s'il est deja ouvert
taskkill /IM chrome.exe /F >nul 2>&1
timeout /t 1 /nobreak >nul

REM Mise a jour depuis GitHub
echo ========================================
echo   LES DELICES DE L'INDE - BORNE
echo ========================================
echo.
echo Mise a jour en cours...
cd /d "%~dp0.."
git pull origin main

REM Attendre que le pull soit termine
timeout /t 2 /nobreak >nul

REM Lancer Chrome en mode kiosk directement sur le fichier HTML
echo Lancement de la borne...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --kiosk-printing --disable-pinch --overscroll-history-navigation=0 --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars --disable-features=TranslateUI --check-for-update-interval=31536000 --allow-file-access-from-files "%~dp0index.html"
