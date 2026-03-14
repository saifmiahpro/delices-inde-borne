@echo off
REM ============================================
REM   CREER RACCOURCI BUREAU
REM   Les Delices de l'Inde - Borne
REM ============================================

echo Creation du raccourci sur le bureau...

REM Chemin du batch de lancement
set BATCH_PATH=%~dp0kiosk\Lancer_Borne_Serveur.bat

REM Chemin du bureau
set DESKTOP=%USERPROFILE%\Desktop

REM Creer le raccourci VBS
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateDesktopShortcut.vbs"
echo sLinkFile = "%DESKTOP%\Borne Delices Inde.lnk" >> "%TEMP%\CreateDesktopShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateDesktopShortcut.vbs"
echo oLink.TargetPath = "%BATCH_PATH%" >> "%TEMP%\CreateDesktopShortcut.vbs"
echo oLink.WorkingDirectory = "%~dp0kiosk" >> "%TEMP%\CreateDesktopShortcut.vbs"
echo oLink.Description = "Lancer la Borne Les Delices de l'Inde" >> "%TEMP%\CreateDesktopShortcut.vbs"
echo oLink.WindowStyle = 7 >> "%TEMP%\CreateDesktopShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateDesktopShortcut.vbs"

REM Executer le VBS
cscript //nologo "%TEMP%\CreateDesktopShortcut.vbs"
del "%TEMP%\CreateDesktopShortcut.vbs"

echo.
echo ========================================
echo   RACCOURCI CREE SUR LE BUREAU !
echo ========================================
echo.
echo Double-cliquez sur "Borne Delices Inde"
echo sur le bureau pour lancer la borne.
echo.
pause
