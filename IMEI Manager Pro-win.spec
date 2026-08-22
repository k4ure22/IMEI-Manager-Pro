# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec para Windows (ejecutar en Windows: pyinstaller "IMEI Manager Pro-win.spec" --clean --noconfirm)

import os
import sys

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
    ('Controllers/logoIMPlight.ico', 'Controllers'),
    ('logoIMPlight.png', '.'),
    ('logoIMPdark.png', '.'),
]

if os.path.exists('Models'):
    mis_datas.append(('Models', 'Models'))

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
    'Controllers/EstilizadorPantallazo.py',
]

hidden_imports = [
    'webview',
    'webview.platforms.winforms',
    'webview.platforms.edgechromium',
    'reportlab',
    'reportlab.pdfgen.canvas',
    'reportlab.lib.pagesizes',
    'reportlab.pdfbase.pdfmetrics',
    'reportlab.pdfbase.ttfonts',
    'pypdf',
    'fpdf',
    'fpdf2',
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
    'xlwings',
    'ctypes'
]

chromedriver_bin = 'chromedriver.exe'
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
    icon='Controllers/logoIMPlight.ico',
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
