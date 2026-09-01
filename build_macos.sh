#!/usr/bin/env bash
# NO usamos set -e global porque codesign puede advertir sin ser error fatal

echo "============================================================"
echo "  🚀 IMEI MANAGER PRO - COMPILADOR Y GENERADOR DE DMG (macOS)"
echo "============================================================"
echo ""

# 1. Directorio base
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# 2. Compilar con PyInstaller
echo "📦 [1/3] Compilando la aplicación con PyInstaller..."
pyinstaller "IMEI Manager Pro.spec" --clean --noconfirm
PYINSTALLER_EXIT=$?
if [ $PYINSTALLER_EXIT -ne 0 ]; then
    echo "❌ ERROR: PyInstaller falló (código $PYINSTALLER_EXIT)"
    exit 1
fi

APP_PATH="dist/IMEI Manager Pro.app"
if [ ! -d "$APP_PATH" ]; then
    echo "❌ ERROR: No se generó el bundle $APP_PATH"
    exit 1
fi
echo "✅ [1/3] Bundle generado en: $APP_PATH"

# 2b. Limpiar resource forks DENTRO del .app y firmar ad-hoc
echo ""
echo "🔏 [1b/3] Limpiando resource forks y firmando (ad-hoc)..."

# dot_clean elimina los archivos ._* que macOS genera internamente
dot_clean -m "$APP_PATH" 2>/dev/null || true

# Eliminar cualquier ._* y .DS_Store que quede
find "$APP_PATH" -name "._*" -delete 2>/dev/null || true
find "$APP_PATH" -name ".DS_Store" -delete 2>/dev/null || true

# Quitar atributos extendidos (quarantine, etc.)
xattr -cr "$APP_PATH" 2>/dev/null || true

# Firmar cada framework/dylib individualmente primero, luego el bundle completo
find "$APP_PATH" -name "*.dylib" -o -name "*.so" | while read f; do
    codesign --force --sign - "$f" 2>/dev/null || true
done
find "$APP_PATH/Contents/Frameworks" -maxdepth 1 -type d -name "*.framework" 2>/dev/null | while read f; do
    codesign --force --deep --sign - "$f" 2>/dev/null || true
done

# Firmar el bundle completo
codesign --force --deep --sign - "$APP_PATH" 2>/dev/null
SIGN_EXIT=$?
if [ $SIGN_EXIT -eq 0 ]; then
    echo "✅ Firma aplicada correctamente"
else
    echo "⚠️  Advertencia de firma (no fatal) — el .app sigue siendo funcional"
fi

# 3. Preparar estructura para el DMG
echo ""
echo "💿 [2/3] Preparando instalador DMG..."
DMG_STAGING="dist/dmg_staging"
rm -rf "$DMG_STAGING"
mkdir -p "$DMG_STAGING"

# Copiar .app (sin atributos extendidos)
cp -R "$APP_PATH" "$DMG_STAGING/"
xattr -cr "$DMG_STAGING/IMEI Manager Pro.app" 2>/dev/null || true

# Crear acceso directo simbólico a /Applications
ln -s /Applications "$DMG_STAGING/Applications"

# 4. Generar archivo DMG
DMG_OUTPUT="dist/IMEI_Manager_Pro_v2.0_Installer.dmg"
rm -f "$DMG_OUTPUT"

echo "🔨 [3/4] Empaquetando DMG con hdiutil..."
hdiutil create -volname "IMEI Manager Pro" \
    -srcfolder "$DMG_STAGING" \
    -ov -format UDZO \
    "$DMG_OUTPUT"
DMG_EXIT=$?

# Limpieza staging DMG
rm -rf "$DMG_STAGING"

if [ $DMG_EXIT -ne 0 ]; then
    echo "❌ ERROR: Falló la creación del DMG (código $DMG_EXIT)"
    exit 1
fi

# 5. Generar archivo ZIP comprimido de la aplicación macOS
ZIP_OUTPUT="dist/IMEI_Manager_Pro_v2.0_macOS.zip"
rm -f "$ZIP_OUTPUT"
echo ""
echo "📦 [4/4] Generando archivo comprimido ZIP para compartir..."
(cd dist && zip -r -q -y "IMEI_Manager_Pro_v2.0_macOS.zip" "IMEI Manager Pro.app")

echo ""
echo "============================================================"
echo "🎉 ¡PROCESO COMPLETADO CON ÉXITO!"
echo "📱 Aplicación:     $APP_PATH"
echo "💿 Instalador DMG: $DMG_OUTPUT ($(du -sh "$DMG_OUTPUT" | cut -f1))"
echo "🗜️  Archivo ZIP:    $ZIP_OUTPUT ($(du -sh "$ZIP_OUTPUT" | cut -f1))"
echo "============================================================"
