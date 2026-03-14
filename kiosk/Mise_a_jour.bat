@echo off
title Mise a jour Borne Chickenzz
color 0E
echo.
echo ========================================
echo    MISE A JOUR BORNE CHICKENZZ
echo ========================================
echo.
echo Telechargement des dernieres modifications...
echo.

cd /d "%~dp0.."
git pull origin main

if %errorlevel% equ 0 (
    color 0A
    echo.
    echo ========================================
    echo    MISE A JOUR REUSSIE !
    echo ========================================
    echo.
    echo Les modifications ont ete appliquees.
    echo Relancez la borne pour voir les changements.
    echo.
) else (
    color 0C
    echo.
    echo ========================================
    echo    ERREUR DE MISE A JOUR
    echo ========================================
    echo.
    echo Verifiez la connexion internet.
    echo.
)

echo Appuyez sur une touche pour fermer...
pause >nul
