@echo off
chcp 65001 >nul
title IMEI Manager Pro
cd /d "%~dp0"

python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no encontrado. Ejecuta instalar.bat primero.
    pause
    exit /b 1
)

if not exist "Controllers\temp_screenshots" mkdir "Controllers\temp_screenshots"
if not exist "FilesIMP" mkdir "FilesIMP"

python Controllers\main.py
if errorlevel 1 (
    echo.
    echo [ERROR] La aplicacion termino con errores.
    echo Si es la primera vez, ejecuta instalar.bat
    pause
)
