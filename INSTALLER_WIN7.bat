@echo off
REM ============================================
REM   INSTALLATION WINDOWS 7 - DELICES DE L'INDE
REM   Cree un raccourci sur le bureau
REM ============================================

echo ========================================
echo   INSTALLATION RACCOURCI BUREAU
echo ========================================
echo.

REM Creer le raccourci .url sur le bureau
echo [InternetShortcut] > "%USERPROFILE%\Desktop\Borne Delices.url"
echo URL=file:///%~dp0kiosk/index_win7.html >> "%USERPROFILE%\Desktop\Borne Delices.url"
echo IconIndex=0 >> "%USERPROFILE%\Desktop\Borne Delices.url"

echo.
echo ========================================
echo   RACCOURCI CREE SUR LE BUREAU !
echo ========================================
echo.
echo Double-cliquez sur "Borne Delices" pour lancer.
echo.
echo NOTE: Sur Windows 7, l'impression automatique
echo ne fonctionne pas. Utilisez Ctrl+P pour imprimer.
echo.
pause
