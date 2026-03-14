@echo off
REM ============================================
REM   LANCEMENT BORNE - LES DELICES DE L'INDE
REM ============================================

REM Fermer Chrome et ancien serveur
taskkill /IM chrome.exe /F >nul 2>&1
taskkill /IM powershell.exe /F >nul 2>&1
timeout /t 1 /nobreak >nul

REM Mise a jour depuis GitHub
echo ========================================
echo   LES DELICES DE L'INDE - BORNE
echo ========================================
echo.
echo Mise a jour en cours...
cd /d "%~dp0.."
git pull origin main
timeout /t 2 /nobreak >nul

REM Lancer serveur PowerShell
echo Lancement du serveur...
start /B powershell -ExecutionPolicy Bypass -File "%~dp0serveur.ps1"
timeout /t 3 /nobreak >nul

REM Lancer Chrome en mode kiosk
echo Lancement de la borne...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --kiosk-printing --disable-pinch --overscroll-history-navigation=0 --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars --disable-features=TranslateUI --check-for-update-interval=31536000 "http://localhost:8080/kiosk/index.html"
