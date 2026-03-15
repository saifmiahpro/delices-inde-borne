@echo off
REM ============================================
REM   LANCEUR SIMPLE WINDOWS 7
REM   Pas de serveur, ouvre direct le fichier
REM ============================================

echo ========================================
echo   LES DELICES DE L'INDE - BORNE
echo ========================================
echo.

REM Fermer Chrome
taskkill /IM chrome.exe /F >nul 2>&1
timeout /t 1 /nobreak >nul

REM Mise a jour Git (si disponible)
echo Mise a jour...
cd /d "%~dp0"
git pull origin main 2>nul
timeout /t 2 /nobreak >nul

REM Trouver Chrome
set CHROME=
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set CHROME="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)

if "%CHROME%"=="" (
    echo ERREUR: Chrome non trouve!
    echo Installez Chrome depuis google.com/chrome
    pause
    exit /b 1
)

REM Lancer Chrome direct sur le fichier HTML
echo Lancement de la borne...
start "" %CHROME% --kiosk --kiosk-printing --disable-pinch --noerrdialogs --no-first-run "%~dp0kiosk\index.html"
