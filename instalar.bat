@echo off
chcp 65001 >nul
title IMEI Manager Pro - Instalacion
cd /d "%~dp0"

echo.
echo ========================================
echo   IMEI Manager Pro - Instalacion
echo ========================================
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no encontrado.
    echo Instala Python 3.10+ desde https://www.python.org/downloads/
    echo Marca la opcion "Add Python to PATH".
    echo.
    pause
    exit /b 1
)

echo [1/2] Actualizando pip...
python -m pip install --upgrade pip

echo [2/2] Instalando dependencias...
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo [ERROR] Fallo la instalacion de dependencias.
    pause
    exit /b 1
)

if not exist "Controllers\temp_screenshots" mkdir "Controllers\temp_screenshots"
if not exist "FilesIMP" mkdir "FilesIMP"

echo.
echo ========================================
echo   Instalacion completada
echo ========================================
echo.
echo Ejecuta ejecutar.bat para abrir la aplicacion.
echo.
pause
