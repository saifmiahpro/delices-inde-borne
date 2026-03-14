@echo off
REM ============================================
REM   INSTALLER DEMARRAGE AUTOMATIQUE
REM   Ajoute un raccourci dans le dossier Startup
REM ============================================

echo ========================================
echo   INSTALLATION DEMARRAGE AUTOMATIQUE
echo   Les Delices de l'Inde
echo ========================================
echo.

REM Chemin du batch de lancement
set BATCH_PATH=%~dp0kiosk\Lancer_Borne_Serveur.bat

REM Chemin du dossier Startup Windows
set STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup

REM Creer le raccourci VBS
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%STARTUP_FOLDER%\Delices_Inde_Borne.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "%BATCH_PATH%" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%~dp0kiosk" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "Borne Les Delices de l'Inde" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WindowStyle = 7 >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"

REM Executer le VBS
cscript //nologo "%TEMP%\CreateShortcut.vbs"
del "%TEMP%\CreateShortcut.vbs"

echo.
echo ========================================
echo   INSTALLATION TERMINEE !
echo ========================================
echo.
echo La borne demarrera automatiquement
echo au prochain demarrage de Windows.
echo.
pause
