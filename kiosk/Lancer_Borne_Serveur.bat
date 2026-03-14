@echo off
REM ============================================
REM   LANCEMENT BORNE - LES DELICES DE L'INDE
REM   2 tickets sur imprimante par defaut
REM ============================================

REM Fermer Chrome s'il est deja ouvert
taskkill /IM chrome.exe /F >nul 2>&1
taskkill /IM node.exe /F >nul 2>&1
taskkill /IM python.exe /F >nul 2>&1
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

REM Lancer le serveur web local DEPUIS LA RACINE DU PROJET
echo Lancement du serveur local...
cd /d "%~dp0.."

REM Essayer avec Python d'abord
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start /B python -m http.server 8080
) else (
    REM Sinon essayer avec npx serve
    where npx >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        start /B npx serve -l 8080
    ) else (
        echo ERREUR: Python ou Node.js requis pour le serveur local
        pause
        exit /b 1
    )
)

REM Attendre que le serveur demarre
timeout /t 2 /nobreak >nul

REM Lancer Chrome en mode kiosk
echo Lancement de la borne...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --kiosk-printing --disable-pinch --overscroll-history-navigation=0 --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars --disable-features=TranslateUI --check-for-update-interval=31536000 "http://localhost:8080/kiosk/index.html"
