# -*- mode: python ; coding: utf-8 -*-

import os
import sys

# Archivos y carpetas adicionales que deben ser empaquetados
mis_datas = [
    ('Views', 'Views'),
    ('Controllers/GeneradorPDF.py', '.'),
    ('Controllers/ConsultarModelo.py', '.'),
    ('Controllers/ConsultarModeloPro.py', '.'),
    ('Controllers/blacklist.py', '.'),
    ('Controllers/RegistrarWom.py', '.'),
    ('Controllers/RegistrarEtb.py', '.'),
    ('Controllers/consultar_imei.py', '.'),
    ('Controllers/TomarPantallazo.py', '.'),
    ('Controllers/EnviarCorreoWom.py', '.'),
    ('Controllers/EstilizadorPantallazo.py', '.'),
    ('Controllers/BiometricAuth.swift', '.'),
    ('logoIMPlight.png', '.'),
    ('logoIMPdark.png', '.'),
    ('logoIMPlight.icns', '.'),
]

scripts_to_analyze = [
    'Controllers/main.py',
    'Controllers/GeneradorPDF.py',
    'Controllers/ConsultarModelo.py',
    'Controllers/ConsultarModeloPro.py',
    'Controllers/blacklist.py',
    'Controllers/RegistrarWom.py',
    'Controllers/RegistrarEtb.py',
    'Controllers/consultar_imei.py',
    'Controllers/TomarPantallazo.py',
    'Controllers/EnviarCorreoWom.py',
    'Controllers/EstilizadorPantallazo.py'
]

hidden_imports = [
    'webview',
    'webview.platforms.cocoa',
    'reportlab',
    'reportlab.pdfgen.canvas',
    'reportlab.lib.pagesizes',
    'reportlab.pdfbase.pdfmetrics',
    'reportlab.pdfbase.ttfonts',
    'pypdf',
    'fpdf',
    'PIL',
    'PIL.Image',
    'PIL.ImageDraw',
    'PIL.ImageFont',
    'PIL.ImageChops',
    'cv2',
    'pytesseract',
    'selenium',
    'selenium.webdriver.chrome.service',
    'webdriver_manager',
    'webdriver_manager.chrome',
    'supabase',
    'postgrest',
    'gotrue',
    'realtime',
    'storage3',
    'openpyxl',
    'certifi',
    'xlwings'
]

chromedriver_bin = 'chromedriver'
mis_binaries = []
if os.path.exists(chromedriver_bin):
    mis_binaries.append((chromedriver_bin, '.'))

a = Analysis(
    scripts_to_analyze,
    pathex=[],
    binaries=mis_binaries,
    datas=mis_datas,
    hiddenimports=hidden_imports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='IMEI Manager Pro',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=['logoIMPlight.icns'],
)
coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='IMEI Manager Pro',
)
app = BUNDLE(
    coll,
    name='IMEI Manager Pro.app',
    icon='logoIMPlight.icns',
    bundle_identifier='com.imeimanagerpro.app',
    info_plist={
        'CFBundleName': 'IMEI Manager Pro',
        'CFBundleDisplayName': 'IMEI Manager Pro',
        'CFBundleIdentifier': 'com.imeimanagerpro.app',
        'CFBundleVersion': '2.0.0',
        'CFBundleShortVersionString': '2.0.0',
        'NSHighResolutionCapable': True,
        'NSRequiresAquaSystemAppearance': False,
    }
)
