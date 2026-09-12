import os
import sys
import shutil

# Asegurar que shutil.copyfile cree automáticamente los directorios padre necesarios
_orig_copyfile = shutil.copyfile
def _safe_copyfile(src, dst, *args, **kwargs):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    return _orig_copyfile(src, dst, *args, **kwargs)
shutil.copyfile = _safe_copyfile

from PyInstaller.utils.hooks import collect_all

selenium_datas, selenium_binaries, selenium_hidden = collect_all('selenium')
wdm_datas, wdm_binaries, wdm_hidden = collect_all('webdriver_manager')

# Archivos y carpetas adicionales que deben ser empaquetados (sin archivos .py sueltos para proteger el código fuente)
mis_datas = [
    ('Views', 'Views'),
    ('Controllers/BiometricAuth.swift', '.'),
    ('logoIMPlight.png', '.'),
    ('logoIMPdark.png', '.'),
    ('logoIMPlight.icns', '.'),
] + selenium_datas + wdm_datas

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
    'xlwings',
    # unittest es requerido por pyparsing (dependencia transitiva de supabase/storage3)
    'unittest',
    'unittest.mock',
] + selenium_hidden + wdm_hidden

chromedriver_bin = 'chromedriver'
mis_binaries = [] + selenium_binaries + wdm_binaries
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
        # pyiceberg: paquete de Data Lake arrastrado por storage3, no se usa en esta app
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
