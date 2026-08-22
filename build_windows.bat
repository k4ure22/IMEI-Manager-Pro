@echo off
chcp 65001 >nul
title IMEI Manager Pro - Compilador para Windows
echo ============================================================
echo   🚀 IMEI MANAGER PRO - COMPILADOR DE EJECUTABLE WINDOWS
echo ============================================================
echo.

:: 1. Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Python no está instalado o no se encuentra en el PATH.
    echo    Descárgalo de https://www.python.org/ y marca "Add Python to PATH".
    pause
    exit /b 1
)

:: 2. Instalar dependencias
echo [1/3] Verificando e instalando dependencias...
python -m pip install --upgrade pip
pip install -r requirements.txt
pip install pyinstaller

:: 3. Compilar con PyInstaller
echo.
echo [2/3] Compilando ejecutable con PyInstaller...
if exist "dist\IMEI Manager Pro" rd /s /q "dist\IMEI Manager Pro"
if exist "build" rd /s /q "build"

pyinstaller "IMEI Manager Pro-win.spec" --clean --noconfirm

if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Falló la compilación con PyInstaller.
    pause
    exit /b 1
)

echo.
echo ✅ [2/3] ¡Ejecutable compilado con éxito!
echo    📂 Ubicación: dist\IMEI Manager Pro\IMEI Manager Pro.exe
echo.

:: 4. Buscar Inno Setup Compiler para generar el instalador Setup (.exe)
echo [3/3] Buscando Inno Setup para generar el Instalador (.exe)...
set "ISCC_PATH="

where iscc >nul 2>&1
if %errorlevel% equ 0 (
    set "ISCC_PATH=iscc"
) else if exist "%ProgramFiles(x86)%\Inno Setup 6\iscc.exe" (
    set "ISCC_PATH=%ProgramFiles(x86)%\Inno Setup 6\iscc.exe"
) else if exist "%ProgramFiles%\Inno Setup 6\iscc.exe" (
    set "ISCC_PATH=%ProgramFiles%\Inno Setup 6\iscc.exe"
) else if exist "%ProgramFiles(x86)%\Inno Setup 5\iscc.exe" (
    set "ISCC_PATH=%ProgramFiles(x86)%\Inno Setup 5\iscc.exe"
) else if exist "%ProgramFiles%\Inno Setup 5\iscc.exe" (
    set "ISCC_PATH=%ProgramFiles%\Inno Setup 5\iscc.exe"
) else if exist "%LocalAppData%\Programs\Inno Setup 6\iscc.exe" (
    set "ISCC_PATH=%LocalAppData%\Programs\Inno Setup 6\iscc.exe"
)

if defined ISCC_PATH (
    echo 🔨 Compilando Instalador Setup con Inno Setup...
    "%ISCC_PATH%" installer_windows.iss
    if %errorlevel% equ 0 (
        echo.
        echo ============================================================
        echo 🎉 ¡TODO LISTO CON ÉXITO!
        echo.
        echo 1️⃣  EJECUTABLE PORTABLE:
        echo     dist\IMEI Manager Pro\IMEI Manager Pro.exe
        echo.
        echo 2️⃣  INSTALADOR SETUP (Para distribuir a clientes):
        echo     dist_installer\Instalador_IMEI_Manager_Pro_v2.0_Setup.exe
        echo ============================================================
    ) else (
        echo.
        echo ⚠️ Advertencia: Falló Inno Setup. El ejecutable portable dist\IMEI Manager Pro\ está listo.
    )
) else (
    echo.
    echo ℹ️ Inno Setup no está instalado en este equipo.
    echo    El ejecutable portable ya está listo en:
    echo    👉 dist\IMEI Manager Pro\IMEI Manager Pro.exe
    echo.
    echo    Si deseas compilar el Instalador Setup (.exe):
    echo    1. Instala Inno Setup (winget install JRSoftware.InnoSetup o desde https://jrsoftware.org/isdl.php)
    echo    2. Vuelve a ejecutar este build_windows.bat o abre installer_windows.iss en Inno Setup.
    echo ============================================================
)

pause
