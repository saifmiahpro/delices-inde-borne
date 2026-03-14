@echo off
echo ===================================================
echo   MISE A JOUR DE LA BORNE CHICKENZZ (RECUPERATION)
echo ===================================================
echo.
echo Recherche de nouvelles mises a jour sur internet...
echo.

:: Se deplace dans le dossier courant (ou se trouve ce fichier)
cd /d "%~dp0"

:: Execute la commande Git pour telecharger les dernieres modifications
git pull origin main

echo.
echo ===================================================
echo   MISE A JOUR TERMINEE !
echo ===================================================
echo Vous pouvez maintenant lancer la borne normalement.
echo.
pause
