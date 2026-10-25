# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec para Windows (ejecutar en Windows: pyinstaller "IMEI Manager Pro-win.spec" --clean --noconfirm)

import os
import sys

from PyInstaller.utils.hooks import collect_all

selenium_datas, selenium_binaries, selenium_hidden = collect_all('selenium')
wdm_datas, wdm_binaries, wdm_hidden = collect_all('webdriver_manager')
pypdfium2_datas, pypdfium2_binaries, pypdfium2_hidden = collect_all('pypdfium2')
webview_datas, webview_binaries, webview_hidden = collect_all('webview')

# Archivos y carpetas adicionales empaquetados (sin archivos .py sueltos para proteger el código fuente)
mis_datas = [
    ('Views', 'Views'),
]
for src, dst in [
    ('Controllers/logoIMPlight.ico', 'Controllers'),
    ('logoIMPlight.png', '.'),
    ('logoIMPdark.png', '.'),
    ('IMP_Logo_final.png', '.'),
    ('logoIMPlight.ico', '.'),
    ('logo.ico', '.'),
    ('instalar_dependencias_windows.bat', '.'),
    ('LEEME-WINDOWS.txt', '.'),
]:
    if os.path.exists(src):
        mis_datas.append((src, dst))

mis_datas += selenium_datas + wdm_datas + pypdfium2_datas + webview_datas

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
    'Controllers/NotificadorAlteracion.py',
]

hidden_imports = [
    'webview',
    'webview.platforms.winforms',
    'webview.platforms.edgechromium',
    'Controllers',
    'Controllers.GeneradorPDF',
    'Controllers.ConsultarModelo',
    'Controllers.ConsultarModeloPro',
    'Controllers.blacklist',
    'Controllers.RegistrarWom',
    'Controllers.RegistrarEtb',
    'Controllers.consultar_imei',
    'Controllers.TomarPantallazo',
    'Controllers.EnviarCorreoWom',
    'Controllers.EstilizadorPantallazo',
    'Controllers.NotificadorAlteracion',
    'GeneradorPDF',
    'ConsultarModelo',
    'ConsultarModeloPro',
    'blacklist',
    'RegistrarWom',
    'RegistrarEtb',
    'consultar_imei',
    'TomarPantallazo',
    'EnviarCorreoWom',
    'EstilizadorPantallazo',
    'NotificadorAlteracion',
    'reportlab',
    'reportlab.pdfgen.canvas',
    'reportlab.lib.pagesizes',
    'reportlab.pdfbase.pdfmetrics',
    'reportlab.pdfbase.ttfonts',
    'pypdf',
    'pypdfium2',
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
    'selenium.webdriver',
    'selenium.webdriver.chrome',
    'selenium.webdriver.chrome.service',
    'selenium.webdriver.chrome.options',
    'selenium.webdriver.chrome.webdriver',
    'selenium.webdriver.common',
    'selenium.webdriver.common.by',
    'selenium.webdriver.common.keys',
    'selenium.webdriver.support',
    'selenium.webdriver.support.ui',
    'selenium.webdriver.support.expected_conditions',
    'selenium.webdriver.support.select',
    'webdriver_manager',
    'webdriver_manager.chrome',
    'webdriver_manager.core',
    'supabase',
    'postgrest',
    'gotrue',
    'realtime',
    'storage3',
    'openpyxl',
    'certifi',
    'requests',
    'urllib3',
    'xlwings',
    'ctypes',
    'smtplib',
    'email',
    'email.mime',
    'email.mime.multipart',
    'email.mime.text',
    'clr',
    'pythonnet'
] + selenium_hidden + wdm_hidden + pypdfium2_hidden + webview_hidden

chromedriver_bin = 'chromedriver.exe'
mis_binaries = [] + selenium_binaries + wdm_binaries + pypdfium2_binaries + webview_binaries
if os.path.exists(chromedriver_bin):
    mis_binaries.append((chromedriver_bin, '.'))

a = Analysis(
    scripts_to_analyze,
    pathex=['Controllers', '.'],
    binaries=mis_binaries,
    datas=mis_datas,
    hiddenimports=hidden_imports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=['rthook_pyiceberg.py'],
    excludes=[
        'pandas',
        'matplotlib',
        'scipy',
        'torch',
        'IPython',
        'pytest',
        'unittest',
        'pyiceberg',
        'pyiceberg.catalog',
        'pyiceberg.table',
        'tkinter',
        'PyQt5',
        'PySide2',
        'PySide6',
        'wx'
    ],
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
