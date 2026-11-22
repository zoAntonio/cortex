@echo off
chcp 65001 >nul
title Cortex
set "DOSSIER=D:\Projet\cortex\backend"
set "PORT=3000"

:: Lancement direct possible : cortex.bat lancer
if /i "%~1"=="lancer" (
  call :lancer
  exit /b
)

:menu
cls
echo ==============================
echo             CORTEX
echo ==============================
call :statut
echo.
echo   1. Lancer
echo   2. Arreter
echo   3. Relancer
echo   0. Sortir
echo.
set "choix="
set /p "choix=Ton choix : "

if "%choix%"=="1" call :lancer  & goto menu
if "%choix%"=="2" call :arreter & goto menu
if "%choix%"=="3" call :arreter & call :lancer & goto menu
if "%choix%"=="0" exit /b
goto menu

:: ---------- Fonctions ----------

:statut
set "ETAT=ARRETE"
for /f %%a in ('netstat -ano ^| findstr ":%PORT% " ^| findstr LISTENING') do set "ETAT=EN MARCHE"
echo   Etat : %ETAT%
exit /b

:lancer
set "ETAT=ARRETE"
for /f %%a in ('netstat -ano ^| findstr ":%PORT% " ^| findstr LISTENING') do set "ETAT=EN MARCHE"
if "%ETAT%"=="EN MARCHE" (
  echo   Deja lance.
  timeout /t 2 >nul
  exit /b
)
powershell -NoProfile -Command "Start-Process cmd -ArgumentList '/c cd /d %DOSSIER% && node server.js >> cortex.log 2>&1' -WindowStyle Hidden"
echo   Demarrage...
timeout /t 3 >nul
exit /b

:arreter
set "TROUVE=0"
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT% " ^| findstr LISTENING') do (
  taskkill /F /PID %%a >nul 2>&1
  set "TROUVE=1"
)
if "%TROUVE%"=="1" (echo   Arrete.) else (echo   Rien a arreter.)
timeout /t 2 >nul
exit /b