@echo off
REM ============================================
REM   LANCEUR BORNE WINDOWS 7 (avec auto-update loop)
REM   Pas de serveur, ouvre direct le fichier
REM ============================================
title Borne Delices de l'Inde

:LOOP
cls
echo ========================================
echo   LES DELICES DE L'INDE - BORNE
echo ========================================
echo.

REM Fermer Chrome (au cas ou il reste un fantome)
taskkill /IM chrome.exe /F >nul 2>&1
timeout /t 1 /nobreak >nul

REM Mise a jour Git (si disponible)
echo Mise a jour depuis GitHub...
cd /d "%~dp0"
git pull origin main 2>nul
if %errorlevel% equ 0 (
    echo   -^> OK
) else (
    echo   -^> Pas de connexion ou pas de changement
)
timeout /t 1 /nobreak >nul

REM Trouver Chrome
set CHROME=
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set CHROME="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)

if "%CHROME%"=="" (
    color 0C
    echo.
    echo ERREUR: Chrome non trouve!
    echo Installez Chrome depuis google.com/chrome
    echo.
    pause
    exit /b 1
)

REM Lancer Chrome direct sur le fichier HTML (sans start "" pour bloquer le bat)
echo Lancement de la borne...
echo.
echo Pour mettre a jour : 5 clics sur le logo --^> MISE A JOUR
echo.
%CHROME% --kiosk --kiosk-printing --disable-pinch --noerrdialogs --no-first-run --disable-translate --disable-features=TranslateUI --check-for-update-interval=31536000 --user-data-dir="%LOCALAPPDATA%\BorneDelices" "%~dp0kiosk\index.html"

REM Quand Chrome se ferme (admin a clique Mise a jour ou autre), on recommence la boucle
echo.
echo Borne fermee. Redemarrage dans 2 secondes...
timeout /t 2 /nobreak >nul
goto LOOP
