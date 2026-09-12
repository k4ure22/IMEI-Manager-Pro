@echo off
chcp 65001 >nul
title Instalador de Dependencias - IMEI Manager Pro
echo ============================================================
echo   🚀 INSTALACIÓN DE DEPENDENCIAS PARA WINDOWS
echo      (Google Chrome + Tesseract OCR para IMEI Manager Pro)
echo ============================================================
echo.

:: Verificar permisos de administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  AVISO: Es recomendable ejecutar este archivo como Administrador.
    echo    (Clic derecho -> "Ejecutar como administrador")
    echo.
)

:: 1. Instalar Google Chrome (Requerido para Selenium WebDriver)
echo [1/2] Verificando e instalando Google Chrome...
where chrome >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Google Chrome ya se encuentra instalado.
) else (
    echo ⏳ Instalando Google Chrome mediante winget...
    winget install --id Google.Chrome -e --silent --accept-source-agreements --accept-package-agreements
    if %errorlevel% equ 0 (
        echo ✅ Google Chrome instalado correctamente.
    ) else (
        echo ⚠️ No se pudo instalar automáticamente. Descárgalo desde: https://www.google.com/chrome/
    )
)
echo.

:: 2. Instalar Tesseract OCR (Requerido para lectura de captchas de IMEI)
echo [2/2] Verificando e instalando Tesseract OCR...
if exist "C:\Program Files\Tesseract-OCR\tesseract.exe" (
    echo ✅ Tesseract OCR ya se encuentra instalado en C:\Program Files\Tesseract-OCR.
) else if exist "C:\Program Files (x86)\Tesseract-OCR\tesseract.exe" (
    echo ✅ Tesseract OCR ya se encuentra instalado en C:\Program Files (x86)\Tesseract-OCR.
) else (
    echo ⏳ Instalando Tesseract OCR (UB-Mannheim) mediante winget...
    winget install --id UB-Mannheim.TesseractOCR -e --silent --accept-source-agreements --accept-package-agreements
    if %errorlevel% equ 0 (
        echo ✅ Tesseract OCR instalado correctamente en C:\Program Files\Tesseract-OCR.
    ) else (
        echo ⚠️ No se pudo instalar automáticamente. Descárgalo desde:
        echo    https://github.com/UB-Mannheim/tesseract/wiki
    )
)
echo.

echo ============================================================
echo 🎉 ¡Configuración completada!
echo Ya puedes abrir y usar IMEI Manager Pro con todas sus funciones.
echo ============================================================
echo.
pause
