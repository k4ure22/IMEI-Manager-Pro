import sys
import os

# Forzar codificación UTF-8 en Windows para evitar UnicodeEncodeError (cp1252 con emojis)
if sys.platform == "win32":
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        except Exception:
            pass
    if hasattr(sys.stderr, 'reconfigure'):
        try:
            sys.stderr.reconfigure(encoding='utf-8', errors='replace')
        except Exception:
            pass

from PIL import ImageFile
from asyncio import threads

# Bootstrapper para PyInstaller: Despacha scripts lanzados por subprocess
if len(sys.argv) >= 2 and sys.argv[1].endswith('.py'):
    script_to_run = sys.argv[1]
    if os.path.exists(script_to_run):
        sys.argv = [script_to_run] + sys.argv[2:]
        import runpy
        runpy.run_path(script_to_run, run_name='__main__')
        sys.exit(0)

import ssl
import re
import platform
import subprocess

def abrir_archivo(ruta):
    sistema = platform.system()
    try:
        if sistema == "Windows":
            os.startfile(ruta)
        elif sistema == "Darwin": # macOS
            subprocess.Popen(["open", ruta])
        else: # Linux
            subprocess.Popen(["xdg-open", ruta])
    except Exception as e:
        print(f"Error al abrir el archivo {ruta}: {e}")
# Configuración de SSL segura
try:
    import certifi
    context = ssl.create_default_context(cafile=certifi.where())
    ssl._create_default_https_context = lambda: context
    print("✅ [SSL] Contexto SSL configurado de forma segura con certifi.")
except Exception as e:
    print(f"⚠️ [SSL] No se pudo configurar certifi ({e}), usando bypass de compatibilidad.")
    ssl._create_default_https_context = ssl._create_unverified_context

from supabase import create_client, Client

SUPABASE_URL = "https://zgfscbdbufiniezlkufn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZnNjYmRidWZpbmllemxrdWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTYyMzgsImV4cCI6MjA5NjE3MjIzOH0.S7BHJ1jiCgeACYREdC2rAVjsj-PzaOlcerVXwTuGvv8"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Almacén global de tokens para restaurar la sesión tras reconexiones
_session_tokens = {"access_token": None, "refresh_token": None}

def _store_session(access_token, refresh_token):
    """Guarda los tokens de sesión globalmente para restaurarlos si se pierde la conexión."""
    global _session_tokens
    if access_token and refresh_token:
        _session_tokens["access_token"] = access_token
        _session_tokens["refresh_token"] = refresh_token

def reset_supabase_client():
    global supabase
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        # Restaurar la sesión autenticada si tenemos tokens guardados
        if _session_tokens["access_token"] and _session_tokens["refresh_token"]:
            try:
                supabase.auth.set_session(
                    _session_tokens["access_token"],
                    _session_tokens["refresh_token"]
                )
                print("✅ [Supabase Auth] Conexión restablecida y sesión restaurada correctamente.")
            except Exception as sess_err:
                print(f"⚠️ [Supabase Auth] Sesión no restaurada tras reconexión: {sess_err}")
        else:
            print("✅ [Supabase Auth] Conexión de Supabase restablecida (sin sesión previa).")
    except Exception as e:
        print(f"❌ Error restableciendo cliente Supabase: {e}")

# Errores de red transitorios que disparan una reconexión
_NET_ERRORS = ("broken pipe", "connection reset", "connection refused",
               "remote end closed", "eof occurred", "timed out",
               "network is unreachable", "temporarily unavailable")

def safe_supabase(query_func):
    global supabase
    try:
        return query_func()
    except Exception as e:
        err_str = str(e).lower()
        is_net_error = any(kw in err_str for kw in _NET_ERRORS)
        if is_net_error:
            print(f"⚠️ [Supabase Net] Error de red detectado ({str(e)}). Reconectando...")
        else:
            print(f"⚠️ [Supabase Auth/Net] Error detectado en consulta ({str(e)}). Re-estableciendo cliente...")
        # Intentar refrescar sesión primero (menos intrusivo)
        try:
            supabase.auth.refresh_session()
        except Exception:
            pass
        reset_supabase_client()
        try:
            return query_func()
        except Exception as retry_err:
            print(f"❌ [Supabase Auth/Net] Error tras reintento en Supabase: {retry_err}")
            raise retry_err

_SELF_DIR = os.path.dirname(os.path.abspath(__file__))
if _SELF_DIR not in sys.path:
    sys.path.insert(0, _SELF_DIR)

import webview
import threading
import http.server
import socketserver
import socket
import time
import hashlib
import openpyxl
import subprocess

try:
    from AppKit import NSApp, NSImage
except ImportError:
    pass

def abrir_archivo(ruta):
    """Abre un archivo con la aplicación predeterminada del sistema de forma multiplataforma."""
    try:
        if sys.platform == "win32":
            os.startfile(ruta)
        elif sys.platform == "darwin":
            subprocess.Popen(["open", ruta])
        else:
            subprocess.Popen(["xdg-open", ruta])
    except Exception as e:
        print(f"Error al abrir archivo {ruta}: {e}")
try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import Select
    from selenium.webdriver.chrome.options import Options
    import random
except ImportError:
    pass

try:
    from consultar_imei import IMEIScraper as ScraperEstado
    from TomarPantallazo import IMEIScraper as ScraperPantallazo
except ImportError:
    pass

try:
    from EnviarCorreoWom import enviar_correo_desbloqueo
except ImportError:
    enviar_correo_desbloqueo = None

# ─── RUTAS BASE MVC ───────────────────────────────────────────────
CONTROLLERS_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT    = os.path.dirname(CONTROLLERS_DIR)
VIEWS_DIR       = os.path.join(PROJECT_ROOT, "Views")
VIEWS_HTML      = os.path.join(VIEWS_DIR,    "html")
VIEWS_ICONS     = os.path.join(VIEWS_DIR,    "icons")
MODELS_DIR      = os.path.join(PROJECT_ROOT, "Models")
# ──────────────────────────────────────────────────────────────────

def resource_path(relative_path):
    """Recursos estáticos (Views, icons, etc.)"""
    if hasattr(sys, '_MEIPASS'):
        ruta = os.path.join(sys._MEIPASS, relative_path)
        if os.path.exists(ruta):
            return ruta
        ruta_mac = os.path.abspath(os.path.join(sys._MEIPASS, '..', 'Resources', relative_path))
        if os.path.exists(ruta_mac):
            return ruta_mac
        return ruta
    return os.path.join(PROJECT_ROOT, relative_path)


def script_path(nombre_script):
    """
    Ruta a scripts .py auxiliares (GeneradorPDF, ConsultarModelo, etc.)
    """
    if hasattr(sys, '_MEIPASS'):
        # Buscar directamente en _MEIPASS
        ruta = os.path.join(sys._MEIPASS, nombre_script)
        if os.path.exists(ruta):
            return ruta
        # En bundles de Mac (.app), los datas van a Contents/Resources
        ruta_mac = os.path.abspath(os.path.join(sys._MEIPASS, '..', 'Resources', nombre_script))
        if os.path.exists(ruta_mac):
            return ruta_mac
        return ruta
    return os.path.join(CONTROLLERS_DIR, nombre_script)

def set_dock_icon(mode):
    try:
        icns_path = os.path.join(PROJECT_ROOT, "logoIMPdark.icns")
        if os.path.exists(icns_path):
            image = NSImage.alloc().initByReferencingFile_(icns_path)
            NSApp.setApplicationIconImage_(image)
            return
        suffix = "light" if mode == "light" else "dark"
        icon_path = os.path.join(VIEWS_ICONS, f"logoIMP{suffix}.png")
        image = NSImage.alloc().initByReferencingFile_(icon_path)
        NSApp.setApplicationIconImage_(image)
    except Exception as e:
        print(f"⚠️ [ICON] No se pudo cambiar el icono del Dock: {e}")

def obtener_puerto_libre(puerto_preferido=8089):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('127.0.0.1', puerto_preferido))
            return puerto_preferido
    except Exception:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('127.0.0.1', 0))
            return s.getsockname()[1]



def _get_webview_gui():
    if sys.platform == "darwin":
        return "cocoa"
    if sys.platform == "win32":
        return "edgechromium"
    return "gtk"


def _load_system_font(size_large=36, size_normal=28):
    from PIL import ImageFont

    font_large = ImageFont.load_default()
    font_normal = ImageFont.load_default()
    candidates = []
    if sys.platform == "win32":
        candidates = [
            r"C:\Windows\Fonts\segoeui.ttf",
            r"C:\Windows\Fonts\arial.ttf",
            r"C:\Windows\Fonts\calibri.ttf",
        ]
    elif sys.platform == "darwin":
        candidates = [
            "/System/Library/Fonts/Helvetica.ttc",
            "/System/Library/Fonts/SFNSText.ttf",
        ]
    else:
        candidates = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ]

    for path in candidates:
        if os.path.exists(path):
            try:
                font_large = ImageFont.truetype(path, size_large)
                font_normal = ImageFont.truetype(path, size_normal)
                return font_large, font_normal
            except Exception:
                continue
    return font_large, font_normal


def _copiar_imagen_portapapeles(ruta):
    if sys.platform == "darwin":
        subprocess.run(
            ['/usr/bin/osascript', '-e',
             f'set the clipboard to (read (POSIX file "{ruta}") as TIFF picture)'],
            stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        return True

    if sys.platform == "win32":
        ruta_ps = ruta.replace("\\", "/")
        ps_script = (
            'Add-Type -AssemblyName System.Windows.Forms; '
            'Add-Type -AssemblyName System.Drawing; '
            f'$img = [System.Drawing.Image]::FromFile("{ruta_ps}"); '
            '[System.Windows.Forms.Clipboard]::SetImage($img); '
            '$img.Dispose()'
        )
        subprocess.run(
            ["powershell", "-NoProfile", "-Command", ps_script],
            check=True,
            capture_output=True,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
        return True

    return False


def _dashboard_url(puerto, base_path):
    for nombre in ("Dashboard.html", "dashboard.html"):
        ruta = os.path.join(VIEWS_HTML, nombre)
        if os.path.exists(ruta):
            rel = os.path.relpath(ruta, base_path).replace("\\", "/")
            return f"http://127.0.0.1:{puerto}/{rel}"
    return f"http://127.0.0.1:{puerto}/Views/html/Dashboard.html"


def limpiar_archivos_desechables(dias=1):
    """
    Elimina archivos generados desechables con más de `dias` de antigüedad (default: 1 día / 24h).
    Archivos desechables:
      - Declaraciones de registro generadas y constancias
      - Declaraciones WOM generadas en Views/Files/declaraciones_generadas/
      - Anexos para desbloqueo de WOM y ETB (_tmp_print_*, *_anexos_firmados.pdf, *_celular.pdf, *_cc_identidad.pdf)
      - Pantallazos de IMEI (temp_screenshots, Controllers/temp_screenshots, pantallazos, etc.)
      - Fotos de IMEI/dispositivo en Views/Files (*_foto.*)
      - Carpetas de lotes con más de 1 día de antigüedad en FilesIMP/ y Resultados_Masivos/
    
    PROTECCIÓN ESTRICTA:
      - NUNCA elimina plantillas (Anexo1.pdf, Anexo2.pdf, DeclaracionWom.pdf, etc., ni fonts/)
      - NUNCA elimina documentos de identidad de encargados (*_cc.pdf, *_cc.jpg, *_cc.png, etc.)
      - NUNCA elimina firmas de encargados (*_firma.pdf, *_firma.png, *_firma.jpg, etc.)
    """
    import time
    import shutil
    import unicodedata

    limite_tiempo = time.time() - (dias * 24 * 3600)

    if getattr(sys, 'frozen', False):
        base_app = os.path.dirname(sys.executable)
        base_proj = sys._MEIPASS
    else:
        base_proj = PROJECT_ROOT
        base_app = PROJECT_ROOT

    archivos_plantillas_protegidas = {
        'anexo1.pdf', 'anexo2.pdf', 'declaracionwom.pdf',
        'declaraciónwom.pdf', 'declaraciónwom.pdf', 'declaracion wom.pdf'
    }

    def es_archivo_permanente_protegido(nombre_archivo):
        norm = unicodedata.normalize('NFKD', nombre_archivo).encode('ASCII', 'ignore').decode('utf-8').lower().strip()
        if norm in archivos_plantillas_protegidas:
            return True
        # Identidades de encargados
        if any(norm.endswith(ext) for ext in ['_cc.pdf', '_cc.jpg', '_cc.jpeg', '_cc.png', '_cc.heic']):
            return True
        # Firmas de encargados
        if any(norm.endswith(ext) for ext in ['_firma.pdf', '_firma.png', '_firma.jpg', '_firma.jpeg']):
            return True
        return False

    eliminados = 0

    try:
        # A. Views/Files
        views_files = os.path.join(base_proj, "Views", "Files")
        if os.path.exists(views_files):
            # 1. declaraciones_generadas
            decl_gen = os.path.join(views_files, "declaraciones_generadas")
            if os.path.exists(decl_gen):
                for f in os.listdir(decl_gen):
                    fp = os.path.join(decl_gen, f)
                    if os.path.isfile(fp):
                        try:
                            if os.path.getmtime(fp) < limite_tiempo:
                                os.remove(fp)
                                eliminados += 1
                        except Exception:
                            pass

            # 2. Archivos en Views/Files
            for f in os.listdir(views_files):
                fp = os.path.join(views_files, f)
                if os.path.isfile(fp):
                    if es_archivo_permanente_protegido(f):
                        continue
                    # Desechables: _tmp_print, *_foto.*, test_decl_output.pdf
                    es_desechable = (
                        f.startswith('_tmp_print_') or
                        '_foto.' in f.lower() or
                        f == 'test_decl_output.pdf'
                    )
                    if es_desechable:
                        try:
                            if f.startswith('_tmp_print_') or f == 'test_decl_output.pdf' or os.path.getmtime(fp) < limite_tiempo:
                                os.remove(fp)
                                eliminados += 1
                        except Exception:
                            pass

        # B. FilesIMP
        files_imp = os.path.join(base_app, "FilesIMP")
        if os.path.exists(files_imp):
            for item in os.listdir(files_imp):
                ip = os.path.join(files_imp, item)
                if os.path.isfile(ip):
                    if any(item.endswith(s) for s in ['_anexos_firmados.pdf', '_celular.pdf', '_cc_identidad.pdf']):
                        try:
                            if os.path.getmtime(ip) < limite_tiempo:
                                os.remove(ip)
                                eliminados += 1
                        except Exception:
                            pass
                elif os.path.isdir(ip):
                    # Carpetas de lote pasadas (> 1 día)
                    try:
                        if os.path.getmtime(ip) < limite_tiempo:
                            shutil.rmtree(ip, ignore_errors=True)
                            eliminados += 1
                    except Exception:
                        pass

        # C. Resultados_Masivos
        res_mas = os.path.join(base_app, "Resultados_Masivos")
        if os.path.exists(res_mas):
            for item in os.listdir(res_mas):
                ip = os.path.join(res_mas, item)
                if os.path.isdir(ip):
                    try:
                        if os.path.getmtime(ip) < limite_tiempo:
                            shutil.rmtree(ip, ignore_errors=True)
                            eliminados += 1
                    except Exception:
                        pass

        # D. Directorios de temp_screenshots
        for tdir in [
            os.path.join(base_proj, "temp_screenshots"),
            os.path.join(base_proj, "Controllers", "temp_screenshots"),
            os.path.join(base_app, "temp_screenshots"),
            os.path.join(base_app, "pantallazos")
        ]:
            if os.path.exists(tdir):
                for f in os.listdir(tdir):
                    fp = os.path.join(tdir, f)
                    if os.path.isfile(fp):
                        try:
                            if os.path.getmtime(fp) < limite_tiempo or f.startswith('temp_'):
                                os.remove(fp)
                                eliminados += 1
                        except Exception:
                            pass

        # E. Archivos temporales sueltos en raíz
        for tmp_name in ['temp_test_ss.png', 'test_output.png', 'error_formato_tiempo.png', 'IMEI_358902518752824_1781296768.png']:
            tmp_p = os.path.join(base_proj, tmp_name)
            if os.path.exists(tmp_p):
                try:
                    os.remove(tmp_p)
                    eliminados += 1
                except Exception:
                    pass

        if eliminados > 0:
            print(f"🧹 [Limpieza] Purga de archivos desechables (> {dias} día): {eliminados} archivos/carpetas eliminados.")
    except Exception as e_clean:
        print(f"⚠️ [Limpieza] Error al limpiar temporales: {e_clean}")

    return eliminados


class Api:
    def __init__(self):
        self.window = None
        self.current_user = None
        self._init_supabase_config()
        print("✅ [API] Conectado a Supabase IMPDB.")
        
        # Iniciar hilo de limpieza automática de temporales (> 1 día)
        def _loop_limpieza():
            while True:
                try:
                    limpiar_archivos_desechables(dias=1)
                except Exception:
                    pass
                time.sleep(4 * 3600)  # Cada 4 horas

        threading.Thread(target=_loop_limpieza, daemon=True).start()

    # ── UTILIDADES INTERNAS ────────────────────────────────────────

    def _traer_al_frente(self):
        """Trae la ventana de la app al frente para que el diálogo del sistema sea visible."""
        try:
            if self.window:
                try:
                    self.window.restore()
                except Exception:
                    pass
                try:
                    self.window.show()
                except Exception:
                    pass
            if sys.platform == "darwin":
                subprocess.run(
                    ['/usr/bin/osascript', '-e',
                     f'tell application "System Events" to set frontmost of '
                     f'every process whose unix id is {os.getpid()} to true'],
                    timeout=2,
                    capture_output=True
                )
            elif sys.platform == "win32":
                import ctypes
                user32 = ctypes.windll.user32
                kernel32 = ctypes.windll.kernel32
                user32.AllowSetForegroundWindow(kernel32.GetCurrentProcessId())
        except Exception:
            pass

    def _get_files_imp_dir(self):
        """Retorna la ruta de FilesIMP junto al ejecutable, creándola si no existe."""
        if getattr(sys, 'frozen', False):
            base = os.path.dirname(sys.executable)
        else:
            base = PROJECT_ROOT
        folder = os.path.join(base, "FilesIMP")
        os.makedirs(folder, exist_ok=True)
        return folder

    def _resolver_ruta_archivo(self, ruta: str) -> str:
        """
        Resuelve una ruta guardada en base de datos (que puede haber sido guardada
        en macOS o Windows) buscando en la ruta absoluta original, en Views/Files/ o en FilesIMP/.
        """
        if not ruta or not isinstance(ruta, str):
            return ""
        if os.path.exists(ruta):
            return ruta
        # Normalizar separadores y obtener solo el nombre del archivo
        nombre = os.path.basename(ruta.replace("\\", "/"))
        if not nombre:
            return ""
        # 1. Buscar en Views/Files
        candidato_views = resource_path(os.path.join("Views", "Files", nombre))
        if os.path.exists(candidato_views):
            return candidato_views
        candidato_views_rel = os.path.join(VIEWS_DIR, "Files", nombre)
        if os.path.exists(candidato_views_rel):
            return candidato_views_rel
        # 2. Buscar en FilesIMP
        files_imp = self._get_files_imp_dir()
        candidato_imp = os.path.join(files_imp, nombre)
        if os.path.exists(candidato_imp):
            return candidato_imp
        return ""

    def _init_supabase_config(self):
        try:
            res = supabase.table('configuracion').select('clave').eq('clave', 'db_status').execute()
            if not res.data:
                supabase.table('configuracion').insert({'clave': 'db_status', 'valor': 'active'}).execute()
                print("✅ [SUPABASE] Configuración inicial (db_status=active) creada.")
            # Asegurar que los clientes 420 y 512 estén marcados como ocultos
            for cid in ['420', '512']:
                try:
                    res_c = supabase.table('clientes').select('id, oculto').eq('id', cid).execute()
                    if res_c and res_c.data and res_c.data[0].get('oculto') is not True:
                        supabase.table('clientes').update({'oculto': True}).eq('id', cid).execute()
                except Exception:
                    pass
        except Exception as e:
            print(f"⚠️ [SUPABASE] No se pudo verificar configuración inicial: {e}")

    # ── SEGURIDAD ──────────────────────────────────────────────────

    def _hash_password(self, password: str, salt: str) -> str:
        hashed = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return hashed.hex()

    def _get_db_status(self) -> str:
        try:
            res = supabase.table('configuracion').select('valor').eq('clave', 'db_status').execute()
            if res.data:
                return res.data[0]['valor']
            return 'active'
        except:
            return 'active'

    def _is_db_locked(self):
        try:
            db_status = self._get_db_status()
            if db_status == 'paused':
                if not self.current_user or self.current_user.get('rol') != 'admin':
                    return True
            return False
        except:
            return False

    # ── AUTENTICACIÓN ──────────────────────────────────────────────

    def registrar_usuario(self, usuario, password, nombre=""):
        email = usuario.strip()
        nombre = nombre.strip()
        if not email or not password:
            return {"status": "error", "mensaje": "El usuario y la contraseña son obligatorios."}
            
        if len(password) < 6:
            return {"status": "error", "mensaje": "La contraseña debe tener al menos 6 caracteres."}
            
        try:
            # 1. Verificar si ya existe en la tabla 'usuarios'
            existe_usuario = supabase.table('usuarios').select('usuario').ilike('usuario', email).execute()
            if existe_usuario.data:
                return {"status": "error", "mensaje": "Este usuario ya se encuentra registrado."}

            # 2. Verificar si ya existe una solicitud pendiente
            existe_solicitud = supabase.table('Solicitud').select('id').eq('Razon', 'solicitud_registro').eq('modelo', email).execute()
            if existe_solicitud.data:
                return {"status": "error", "mensaje": "Ya existe una solicitud de registro pendiente para este usuario."}
            
            # Registrar la solicitud en la tabla Solicitud
            from datetime import datetime
            data = {
                'IMEI': password,
                'Razon': 'solicitud_registro',
                'modelo': email,
                'descripcion': nombre or email,
                'ingreso': datetime.now().astimezone().isoformat()
            }
            res = supabase.table('Solicitud').insert(data).execute()
            
            if res.data and self.window:
                import json
                notif_json = json.dumps(res.data[0])
                self.window.evaluate_js(f"if (typeof window.recibirNotificacionRealtime === 'function') {{ window.recibirNotificacionRealtime({notif_json}); }}")
                
            return {
                "status": "success",
                "mensaje": "Solicitud de registro enviada con éxito. El administrador revisará y aprobará tu cuenta."
            }
        except Exception as e:
            return {"status": "error", "mensaje": f"Error al enviar la solicitud: {str(e)}"}

    def aprobar_registro(self, notif_id, email, password):
        if not self._es_admin():
            return {"status": "error", "mensaje": "Acceso denegado. Solo el administrador puede aprobar registros."}
            
        try:
            salt = os.urandom(16).hex()
            pwd_hash = self._hash_password(password, salt)

            # Insertar en tabla pública usuarios
            supabase.table('usuarios').insert({
                'usuario': email,
                'password_hash': pwd_hash,
                'salt': salt,
                'rol': 'user',
                'estado': 'activo'
            }).execute()
            
            # Eliminar la notificación de solicitud de registro
            supabase.table('Solicitud').delete().eq('id', notif_id).execute()
            
            return {
                "status": "success", 
                "mensaje": f"El registro de {email} ha sido aprobado y creado con éxito."
            }
        except Exception as e:
            err_msg = str(e)
            if "duplicate key" in err_msg.lower() or "23505" in err_msg:
                try:
                    supabase.table('Solicitud').delete().eq('id', notif_id).execute()
                except:
                    pass
                return {"status": "error", "mensaje": "Este usuario ya está registrado. Solicitud removida."}
            return {"status": "error", "mensaje": f"Error al aprobar el registro: {err_msg}"}

    def login_usuario(self, usuario, password):
        usuario = usuario.strip()
        print(f"🔑 [API] login_usuario llamado con usuario: '{usuario}'")
        if not usuario or not password:
            return {"status": "error", "mensaje": "El usuario y la contraseña son requeridos."}
        try:
            db_status = self._get_db_status()
            
            # 1. Intentar autenticación contra la tabla 'usuarios' personalizada
            res_u = safe_supabase(lambda: supabase.table('usuarios').select('*').ilike('usuario', usuario).execute())
            if res_u and res_u.data:
                user_rec = res_u.data[0]
                salt = user_rec.get('salt', '')
                expected_hash = user_rec.get('password_hash', '')
                calc_hash = self._hash_password(password, salt)

                if calc_hash != expected_hash:
                    print(f"❌ [API] Contraseña incorrecta para usuario: {usuario}")
                    return {"status": "error", "mensaje": "Usuario o contraseña incorrectos."}

                estado = user_rec.get('estado', 'activo')
                if estado == "suspendido":
                    return {"status": "error", "mensaje": "Tu cuenta se encuentra suspendida."}
                elif estado == "pending":
                    return {"status": "error", "mensaje": "Tu registro aún no ha sido aprobado por el administrador."}

                rol = user_rec.get('rol', 'user')
                if db_status == 'paused' and rol != 'admin':
                    return {
                        "status": "paused",
                        "mensaje": "El administrador ha puesto la base de datos en descanso temporal por mantenimiento."
                    }

                self.current_user = {
                    "usuario": user_rec.get('usuario', usuario),
                    "rol": rol,
                    "nombre": user_rec.get('usuario', usuario),
                    "avatar_url": "",
                    "access_token": None,
                    "refresh_token": None
                }
                print(f"✅ [API] Autenticación exitosa en tabla usuarios para: {usuario} (Rol: {rol})")
                return {
                    "status": "success",
                    "user": self.current_user,
                    "mensaje": f"Bienvenido de nuevo, {self.current_user['usuario']}."
                }

            # 2. Fallback a Supabase Auth nativo (para cuentas tipo correo)
            try:
                res = supabase.auth.sign_in_with_password({"email": usuario, "password": password})
                user = res.user
                if user:
                    print(f"✅ [API] Autenticación exitosa en Supabase Auth para: {usuario}")
                    metadata = user.user_metadata or {}
                    if usuario.lower() == "martinmh0722@gmail.com":
                        rol = "admin"
                    else:
                        rol = metadata.get("role") or metadata.get("rol") or "user"
                    
                    estado = metadata.get("status") or metadata.get("estado") or "activo"
                    if estado == "suspendido":
                        supabase.auth.sign_out()
                        return {"status": "error", "mensaje": "Tu cuenta se encuentra suspendida."}
                    elif estado == "pending" or rol == "pending":
                        supabase.auth.sign_out()
                        return {"status": "error", "mensaje": "Tu registro aún no ha sido aprobado por el administrador."}
                        
                    if db_status == 'paused' and rol != 'admin':
                        supabase.auth.sign_out()
                        return {
                            "status": "paused",
                            "mensaje": "El administrador ha puesto la base de datos en descanso temporal por mantenimiento."
                        }
                        
                    nombre_usuario = metadata.get("nombre") or metadata.get("name") or usuario.split('@')[0]
                    avatar_url = metadata.get("avatar_url") or metadata.get("foto_perfil") or ""

                    self.current_user = {
                        "usuario": usuario,
                        "rol": rol,
                        "nombre": nombre_usuario,
                        "avatar_url": avatar_url,
                        "access_token": res.session.access_token if res.session else None,
                        "refresh_token": res.session.refresh_token if res.session else None
                    }
                    if res.session:
                        _store_session(res.session.access_token, res.session.refresh_token)
                    return {
                        "status": "success",
                        "user": self.current_user,
                        "mensaje": f"Bienvenido de nuevo, {usuario}."
                    }
            except Exception as auth_err:
                auth_str = str(auth_err)
                if "Invalid login credentials" in auth_str:
                    return {"status": "error", "mensaje": "Usuario o contraseña incorrectos."}

            return {"status": "error", "mensaje": "Usuario no encontrado o credenciales incorrectas."}
        except Exception as e:
            err_msg = str(e)
            print(f"❌ [API] Excepción en login_usuario para '{usuario}': {err_msg}")
            return {"status": "error", "mensaje": f"Error al iniciar sesión: {err_msg}"}

    def login_con_token(self, access_token, refresh_token):
        print(f"🔑 [API] login_con_token llamado")
        if not access_token or not refresh_token:
            return {"status": "error", "mensaje": "Tokens no válidos."}
        try:
            db_status = self._get_db_status()
            
            # Establecer la sesión en el cliente de Supabase
            res = supabase.auth.set_session(access_token, refresh_token)
            user = res.user
            if not user:
                return {"status": "error", "mensaje": "No se pudo recuperar el usuario con la sesión guardada."}
            
            metadata = user.user_metadata or {}
            usuario = user.email
            
            if usuario.lower() == "martinmh0722@gmail.com":
                rol = "admin"
            else:
                rol = metadata.get("role") or metadata.get("rol") or "user"
            
            estado = metadata.get("status") or metadata.get("estado") or "activo"
            if estado == "suspendido":
                supabase.auth.sign_out()
                return {"status": "error", "mensaje": "Tu cuenta se encuentra suspendida."}
            elif estado == "pending" or rol == "pending":
                supabase.auth.sign_out()
                return {"status": "error", "mensaje": "Tu registro aún no ha sido aprobado por el administrador."}
                
            if db_status == 'paused' and rol != 'admin':
                supabase.auth.sign_out()
                return {
                    "status": "paused",
                    "mensaje": "El administrador ha puesto la base de datos en descanso temporal por mantenimiento."
                }
                
            nombre_usuario = metadata.get("nombre") or metadata.get("name") or usuario.split('@')[0]
            avatar_url = metadata.get("avatar_url") or metadata.get("foto_perfil") or ""

            # Si el avatar en user_metadata es gigante (>5KB), infla el JWT e inhabilita las consultas a Supabase
            if len(avatar_url) > 5000:
                print("⚠️ [Supabase Auth] Avatar gigante detectado en metadata. Limpiando para reparar cabecera JWT...")
                try:
                    res_fix = supabase.auth.update_user({"data": {"avatar_url": ""}})
                    avatar_url = ""
                    if res_fix and hasattr(res_fix, 'session') and res_fix.session:
                        res = res_fix
                except Exception as fix_err:
                    print(f"⚠️ [Supabase Auth] No se pudo auto-limpiar avatar antiguo: {fix_err}")

            self.current_user = {
                "usuario": usuario,
                "rol": rol,
                "nombre": nombre_usuario,
                "avatar_url": avatar_url,
                "access_token": res.session.access_token if res.session else None,
                "refresh_token": res.session.refresh_token if res.session else None
            }
            # Guardar tokens globalmente para restaurar sesión en caso de Broken Pipe
            if res.session:
                _store_session(res.session.access_token, res.session.refresh_token)
            return {
                "status": "success",
                "user": self.current_user,
                "mensaje": f"Bienvenido de nuevo, {usuario}."
            }
        except Exception as e:
            err_msg = str(e)
            print(f"❌ [API] Excepción en login_con_token: {err_msg}")
            return {"status": "error", "mensaje": f"Sesión expirada o inválida: {err_msg}"}

    def guardar_sesion_local(self, datos):
        """Guarda la sesión del usuario en disco para restaurarla automáticamente tras reinicios."""
        try:
            folder = self._get_files_imp_dir()
            path = os.path.join(folder, "session_cache.json")
            import json
            with open(path, "w", encoding="utf-8") as f:
                json.dump(datos, f, ensure_ascii=False, indent=2)
            print(f"💾 [API] Sesión persistida en disco para: {datos.get('email') or datos.get('usuario')}")
            return {"status": "success"}
        except Exception as e:
            print(f"⚠️ [API] Error guardando sesión en disco: {e}")
            return {"status": "error", "mensaje": str(e)}

    def obtener_sesion_local(self):
        """Recupera la sesión guardada en disco si existe."""
        try:
            folder = self._get_files_imp_dir()
            path = os.path.join(folder, "session_cache.json")
            if os.path.exists(path):
                import json
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    print(f"🔑 [API] Sesión persistida recuperada de disco: {data.get('email') or data.get('usuario')}")
                    return {"status": "success", "session": data}
            return {"status": "empty", "session": None}
        except Exception as e:
            print(f"⚠️ [API] Error leyendo sesión en disco: {e}")
            return {"status": "error", "mensaje": str(e)}

    def eliminar_sesion_local(self):
        """Elimina el archivo de sesión persistida en disco."""
        try:
            folder = self._get_files_imp_dir()
            path = os.path.join(folder, "session_cache.json")
            if os.path.exists(path):
                os.remove(path)
            print("🗑️ [API] Sesión persistida eliminada de disco.")
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def abrir_url(self, url):
        """Abre una URL en el navegador predeterminado del sistema."""
        try:
            import webbrowser
            webbrowser.open(str(url))
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def seleccionar_archivo_imagen(self):
        """Abre el selector de archivos nativo y devuelve la ruta de la imagen elegida.
        
        Se usa webview.create_file_dialog() en lugar de tkinter para evitar
        conflictos con el event loop de Cocoa en macOS (crash al abrir tkinter
        mientras pywebview controla el hilo principal de la GUI).
        """
        try:
            import webview
            # create_file_dialog debe llamarse desde el hilo principal de pywebview.
            # Cuando se invoca desde la API de JS ya estamos en el hilo correcto.
            file_types = ('Imágenes (*.png;*.jpg;*.jpeg;*.gif;*.webp;*.bmp)', 'Todos los archivos (*.*)')
            result = self.window.create_file_dialog(
                webview.OPEN_DIALOG,
                allow_multiple=False,
                file_types=file_types
            )
            if result and len(result) > 0:
                return {"status": "success", "ruta": result[0]}
            return {"status": "cancelled"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def leer_imagen_base64(self, ruta):
        """Lee un archivo de imagen y lo convierte en una data URI base64 optimizada (96x96 px)."""
        try:
            import base64
            with open(ruta, "rb") as f:
                data = f.read()
            # Redimensionar avatar a max 96x96 px JPEG para que ocupe ~1.5 KB
            # evitando inflar la cabecera HTTP JWT (causa de Broken Pipe)
            try:
                from PIL import Image
                import io
                img = Image.open(io.BytesIO(data))
                img = img.convert("RGB")
                img.thumbnail((96, 96), Image.LANCZOS)
                buf = io.BytesIO()
                img.save(buf, format="JPEG", optimize=True, quality=65)
                data = buf.getvalue()
                mime = "image/jpeg"
            except Exception as img_err:
                print(f"⚠️ [Avatar] Error optimizando avatar: {img_err}")
                mime = "image/png"
            b64 = base64.b64encode(data).decode("utf-8")
            data_url = f"data:{mime};base64,{b64}"
            return {"status": "success", "data_url": data_url}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def actualizar_perfil(self, nombre, avatar_data_url=""):
        """Actualiza el display name y avatar del usuario en Supabase user_metadata."""
        try:
            nombre = (nombre or "").strip()
            if not nombre:
                return {"status": "error", "mensaje": "El nombre no puede estar vacío."}

            update_data = {"nombre": nombre}
            if avatar_data_url:
                update_data["avatar_url"] = avatar_data_url

            res = supabase.auth.update_user({"data": update_data})
            if not res.user:
                return {"status": "error", "mensaje": "No se pudo actualizar el perfil."}

            # Re-establecer sesión: update_user rota el token, sin esto todas
            # las consultas siguientes a la BD fallarán por sesión inválida.
            try:
                if res.session:
                    supabase.auth.set_session(res.session.access_token, res.session.refresh_token)
                    _store_session(res.session.access_token, res.session.refresh_token)
                    if self.current_user:
                        self.current_user["access_token"] = res.session.access_token
                        self.current_user["refresh_token"] = res.session.refresh_token
                else:
                    # Si no devuelve sesión, intentar refrescarla
                    supabase.auth.refresh_session()
            except Exception as sess_err:
                print(f"⚠️ [Perfil] Aviso al re-establecer sesión: {sess_err}")

            # Actualizar current_user en memoria
            if self.current_user:
                self.current_user["nombre"] = nombre
                if avatar_data_url:
                    self.current_user["avatar_url"] = avatar_data_url

            return {
                "status": "success",
                "mensaje": "Perfil actualizado correctamente.",
                "user": {
                    "nombre": nombre,
                    "avatar_url": avatar_data_url or (self.current_user.get("avatar_url") if self.current_user else "")
                }
            }
        except Exception as e:
            return {"status": "error", "mensaje": f"Error al actualizar perfil: {str(e)}"}

    def validar_soporte_biometrico(self):
        if sys.platform != "darwin":
            return {"status": "success", "soportado": False}

        import subprocess
        import os
        
        self_dir = os.path.dirname(os.path.abspath(__file__))
        swift_script = os.path.join(self_dir, "BiometricAuth.swift")
        if not os.path.exists(swift_script):
            swift_script = resource_path("BiometricAuth.swift")
        
        if not os.path.exists(swift_script):
            return {"status": "success", "soportado": False}
            
        try:
            res = subprocess.run(["swift", swift_script, "--check"], capture_output=True, text=True, timeout=5)
            if res.returncode == 0 and "SUPPORTED" in res.stdout:
                return {"status": "success", "soportado": True}
            return {"status": "success", "soportado": False}
        except Exception:
            return {"status": "success", "soportado": False}

    def autenticar_con_huella(self):
        if sys.platform != "darwin":
            return {"status": "error", "mensaje": "Autenticación biométrica solo disponible en macOS."}

        import subprocess
        import os
        
        self_dir = os.path.dirname(os.path.abspath(__file__))
        swift_script = os.path.join(self_dir, "BiometricAuth.swift")
        if not os.path.exists(swift_script):
            swift_script = resource_path("BiometricAuth.swift")
        
        if not os.path.exists(swift_script):
            return {"status": "error", "mensaje": "Script de autenticación biométrica no encontrado."}
            
        try:
            res = subprocess.run(["swift", swift_script], capture_output=True, text=True, timeout=20)
            stdout = res.stdout.strip()
            stderr = res.stderr.strip()
            
            if res.returncode == 0 and "SUCCESS" in stdout:
                return {"status": "success", "mensaje": "Autenticación por huella digital exitosa."}
            else:
                msg = stdout if stdout else stderr
                if "ERROR:" in msg:
                    msg = msg.replace("ERROR:", "").strip()
                if not msg:
                    msg = "Autenticación cancelada o fallida."
                return {"status": "error", "mensaje": msg}
        except subprocess.TimeoutExpired:
            return {"status": "error", "mensaje": "Tiempo de espera agotado para Touch ID."}
        except Exception as e:
            return {"status": "error", "mensaje": f"Error de Touch ID: {str(e)}"}

    def logout_usuario(self):
        try:
            supabase.auth.sign_out()
        except:
            pass
        self.current_user = None
        return {"status": "success", "mensaje": "Sesión cerrada correctamente."}

    def obtener_estado_bd(self):
        try:
            status = self._get_db_status()
            return {"status": "success", "db_status": status}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def reconectar_bd(self):
        """Fuerza la reconexión con Supabase y reestablece la sesión del cliente."""
        if not self.current_user:
            return {"status": "error", "mensaje": "Se requiere iniciar sesión."}
        print("🔄 [API] Forzando reconexión y reinicio con la Base de Datos...")
        try:
            reset_supabase_client()
            status = self._get_db_status()
            return {
                "status": "success",
                "mensaje": "Conexión a la base de datos reestablecida con éxito",
                "db_status": status
            }
        except Exception as e:
            print(f"❌ [API] Error al reconectar la BD: {e}")
            return {"status": "error", "mensaje": f"Error al reconectar BD: {str(e)}"}

    def cambiar_estado_bd(self, usuario_admin, nuevo_estado):
        if nuevo_estado not in ['active', 'paused']:
            return {"status": "error", "mensaje": "Estado de base de datos inválido."}
        try:
            res = supabase.table('usuarios').select('rol').eq('usuario', usuario_admin).execute()
            if not res.data or res.data[0]['rol'] != 'admin':
                return {"status": "error", "mensaje": "Permiso denegado. Se requiere ser Administrador."}
            existing = supabase.table('configuracion').select('clave').eq('clave', 'db_status').execute()
            if existing.data:
                supabase.table('configuracion').update({'valor': nuevo_estado}).eq('clave', 'db_status').execute()
            else:
                supabase.table('configuracion').insert({'clave': 'db_status', 'valor': nuevo_estado}).execute()
            etiqueta = 'ACTIVA' if nuevo_estado == 'active' else 'EN DESCANSO'
            return {
                "status": "success",
                "db_status": nuevo_estado,
                "mensaje": f"Base de datos cambiada a estado: {etiqueta}."
            }
        except Exception as e:
            return {"status": "error", "mensaje": f"Error al cambiar estado: {str(e)}"}

    # ── AUTOMATIZACIÓN ─────────────────────────────────────────────

    def registrar_wom(self, imei, linea_wom, async_run=True, con_pantallazo=False, opciones_pantallazo=None):
        try:
            encargado_nombre = None
            
            # 1. Prioridad: Buscar la línea en la tabla 'lineas' para obtener a su propietario/encargado asignado
            if linea_wom:
                res_linea = supabase.table('lineas').select('encargado').eq('numero', str(linea_wom).strip()).execute()
                if res_linea.data and res_linea.data[0].get('encargado'):
                    encargado_nombre = res_linea.data[0]['encargado']
            
            # 2. Si no se encontró en 'lineas', buscar en 'encargados' cuál Encargado posee esta linea_wom en sus lineas_wom
            if not encargado_nombre and linea_wom:
                try:
                    res_encs = supabase.table('encargados').select('nombre, lineas_wom').execute()
                    if res_encs.data:
                        for enc_item in res_encs.data:
                            lineas_str = enc_item.get('lineas_wom', '') or ''
                            lineas_list = [l.strip() for l in lineas_str.split(',') if l.strip()]
                            if str(linea_wom).strip() in lineas_list:
                                encargado_nombre = enc_item.get('nombre')
                                break
                except Exception as e_enc:
                    print(f"⚠️ Error al buscar lineas_wom en encargados: {e_enc}")

            # 3. Si aún no hay encargado, buscar en la tabla 'registros' por IMEI
            if not encargado_nombre and imei:
                res = supabase.table('registros').select('encargado').eq('imei', str(imei).strip()).execute()
                if res.data and res.data[0].get('encargado'):
                    encargado_nombre = res.data[0]['encargado']

            # 4. Si aún no hay encargado, buscar en la tabla 'FastReg' por IMEI
            if not encargado_nombre and imei:
                res_fast = supabase.table('FastReg').select('encargado').eq('IMEI', str(imei).strip()).execute()
                if res_fast.data and res_fast.data[0].get('encargado'):
                    encargado_nombre = res_fast.data[0]['encargado']
            
            if not encargado_nombre:
                return {"status": "error", "mensaje": "Línea o IMEI sin encargado/propietario asignado."}
                
            encargado = self.obtener_encargado(encargado_nombre)
            if not encargado:
                return {"status": "error", "mensaje": f"No se encontraron datos del encargado: {encargado_nombre}"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

        partes = [p for p in encargado['nombre'].strip().split() if p]
        primer_nombre = partes[0] if partes else "NULL"
        segundo_nombre, primer_apellido, segundo_apellido = "NULL", "NULL", "NULL"

        if len(partes) == 2:
            primer_apellido = partes[1]
        elif len(partes) == 3:
            # En Colombia / LatAm, 3 nombres corresponden a: [Primer Nombre] [Primer Apellido] [Segundo Apellido]
            primer_apellido = partes[1]
            segundo_apellido = partes[2]
        elif len(partes) >= 4:
            # 4 o más nombres: [Primer Nombre] [Segundo Nombre] [Primer Apellido] [Segundo Apellido...]
            segundo_nombre = partes[1]
            primer_apellido = partes[2]
            segundo_apellido = " ".join(partes[3:])

        documento = encargado.get('identificacion', '')
        if not documento or not linea_wom:
            return {"status": "error", "mensaje": "Faltan datos de ID o Línea para el propietario registrado."}
        
        if opciones_pantallazo is None:
            opciones_pantallazo = {}
            
        # Buscar modelo por IMEI si no viene en opciones_pantallazo
        if not opciones_pantallazo.get('modelo') and imei:
            try:
                res_m = supabase.table('registros').select('modelo').eq('imei', str(imei).strip()).execute()
                if res_m.data and res_m.data[0].get('modelo'):
                    opciones_pantallazo['modelo'] = res_m.data[0]['modelo']
                else:
                    res_mf = supabase.table('FastReg').select('modelo').eq('IMEI', str(imei).strip()).execute()
                    if res_mf.data and res_mf.data[0].get('modelo'):
                        opciones_pantallazo['modelo'] = res_mf.data[0]['modelo']
            except Exception as e_m:
                print(f"Error fetching modelo for WOM: {e_m}")

        base_dir = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
        temp_dir = os.path.join(base_dir, 'temp_screenshots')
        os.makedirs(temp_dir, exist_ok=True)
        ruta_pantallazo = os.path.join(temp_dir, f"wom_{imei}.png") if con_pantallazo else None

        ruta_script = script_path("RegistrarWom.py")

        # ── Guardar automáticamente en FastReg (Módulo de Registros) ──
        try:
            from datetime import datetime
            ahora_iso = datetime.now().astimezone().isoformat()
            
            existente_fast = None
            try:
                rf = safe_supabase(lambda: supabase.table('FastReg').select('*').eq('IMEI', str(imei).strip()).execute())
                if rf and rf.data:
                    existente_fast = rf.data[0]
            except Exception:
                pass

            modelo_val = (opciones_pantallazo.get('modelo') if opciones_pantallazo else None) or ''
            if not modelo_val:
                if existente_fast and existente_fast.get('MODELO'):
                    modelo_val = existente_fast.get('MODELO')
                else:
                    try:
                        r_reg = safe_supabase(lambda: supabase.table('registros').select('modelo, cliente').eq('imei', str(imei).strip()).execute())
                        if r_reg and r_reg.data:
                            modelo_val = r_reg.data[0].get('modelo', '')
                    except Exception:
                        pass

            cliente_val = (existente_fast.get('CLIENTE') if existente_fast else '') or ''
            if not cliente_val or cliente_val == 'Anónimo':
                try:
                    r_reg = safe_supabase(lambda: supabase.table('registros').select('cliente').eq('imei', str(imei).strip()).execute())
                    if r_reg and r_reg.data and r_reg.data[0].get('cliente'):
                        cliente_val = r_reg.data[0].get('cliente')
                except Exception:
                    pass
            if not cliente_val:
                cliente_val = 'Anónimo'

            fast_payload = {
                'IMEI': str(imei).strip(),
                'MODELO': modelo_val or '',
                'ESTADO': 'Registrado',
                'OPERADOR': 'WOM',
                'CLIENTE': cliente_val,
                'PAGO': existente_fast.get('PAGO', 'No') if existente_fast else 'No',
                'LÍNEA': str(linea_wom).strip() if linea_wom else '',
                'encargado': encargado_nombre or (existente_fast.get('encargado') if existente_fast else ''),
                'RAZÓN': existente_fast.get('RAZÓN') or 'Registro WOM'
            }
            safe_supabase(lambda: supabase.table('FastReg').upsert(fast_payload).execute())
            print(f"✅ [FastReg] Registro sincronizado en FastReg para IMEI {imei} (WOM)")

            if linea_wom:
                try:
                    safe_supabase(lambda: supabase.table('lineas').update({'las_use': ahora_iso}).eq('numero', str(linea_wom).strip()).execute())
                except Exception as le:
                    print(f"⚠️ Error actualizando las_use: {le}")

            if self.window:
                self.window.evaluate_js("if (typeof window.recibirActualizacionFastReg === 'function') { window.recibirActualizacionFastReg(); }")
        except Exception as e_fast:
            print(f"⚠️ Error guardando en FastReg (WOM): {e_fast}")
        
        def run_bot():
            import json
            from datetime import datetime
            try:
                cmd = [sys.executable, ruta_script, str(imei), str(linea_wom), str(documento),
                       str(primer_nombre), str(segundo_nombre), str(primer_apellido), str(segundo_apellido)]
                if ruta_pantallazo:
                    cmd.append(str(ruta_pantallazo))
                    if opciones_pantallazo:
                        cmd.append(json.dumps(opciones_pantallazo))
                proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8')
                stdout, _ = proc.communicate()
                resultado = {"status": "error", "mensaje": "Error de comunicación con Selenium."}
                for line in stdout.splitlines():
                    if line.startswith('{'):
                        try: resultado = json.loads(line)
                        except: pass
                if resultado.get("status") == "success":
                    self.actualizar_campo(imei, 'reg_wom', datetime.now().astimezone().isoformat())
                elif resultado.get("status") == "error":
                    self.actualizar_campo(imei, 'reg_wom', 'Error')
                
                ss_path = resultado.get("screenshot_path")
                if ss_path and os.path.exists(ss_path):
                    abrir_archivo(ss_path)

                if async_run and self.window:
                    msg = resultado.get('mensaje', '').replace("'", "\\'")
                    self.window.evaluate_js(f"showToast('{msg}', '')")
                    self.window.evaluate_js("cargarDatos().then(() => actualizarUIBotonesRegistro())")
                return resultado
            except Exception as e:
                err_res = {"status": "error", "mensaje": f"Error interno: {str(e)}"}
                if async_run and self.window:
                    self.window.evaluate_js(f"showToast('Error interno: {str(e)}', '')")
                return err_res
                
        if async_run:
            threading.Thread(target=run_bot, daemon=True).start()
            return {"status": "success", "mensaje": "Bot WOM lanzado..."}
        else:
            return run_bot()

    def registrar_etb(self, imei, linea_etb, async_run=True, con_pantallazo=False, opciones_pantallazo=None):
        if not linea_etb:
            return {"status": "error", "mensaje": "Falta la línea ETB."}
        
        if opciones_pantallazo is None:
            opciones_pantallazo = {}
            
        # Buscar modelo y propietario por IMEI si no vienen en opciones_pantallazo
        if imei:
            try:
                if not opciones_pantallazo.get('modelo'):
                    res_m = supabase.table('registros').select('modelo').eq('imei', str(imei).strip()).execute()
                    if res_m.data and res_m.data[0].get('modelo'):
                        opciones_pantallazo['modelo'] = res_m.data[0]['modelo']
                    else:
                        res_mf = supabase.table('FastReg').select('modelo').eq('IMEI', str(imei).strip()).execute()
                        if res_mf.data and res_mf.data[0].get('modelo'):
                            opciones_pantallazo['modelo'] = res_mf.data[0]['modelo']
                if not opciones_pantallazo.get('propietario'):
                    res_prop = supabase.table('registros').select('cliente, encargado').eq('imei', str(imei).strip()).execute()
                    if res_prop.data:
                        opciones_pantallazo['propietario'] = res_prop.data[0].get('cliente') or res_prop.data[0].get('encargado') or ''
                    else:
                        res_prop_f = supabase.table('FastReg').select('CLIENTE, ENCARGADO').eq('IMEI', str(imei).strip()).execute()
                        if res_prop_f.data:
                            opciones_pantallazo['propietario'] = res_prop_f.data[0].get('CLIENTE') or res_prop_f.data[0].get('ENCARGADO') or ''
            except Exception as e_m:
                print(f"Error fetching datos for ETB: {e_m}")

        base_dir = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
        temp_dir = os.path.join(base_dir, 'temp_screenshots')
        os.makedirs(temp_dir, exist_ok=True)
        ruta_pantallazo = os.path.join(temp_dir, f"etb_{imei}.png") if con_pantallazo else None

        ruta_script = script_path("RegistrarEtb.py")

        # ── Guardar automáticamente en FastReg (Módulo de Registros) ──
        try:
            from datetime import datetime
            ahora_iso = datetime.now().astimezone().isoformat()

            existente_fast = None
            try:
                rf = safe_supabase(lambda: supabase.table('FastReg').select('*').eq('IMEI', str(imei).strip()).execute())
                if rf and rf.data:
                    existente_fast = rf.data[0]
            except Exception:
                pass

            modelo_val = (opciones_pantallazo.get('modelo') if opciones_pantallazo else None) or ''
            if not modelo_val:
                if existente_fast and existente_fast.get('MODELO'):
                    modelo_val = existente_fast.get('MODELO')
                else:
                    try:
                        r_reg = safe_supabase(lambda: supabase.table('registros').select('modelo, cliente, encargado').eq('imei', str(imei).strip()).execute())
                        if r_reg and r_reg.data:
                            modelo_val = r_reg.data[0].get('modelo', '')
                    except Exception:
                        pass

            cliente_val = (existente_fast.get('CLIENTE') if existente_fast else '') or ''
            if not cliente_val or cliente_val == 'Anónimo':
                try:
                    r_reg = safe_supabase(lambda: supabase.table('registros').select('cliente').eq('imei', str(imei).strip()).execute())
                    if r_reg and r_reg.data and r_reg.data[0].get('cliente'):
                        cliente_val = r_reg.data[0].get('cliente')
                except Exception:
                    pass
            if not cliente_val:
                cliente_val = 'Anónimo'

            encargado_etb = (existente_fast.get('encargado') if existente_fast else '') or ''
            if not encargado_etb and linea_etb:
                try:
                    res_linea = safe_supabase(lambda: supabase.table('lineas').select('encargado').eq('numero', str(linea_etb).strip()).execute())
                    if res_linea and res_linea.data and res_linea.data[0].get('encargado'):
                        encargado_etb = res_linea.data[0]['encargado']
                except Exception:
                    pass
            if not encargado_etb and imei:
                try:
                    res_rg = safe_supabase(lambda: supabase.table('registros').select('encargado').eq('imei', str(imei).strip()).execute())
                    if res_rg and res_rg.data and res_rg.data[0].get('encargado'):
                        encargado_etb = res_rg.data[0]['encargado']
                except Exception:
                    pass

            fast_payload = {
                'IMEI': str(imei).strip(),
                'MODELO': modelo_val or '',
                'ESTADO': 'Registrado',
                'OPERADOR': 'ETB',
                'CLIENTE': cliente_val,
                'PAGO': existente_fast.get('PAGO', 'No') if existente_fast else 'No',
                'LÍNEA': str(linea_etb).strip() if linea_etb else '',
                'encargado': encargado_etb,
                'RAZÓN': existente_fast.get('RAZÓN') or 'Registro ETB'
            }
            safe_supabase(lambda: supabase.table('FastReg').upsert(fast_payload).execute())
            print(f"✅ [FastReg] Registro sincronizado en FastReg para IMEI {imei} (ETB)")

            if linea_etb:
                try:
                    safe_supabase(lambda: supabase.table('lineas').update({'las_use': ahora_iso}).eq('numero', str(linea_etb).strip()).execute())
                except Exception as le:
                    print(f"⚠️ Error actualizando las_use: {le}")

            if self.window:
                self.window.evaluate_js("if (typeof window.recibirActualizacionFastReg === 'function') { window.recibirActualizacionFastReg(); }")
        except Exception as e_fast:
            print(f"⚠️ Error guardando en FastReg (ETB): {e_fast}")
        
        def run_bot():
            import json
            from datetime import datetime
            try:
                cmd = [sys.executable, ruta_script, str(imei), str(linea_etb)]
                if ruta_pantallazo:
                    cmd.append(str(ruta_pantallazo))
                    if opciones_pantallazo:
                        cmd.append(json.dumps(opciones_pantallazo))
                proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8')
                stdout, _ = proc.communicate()
                resultado = {"status": "error", "mensaje": "Error de comunicación con Selenium ETB."}
                for line in stdout.splitlines():
                    if line.startswith('{'):
                        try: resultado = json.loads(line)
                        except: pass
                if resultado.get("status") == "success":
                    self.actualizar_campo(imei, 'reg_etb', datetime.now().astimezone().isoformat())
                elif resultado.get("status") == "error":
                    self.actualizar_campo(imei, 'reg_etb', 'Error')
                
                ss_path = resultado.get("screenshot_path")
                if ss_path and os.path.exists(ss_path):
                    abrir_archivo(ss_path)

                if async_run and self.window:
                    msg = resultado.get('mensaje', '').replace("'", "\\'")
                    self.window.evaluate_js(f"showToast('{msg}', '')")
                    self.window.evaluate_js("cargarDatos().then(() => actualizarUIBotonesRegistro())")
                return resultado
            except Exception as e:
                err_res = {"status": "error", "mensaje": f"Error interno: {str(e)}"}
                if async_run and self.window:
                    self.window.evaluate_js(f"showToast('Error interno: {str(e)}', '')")
                return err_res
                
        if async_run:
            threading.Thread(target=run_bot, daemon=True).start()
            return {"status": "success", "mensaje": "Bot ETB lanzado..."}
        else:
            return run_bot()

    # ── ENCARGADOS ─────────────────────────────────────────────────

    def obtener_todos_encargados(self):
        try:
            res = safe_supabase(lambda: supabase.table('encargados').select('*').execute())
            return res.data if res.data else []
        except Exception as e:
            print(f"❌ [API] Error en obtener_todos_encargados: {e}")
            return []

    def obtener_encargado(self, nombre):
        try:
            res = safe_supabase(lambda: supabase.table('encargados').select('*').eq('nombre', nombre).execute())
            return res.data[0] if res.data else None
        except Exception as e:
            print(f"❌ [API] Error en obtener_encargado: {e}")
            return None

    def guardar_encargado(self, datos):
        try:
            existente = None
            try:
                res = safe_supabase(lambda: supabase.table('encargados').select('declaracion_wom, foto_cc').eq('nombre', datos['nombre']).execute())
                if res and res.data:
                    existente = res.data[0]
            except:
                pass
            decl_existente = existente['declaracion_wom'] if existente else ''
            cc_existente = existente['foto_cc'] if existente else ''
            data = {
                'nombre': datos['nombre'],
                'identificacion': datos.get('identificacion', ''),
                'lugar_expedicion': datos.get('lugar_expedicion', ''),
                'fecha_expedicion': datos.get('fecha_expedicion', ''),
                'direccion': datos.get('direccion', ''),
                'lineas_wom': datos.get('lineas_wom', ''),
                'lineas_etb': datos.get('lineas_etb', ''),
                'correo': datos.get('correo', ''),
                'mensaje': datos.get('mensaje', ''),
                'color': datos.get('color', '#39FF14'),
                'app_password': datos.get('app_password', ''),
                'declaracion_wom': datos.get('declaracion_wom', decl_existente),
                'foto_cc': datos.get('foto_cc', cc_existente)
            }
            safe_supabase(lambda: supabase.table('encargados').upsert(data).execute())
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def eliminar_encargado(self, nombre):
        try:
            safe_supabase(lambda: supabase.table('encargados').delete().eq('nombre', nombre).execute())
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    # ── REGISTROS ──────────────────────────────────────────────────

    def guardar_pin(self, imei, pin):
        try:
            safe_supabase(lambda: supabase.table('registros').update({'pin_desbloqueo': pin}).eq('imei', imei).execute())
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def set_window(self, window):
        self.window = window
        threading.Thread(target=self._monitor_notificaciones_bg, daemon=True).start()
        threading.Thread(target=self._monitor_registros_bg, daemon=True).start()

    def probar_notificacion(self, tipo="desbloqueo", imei="356789012345678", mensaje=""):
        try:
            import time
            from datetime import datetime
            tipo_lower = str(tipo or "desbloqueo").lower().strip()
            imei_val = str(imei or "356789012345678").strip()

            if tipo_lower == "desbloqueo":
                sub = "IMEI Desbloqueado"
                msg = mensaje or f"El IMEI {imei_val} ha sido desbloqueado"
                razon = "Desbloqueo"
            elif tipo_lower == "bloqueo":
                sub = "IMEI Bloqueado (Robo/Hurto)"
                msg = mensaje or f"El IMEI {imei_val} ha sido bloqueado"
                razon = "Bloqueo"
            elif tipo_lower == "solicitud":
                sub = "Nueva Solicitud"
                msg = mensaje or f"Nueva solicitud para IMEI {imei_val} (Samsung Galaxy S24)"
                razon = "Solicitud"
            else:
                sub = "Notificación de Prueba"
                msg = mensaje or f"Prueba de notificación para IMEI {imei_val}"
                razon = "Prueba"

            print(f"🧪 [TEST NOTIF] Emitiendo notificación de prueba ({tipo_lower}): {msg}")

            # 1. Enviar notificación nativa al SO (Windows / macOS)
            self._enviar_notificacion_nativa("IMEI Manager Pro", msg, subtitulo=sub)

            # 2. Despachar a la interfaz web si la ventana está activa
            if self.window:
                import json
                fake_notif = {
                    "id": int(time.time() * 1000) % 1000000,
                    "IMEI": imei_val,
                    "Razon": razon,
                    "modelo": "Dispositivo de Prueba",
                    "descripcion": msg,
                    "mensaje": msg,
                    "ingreso": datetime.now().astimezone().isoformat()
                }
                notif_json = json.dumps(fake_notif)
                self.window.evaluate_js(f"if (typeof window.recibirNotificacionRealtime === 'function') {{ window.recibirNotificacionRealtime({notif_json}); }}")

            return {"status": "success", "mensaje": f"Notificación emitida: {msg}"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def _enviar_notificacion_nativa(self, titulo, mensaje, subtitulo=""):
        try:
            titulo_clean = str(titulo or "IMEI Manager Pro").replace('"', '\\"').replace("'", "''")
            mensaje_clean = str(mensaje or "").replace('"', '\\"').replace("'", "''")
            subtitulo_clean = str(subtitulo or "").replace('"', '\\"').replace("'", "''")

            # 1. macOS: AppleScript con sonido Glass
            if sys.platform == "darwin":
                script = f'display notification "{mensaje_clean}" with title "{titulo_clean}"'
                if subtitulo_clean:
                    script += f' subtitle "{subtitulo_clean}"'
                script += ' sound name "Glass"'
                subprocess.Popen(['/usr/bin/osascript', '-e', script])

            # 2. Windows: PowerShell WinRT Toast Notification (Moderno Win10/11) con Fallback a BalloonTip
            elif sys.platform.startswith("win") or sys.platform == "win32":
                ps_script = f"""
                $ErrorActionPreference = 'SilentlyContinue'
                try {{
                    [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
                    $template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)
                    $textNodes = $template.GetElementsByTagName('text')
                    $titleText = '{titulo_clean}'
                    if ('{subtitulo_clean}') {{ $titleText = '{titulo_clean} - {subtitulo_clean}' }}
                    $textNodes.Item(0).AppendChild($template.CreateTextNode($titleText)) | Out-Null
                    $textNodes.Item(1).AppendChild($template.CreateTextNode('{mensaje_clean}')) | Out-Null
                    $toast = [Windows.UI.Notifications.ToastNotification]::new($template)
                    [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('IMEI Manager Pro').Show($toast)
                }} catch {{
                    [reflection.assembly]::loadwithpartialname('System.Windows.Forms') | Out-Null
                    $notify = new-object system.windows.forms.notifyicon
                    $notify.icon = [system.drawing.systemicons]::Information
                    $notify.visible = $true
                    $titleText = '{titulo_clean}'
                    if ('{subtitulo_clean}') {{ $titleText = '{titulo_clean} - {subtitulo_clean}' }}
                    $notify.showballoontip(4000, $titleText, '{mensaje_clean}', [system.windows.forms.tooltipicon]::Info)
                }}
                """
                flags = 0x08000000  # CREATE_NO_WINDOW
                subprocess.Popen(
                    ["powershell", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", ps_script],
                    creationflags=flags
                )

            # 3. Linux
            elif sys.platform.startswith("linux"):
                full_msg = f"{subtitulo_clean}\n{mensaje_clean}" if subtitulo_clean else mensaje_clean
                subprocess.Popen(['notify-send', titulo_clean, full_msg])
            else:
                print(f"🔔 [Notificación Nativa]: {titulo_clean} - {subtitulo_clean} - {mensaje_clean}")
        except Exception as e:
            print(f"⚠️ Error enviando notificación nativa: {e}")

    def _monitor_registros_bg(self):
        import time
        import hashlib
        import json

        time.sleep(3)

        last_registros_map = {}
        is_first_reg_check = True
        last_fastreg_hash = None
        INTERVALO_BASE = 3  # Polling reactivo cada 3s para notificaciones inmediatas de estado
        INTERVALO_MAX = 20
        intervalo_actual = INTERVALO_BASE
        errores_consecutivos = 0

        estados_bloqueo_set = {'robo/hurto', 'extravío', 'extravio', 'no registrado'}

        print("📡 [Realtime] Monitoreando cambios de estado en 'registros' y 'FastReg' (intervalo: 3s)...")
        while True:
            try:
                if self._is_db_locked():
                    time.sleep(INTERVALO_BASE)
                    continue

                # 1. Monitorear registros de IMEI y cambios de estado
                res_reg = safe_supabase(lambda: supabase.table('registros').select('*').execute())
                if res_reg and res_reg.data is not None:
                    reg_data = res_reg.data
                    current_map = {str(r.get('imei') or '').strip(): r for r in reg_data if r.get('imei')}

                    if is_first_reg_check:
                        last_registros_map = current_map
                        is_first_reg_check = False
                    else:
                        cambios_detectados = False
                        for imei, new_reg in current_map.items():
                            old_reg = last_registros_map.get(imei)
                            if old_reg:
                                old_estado = (old_reg.get('estado') or '').strip()
                                new_estado = (new_reg.get('estado') or '').strip()
                                old_est_low = old_estado.lower()
                                new_est_low = new_estado.lower()

                                if old_estado != new_estado and old_estado != '' and new_estado != '':
                                    cambios_detectados = True
                                    print(f"🔄 [Realtime Estado] IMEI {imei} cambió de '{old_estado}' a '{new_estado}'")

                                    # Detectar desbloqueo (de estado de bloqueo a Libre)
                                    if (old_est_low in estados_bloqueo_set or 'libre' not in old_est_low) and 'libre' in new_est_low:
                                        msg = f"El IMEI {imei} ha sido desbloqueado"
                                        self._enviar_notificacion_nativa("IMEI Manager Pro", msg, subtitulo="IMEI Desbloqueado")

                                    # Detectar bloqueo (de Libre a estado de bloqueo)
                                    elif 'libre' in old_est_low and (new_est_low in estados_bloqueo_set or 'libre' not in new_est_low):
                                        msg = f"El IMEI {imei} ha sido bloqueado"
                                        self._enviar_notificacion_nativa("IMEI Manager Pro", msg, subtitulo=f"IMEI Bloqueado ({new_estado})")

                                    # Otro cambio relevante
                                    else:
                                        msg = f"El IMEI {imei} cambió a {new_estado}"
                                        self._enviar_notificacion_nativa("IMEI Manager Pro", msg, subtitulo="Actualización de Estado")

                                    # Actualizar en tiempo real el frontend
                                    if self.window:
                                        op_val = new_reg.get('operador') or ''
                                        self.window.evaluate_js(
                                            f"if (typeof window.actualizarEstadoImeiRealtime === 'function') {{ window.actualizarEstadoImeiRealtime('{imei}', '{new_estado}', '{op_val}'); }}"
                                        )
                            elif old_reg is None and not is_first_reg_check:
                                cambios_detectados = True

                        if cambios_detectados:
                            if self.window:
                                self.window.evaluate_js("if (typeof window.recibirActualizacionRegistros === 'function') { window.recibirActualizacionRegistros(); }")

                        last_registros_map = current_map

                # 2. Monitorear FastReg
                res_fast = safe_supabase(lambda: supabase.table('FastReg').select('*').execute())
                if res_fast and res_fast.data is not None:
                    fast_data = res_fast.data
                    fast_data_sorted = sorted(fast_data, key=lambda x: str(x.get('IMEI', '')))
                    fast_json = json.dumps(fast_data_sorted, sort_keys=True)
                    fast_hash = hashlib.sha256(fast_json.encode('utf-8')).hexdigest()

                    if last_fastreg_hash is not None and fast_hash != last_fastreg_hash:
                        print("🔄 [Realtime] Cambio detectado en 'FastReg', avisando al frontend...")
                        if self.window:
                            self.window.evaluate_js("if (typeof window.recibirActualizacionFastReg === 'function') { window.recibirActualizacionFastReg(); }")
                    last_fastreg_hash = fast_hash

                if errores_consecutivos > 0:
                    print(f"✅ [Realtime] Conexión restablecida tras {errores_consecutivos} error(es).")
                errores_consecutivos = 0
                intervalo_actual = INTERVALO_BASE

            except Exception as e:
                errores_consecutivos += 1
                intervalo_actual = min(INTERVALO_BASE * (2 ** errores_consecutivos), INTERVALO_MAX)
                print(f"❌ [Realtime Error] Error monitoreando registros ({errores_consecutivos}x): {e} — reintentando en {intervalo_actual}s")

            time.sleep(intervalo_actual)

    def _monitor_notificaciones_bg(self):
        import time
        import json

        seen_ids = set()
        is_first_check = True
        INTERVALO_BASE = 3  # Polling continuo a 3s para notificaciones
        INTERVALO_MAX = 20
        intervalo_actual = INTERVALO_BASE
        errores_consecutivos = 0

        time.sleep(2)
        print("📡 [Realtime] Monitoreando notificaciones y solicitudes en BD (intervalo: 3s)...")
        while True:
            try:
                if self._is_db_locked():
                    time.sleep(INTERVALO_BASE)
                    continue

                # Consultar notificaciones de Supabase con safe_supabase
                res = safe_supabase(lambda: supabase.table('Solicitud').select('*').order('id', desc=True).execute())
                if res and res.data:
                    current_notifications = res.data

                    if is_first_check:
                        for notif in current_notifications:
                            n_id = notif.get('id') or notif.get('ID')
                            if n_id is not None:
                                seen_ids.add(n_id)
                        is_first_check = False
                    else:
                        new_notifications = []
                        for notif in current_notifications:
                            n_id = notif.get('id') or notif.get('ID')
                            if n_id is not None and n_id not in seen_ids:
                                seen_ids.add(n_id)
                                new_notifications.append(notif)

                        # Despachar notificaciones de más vieja a más nueva
                        for notif in reversed(new_notifications):
                            notif_json = json.dumps(notif)
                            print(f"🔔 [Realtime] Nueva notificación en BD: {notif}")
                            if self.window:
                                self.window.evaluate_js(f"if (typeof window.recibirNotificacionRealtime === 'function') {{ window.recibirNotificacionRealtime({notif_json}); }}")

                            # Disparar Notificación Nativa en Windows y macOS
                            imei = notif.get('IMEI') or notif.get('imei') or ''
                            razon = notif.get('Razon') or notif.get('razon') or notif.get('tipo') or 'Solicitud'
                            modelo = notif.get('modelo') or notif.get('Modelo') or ''
                            descripcion = notif.get('Descripción') or notif.get('descripcion') or notif.get('Descripcion') or notif.get('mensaje') or notif.get('Mensaje') or ''

                            titulo_nativ = "IMEI Manager Pro"
                            if descripcion and str(descripcion).startswith("Nueva solicitud"):
                                sub_nativ = "Nueva Solicitud"
                                msg_nativ = str(descripcion)
                            elif imei:
                                sub_nativ = f"Nueva Solicitud ({razon})"
                                msg_nativ = f"IMEI: {imei}" + (f" | {modelo}" if modelo else "")
                            elif descripcion:
                                sub_nativ = f"Centro de Notificaciones ({razon})"
                                msg_nativ = str(descripcion)
                            else:
                                sub_nativ = "Notificación de BD"
                                msg_nativ = f"Nueva entrada en solicitudes: {razon}"

                            self._enviar_notificacion_nativa(titulo_nativ, msg_nativ, subtitulo=sub_nativ)

                # Reset en caso de éxito
                if errores_consecutivos > 0:
                    print(f"✅ [Realtime Notif] Conexión restablecida tras {errores_consecutivos} error(es).")
                errores_consecutivos = 0
                intervalo_actual = INTERVALO_BASE

            except Exception as e:
                errores_consecutivos += 1
                intervalo_actual = min(INTERVALO_BASE * (2 ** errores_consecutivos), INTERVALO_MAX)
                print(f"⚠️ [Realtime] Error al monitorear notificaciones ({errores_consecutivos}x): {e} — reintentando en {intervalo_actual}s")

            time.sleep(intervalo_actual)

    def _evaluar_estado_registro(self, reg):
        if not reg:
            return "pendiente"
        estado = (reg.get('estado') or '').lower()
        razon = (reg.get('razon') or '').lower()
        reg_wom = (reg.get('reg_wom') or '')
        reg_etb = (reg.get('reg_etb') or '')
        if not estado or not razon:
            return "pendiente"
        if "registro" in razon and "no registro" not in razon:
            wom_exito = reg_wom and reg_wom not in ['No', 'Error', '']
            etb_exito = reg_etb and reg_etb not in ['No', 'Error', '']
            return "exitoso" if (wom_exito or etb_exito) else "pendiente"
        if "desbloqueo" in razon or "no registro" in razon:
            return "exitoso" if "libre" in estado else "pendiente"
        if "bloqueo" in razon:
            return "exitoso" if "libre" not in estado else "pendiente"
        return "pendiente"

    def _crear_notificacion_si_cambia_a_exitoso(self, imei, old_reg, new_reg):
        if not old_reg or not new_reg:
            return
        old_status = self._evaluar_estado_registro(old_reg)
        new_status = self._evaluar_estado_registro(new_reg)
        if old_status == "pendiente" and new_status == "exitoso":
            from datetime import datetime
            modelo = new_reg.get('modelo') or 'Dispositivo'
            razon_orig = (new_reg.get('razon') or '').lower()
            # Verificar primero "desbloqueo" antes de "bloqueo", ya que
            # "bloqueo" in "desbloqueo" es True en Python y causaría una
            # clasificación incorrecta.
            if "desbloqueo" in razon_orig or "no registro" in razon_orig:
                razon_notif = "Desbloqueo"
            elif "bloqueo" in razon_orig:
                razon_notif = "Bloqueo"
            else:
                razon_notif = "Desbloqueo"
            data = {
                'IMEI': imei,
                'Razon': razon_notif,
                'modelo': modelo,
                'ingreso': datetime.now().astimezone().isoformat()
            }
            try:
                res = supabase.table('Solicitud').insert(data).execute()
                print(f"✅ [NOTIFICACIÓN] Registrada para IMEI {imei}")
                if self.window and res.data:
                    import json
                    notif_json = json.dumps(res.data[0])
                    self.window.evaluate_js(f"if (typeof window.recibirNotificacionRealtime === 'function') {{ window.recibirNotificacionRealtime({notif_json}); }}")
            except Exception as ne:
                print(f"❌ [NOTIFICACIÓN] Error al registrar: {ne}")

    def obtener_notificaciones(self):
        if not self.current_user:
            return {"status": "success", "data": []}
        print("📡 [API] Solicitando notificaciones...")
        if self._is_db_locked():
            print("⚠️ [API] Acceso bloqueado a notificaciones: La BD está en descanso.")
            return {"status": "error", "mensaje": "La base de datos está actualmente en descanso."}
        try:
            res = safe_supabase(lambda: supabase.table('Solicitud').select('*').order('id', desc=True).execute())
            data = res.data if res.data else []
            print(f"✅ [API] Enviando {len(data)} notificaciones.")
            return {"status": "success", "data": data}
        except Exception as e:
            print(f"❌ [API] Error en obtener_notificaciones: {e}")
            return {"status": "error", "mensaje": str(e)}

    def eliminar_notificacion(self, notif_id):
        if self._is_db_locked():
            return {"status": "error", "mensaje": "La base de datos está actualmente en descanso."}
        try:
            safe_supabase(lambda: supabase.table('Solicitud').delete().eq('id', notif_id).execute())
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def borrar_todas_notificaciones(self):
        if self._is_db_locked():
            return {"status": "error", "mensaje": "La base de datos está actualmente en descanso."}
        try:
            safe_supabase(lambda: supabase.table('Solicitud').delete().gt('id', 0).execute())
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def obtener_registros(self):
        if not self.current_user:
            print("⚠️ [API] obtener_registros bloqueado: no hay sesión activa.")
            return []
        if self._is_db_locked():
            print("⚠️ [API] Acceso bloqueado a registros: La BD está en descanso.")
            return []
        print("📡 [API] Solicitando registros...")
        try:
            res = safe_supabase(lambda: supabase.table('registros').select('*').execute())
            data = res.data if res and res.data else []
            if not self._es_admin():
                hidden_ids, hidden_names = self._get_hidden_client_identifiers()
                data = [r for r in data if not self._is_hidden_client(r.get('cliente'), hidden_ids, hidden_names)]
            print(f"✅ [API] Enviando {len(data)} registros.")
            return data
        except Exception as e:
            print(f"❌ [API] Error en obtener_registros: {e}")
            return []

    def guardar_registro(self, datos):
        if self._is_db_locked():
            return {"status": "error", "mensaje": "La base de datos está actualmente en descanso. Acción no permitida."}
        print(f"📡 [API] Guardando nuevo registro: {datos.get('imei')}")
        try:
            data = {
                'imei': datos['imei'],
                'modelo': datos['modelo'],
                'estado': datos['estado'],
                'operador': datos['operador'],
                'cliente': datos['cliente'],
                'razon': datos['razon'],
                'encargado': datos['encargado'],
                'pago': datos['pago']
            }
            supabase.table('registros').insert(data).execute()
            print("✅ [API] Registro guardado con éxito.")
            return {"status": "success"}
        except Exception as e:
            error_msg = str(e)
            if 'duplicate key' in error_msg.lower() or '23505' in error_msg:
                print("⚠️ [API] IMEI ya existe.")
                return {"status": "error", "mensaje": "Este IMEI ya está registrado."}
            return {"status": "error", "mensaje": error_msg}

    def actualizar_campo(self, imei, campo, valor):
        if self._is_db_locked():
            return {"status": "error", "mensaje": "La base de datos está actualmente en descanso. Acción no permitida."}
        campos_permitidos = [
            "modelo", "cliente", "razon", "encargado", "pago",
            "reg_wom", "reg_etb", "foto_dispositivo", "linea", "blacklist",
            "estado", "operador", "pin_desbloqueo",
            "ruta_declaracion_generada", "fecha_declaracion_generada",
            "fecha_correo_wom", "correo_enviado", "archivo_creado", "pdf_generado"
        ]
        if campo not in campos_permitidos:
            return {"status": "error", "mensaje": f"Campo {campo} no modificable."}
        try:
            old_reg = None
            try:
                if campo in ["reg_wom", "reg_etb", "razon", "estado", "operador"]:
                    old_res = supabase.table('registros').select('*').eq('imei', imei).execute()
                    if old_res.data:
                        old_reg = old_res.data[0]
            except Exception as he:
                print(f"⚠️ [Hook] Error fetching old record: {he}")

            try:
                supabase.table('registros').update({campo: valor}).eq('imei', imei).execute()
            except Exception as ue:
                err_str = str(ue)
                print(f"⚠️ [Hook] Advertencia al actualizar campo '{campo}' en BD: {err_str}")
                if "schema \"net\" does not exist" in err_str or "3F000" in err_str:
                    print("💡 [Trigger BD] Nota: El trigger en Supabase requiere la extensión pg_net o manejar EXCEPTION.")
                    return {"status": "success", "advertencia": "Campo actualizado (trigger de BD requiere pg_net)"}
                raise ue

            try:
                if old_reg:
                    new_res = supabase.table('registros').select('*').eq('imei', imei).execute()
                    if new_res.data:
                        new_reg = new_res.data[0]
                        self._crear_notificacion_si_cambia_a_exitoso(imei, old_reg, new_reg)
            except Exception as he:
                print(f"⚠️ [Hook] Error executing notification check: {he}")

            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    # ── CORREO DESBLOQUEO WOM ──────────────────────────────────────

    def enviar_correo_desbloqueo_wom(self, imei, ruta_foto: str = ""):
        if not enviar_correo_desbloqueo:
            return {"status": "error", "mensaje": "Módulo de correo no disponible."}
        try:
            res = supabase.table('registros').select('*').eq('imei', imei).execute()
            if not res.data:
                return {"status": "error", "mensaje": "IMEI no encontrado en registros."}
            reg = res.data[0]
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

        modelo_reg = (reg.get('modelo') or '').strip()
        mod_lower = modelo_reg.lower()
        if not modelo_reg or mod_lower in ['error', 'error pro'] or mod_lower.startswith('error'):
            return {"status": "error", "mensaje": "El modelo del dispositivo es obligatorio y no puede ser 'Error' o 'Error Pro' para el desbloqueo WOM."}

        nombre_enc = reg.get('encargado', '')
        if not nombre_enc:
            return {"status": "error", "mensaje": "El registro no tiene encargado asignado."}
        enc = self.obtener_encargado(nombre_enc)
        if not enc:
            return {"status": "error", "mensaje": "Encargado no encontrado en la base de datos."}
        faltantes = []
        if not enc.get('correo'):          faltantes.append("correo del encargado")
        if not enc.get('app_password'):    faltantes.append("contraseña de aplicación Gmail")
        if not enc.get('identificacion'):  faltantes.append("número de identificación (CC)")
        if not enc.get('lineas_wom'):      faltantes.append("líneas WOM")
        pin = reg.get('pin_desbloqueo', '').strip()
        if not pin:                        faltantes.append("PIN de desbloqueo (se enviará como PENDIENTE)")
        if faltantes:
            solo_pin = faltantes == ["PIN de desbloqueo (se enviará como PENDIENTE)"]
            if not solo_pin:
                return {"status": "error", "mensaje": f"Faltan datos: {', '.join(faltantes)}"}
        decl_path_raw = reg.get('ruta_declaracion_generada', '').strip()
        decl_path = self._resolver_ruta_archivo(decl_path_raw) or None
        if not decl_path:
            return {"status": "error", "mensaje": "No se ha generado o no se encontró la declaración WOM para este IMEI."}
        foto_cc_raw = enc.get('foto_cc', '').strip()
        foto_cc = self._resolver_ruta_archivo(foto_cc_raw) or None
        if not foto_cc:
            return {"status": "error", "mensaje": "Falta la fotocopia de la CC del encargado o no se encontró el archivo."}
        foto_raw = ruta_foto.strip() if ruta_foto else reg.get('foto_dispositivo', '').strip()
        foto_path = self._resolver_ruta_archivo(foto_raw) or None
        def _bg():
            try:
                resultado = enviar_correo_desbloqueo(
                    correo_encargado=enc['correo'],
                    app_password=enc['app_password'],
                    nombre_encargado=enc['nombre'],
                    lineas_wom=enc['lineas_wom'],
                    imei=imei,
                    pin_desbloqueo=pin,
                    identificacion=enc['identificacion'],
                    modelo=modelo_reg,
                    ruta_foto_dispositivo=foto_path,
                    ruta_declaracion_wom=decl_path,
                    ruta_foto_cc=foto_cc
                )
                msg = resultado.get('mensaje', 'Correo enviado')
                if resultado.get('status') == 'success':
                    try:
                        from datetime import datetime
                        fecha_envio = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        safe_supabase(lambda: supabase.table('registros').update({
                            'fecha_correo_wom': fecha_envio,
                            'correo_enviado': True,
                            'fecha_declaracion_generada': fecha_envio
                        }).eq('imei', str(imei).strip()).execute())
                    except Exception as e_sup:
                        print(f"⚠️ Error actualizando fecha_declaracion_generada en Supabase: {e_sup}")
                if self.window:
                    icon = 'save' if resultado.get('status') == 'success' else 'error'
                    self.window.evaluate_js(f"showToast('{msg}', '{icon}')")
            except Exception as e:
                if self.window:
                    self.window.evaluate_js(f"showToast('Error al enviar correo: {str(e)}', 'error')")
        threading.Thread(target=_bg, daemon=True).start()
        return {"status": "success", "mensaje": "Enviando correo de desbloqueo WOM..."}

    # ── DIÁLOGOS DE ARCHIVO ────────────────────────────────────────

    def seleccionar_foto_dispositivo(self, imei: str):
        """Abre el Finder para elegir foto del dispositivo y la guarda en Views/Files/."""
        self._traer_al_frente()
        try:
            files_dir = os.path.join(VIEWS_DIR, "Files")
            os.makedirs(files_dir, exist_ok=True)
            file_types = (
                'Imagenes (*.png;*.jpg;*.jpeg;*.bmp;*.tiff;*.webp)',
                'Todos los archivos (*.*)'
            )
            tipo_dialogo = getattr(webview.FileDialog, 'OPEN', getattr(webview, 'OPEN_DIALOG', 1))
            result = self.window.create_file_dialog(tipo_dialogo, allow_multiple=False, file_types=file_types)
            if not result:
                return {"status": "cancelled", "mensaje": "Cancelado"}
            src = result[0]
            ext = os.path.splitext(src)[1]
            dst = os.path.join(files_dir, f"{imei}_foto{ext}")
            import shutil
            shutil.copy2(src, dst)
            self.actualizar_campo(imei, 'foto_dispositivo', dst)
            return {"status": "success", "ruta": dst, "mensaje": "Foto guardada"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def seleccionar_declaracion_wom(self, nombre_encargado: str):
        """Abre el Finder para elegir la firma (PDF o imagen) del encargado."""
        self._traer_al_frente()
        try:
            files_dir = os.path.join(VIEWS_DIR, "Files")
            os.makedirs(files_dir, exist_ok=True)
            file_types = ('Archivos de Firma (*.pdf;*.png;*.jpg;*.jpeg;*.webp)', 'Todos los archivos (*.*)')
            tipo_dialogo = getattr(webview.FileDialog, 'OPEN', getattr(webview, 'OPEN_DIALOG', 1))
            result = self.window.create_file_dialog(tipo_dialogo, allow_multiple=False, file_types=file_types)
            if not result:
                return {"status": "cancelled", "mensaje": "Cancelado"}
            src = result[0]
            ext = os.path.splitext(src)[1]
            safe_name = nombre_encargado.replace(' ', '_')
            dst = os.path.join(files_dir, f"{safe_name}_firma{ext}")
            import shutil
            shutil.copy2(src, dst)
            supabase.table('encargados').update({'declaracion_wom': dst}).eq('nombre', nombre_encargado).execute()
            return {"status": "success", "ruta": dst, "mensaje": "Firma guardada"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def seleccionar_foto_cc(self, nombre_encargado: str):
        """Abre el Finder para elegir la foto de la CC del encargado."""
        self._traer_al_frente()
        try:
            files_dir = os.path.join(VIEWS_DIR, "Files")
            os.makedirs(files_dir, exist_ok=True)
            file_types = ('Imagenes (*.png;*.jpg;*.jpeg)', 'Todos los archivos (*.*)')
            tipo_dialogo = getattr(webview.FileDialog, 'OPEN', getattr(webview, 'OPEN_DIALOG', 1))
            result = self.window.create_file_dialog(tipo_dialogo, allow_multiple=False, file_types=file_types)
            if not result:
                return {"status": "cancelled", "mensaje": "Cancelado"}
            src = result[0]
            ext = os.path.splitext(src)[1]
            safe_name = nombre_encargado.replace(' ', '_')
            dst = os.path.join(files_dir, f"{safe_name}_cc{ext}")
            import shutil
            shutil.copy2(src, dst)
            supabase.table('encargados').update({'foto_cc': dst}).eq('nombre', nombre_encargado).execute()
            return {"status": "success", "ruta": dst, "mensaje": "Fotocopia CC guardada"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    # ── MODELOS PRO ────────────────────────────────────────────────
    # Pegar estos métodos dentro de la clase Api, en la sección ── MODELOS ──
    # Reemplaza los métodos consultar_modelo, consultar_modelo_solo y consultar_modelos

    def consultar_modelo_pro(self, imei, con_pantallazo=False):
        """
        Ejecuta ConsultarModeloPro.py como subprocess.
        Retorna {status, modelo, screenshot_path?, consultas_restantes}
        Usado por: botón "Modelo" en el modal y botón "Modelo" por fila.
        """
        import json as _json
        try:
            ruta_script = script_path("ConsultarModeloPro.py")
            if not os.path.exists(ruta_script):
                return {"status": "error", "mensaje": "Script ConsultarModeloPro.py no encontrado."}

            cmd = [sys.executable, ruta_script, str(imei)]
            if con_pantallazo:
                cmd.append("--screenshot")

            proc = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                encoding="utf-8"
            )
            stdout, _ = proc.communicate(timeout=60)

            for line in reversed(stdout.splitlines()):
                line = line.strip()
                if line.startswith("{"):
                    data = _json.loads(line)
                    return data

            return {"status": "error", "mensaje": "Sin respuesta válida del script."}
        except subprocess.TimeoutExpired:
            return {"status": "error", "mensaje": "Tiempo de espera agotado (60s)."}
    def consultar_modelo_estandar(self, imei):
        """
        Ejecuta ConsultarModelo.py como subprocess.
        Retorna {status, modelo, screenshot_path}
        """
        import json as _json
        try:
            ruta_script = script_path("ConsultarModelo.py")
            if not os.path.exists(ruta_script):
                return {"status": "error", "mensaje": "Script ConsultarModelo.py no encontrado."}

            cmd = [sys.executable, ruta_script, str(imei), "--headless"]

            proc = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                encoding="utf-8"
            )
            stdout, stderr = proc.communicate(timeout=60)

            for line in reversed(stdout.splitlines()):
                line = line.strip()
                if line.startswith("{"):
                    data = _json.loads(line)
                    modelo = data.get("modelo", "")
                    screenshot_path = data.get("pantallazo", "")
                    if modelo == "Error" or not modelo:
                        return {"status": "error", "mensaje": "Error en la consulta estándar o no se detectó el modelo."}
                    return {
                        "status": "success",
                        "modelo": modelo,
                        "screenshot_path": screenshot_path
                    }

            return {"status": "error", "mensaje": f"Sin respuesta válida del script estándar. Stderr: {stderr}"}
        except subprocess.TimeoutExpired:
            return {"status": "error", "mensaje": "Tiempo de espera agotado en consulta estándar (60s)."}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def obtener_estado_cupos_modelo(self):
        """
        Lee el estado actual de cupos de ConsultarModeloPro (sin hacer consulta).
        Retorna {status, consultas_restantes, limite, bloqueado, horas, minutos}
        """
        import json as _json
        try:
            ruta_script = script_path("ConsultarModeloPro.py")
            if not os.path.exists(ruta_script):
                # Fallback: leer JSON directamente
                return self._leer_estado_cupos_directo()

            cmd = [sys.executable, ruta_script, "--estado"]
            proc = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                encoding="utf-8"
            )
            stdout, _ = proc.communicate(timeout=10)

            for line in reversed(stdout.splitlines()):
                line = line.strip()
                if line.startswith("{"):
                    return _json.loads(line)

            return self._leer_estado_cupos_directo()
        except Exception as e:
            return {"status": "error", "mensaje": str(e), "consultas_restantes": 0}

    def _leer_estado_cupos_directo(self):
        """Fallback: lee el JSON de estado directamente sin invocar el script."""
        import json as _json
        from datetime import datetime, timedelta

        LIMITE = 5
        HORAS_RESET = 24
        archivo = os.path.join(os.path.expanduser("~"), "IMEIManagerData", "estado_modelo_pro.json")

        try:
            if os.path.exists(archivo):
                with open(archivo, "r") as f:
                    estado = _json.load(f)
            else:
                estado = {
                    "consultas_restantes": LIMITE,
                    "bloqueado_hasta": None,
                    "ultimo_reset": datetime.now().isoformat()
                }

            ahora = datetime.now()

            # Verificar reset por tiempo
            if estado.get("ultimo_reset"):
                ultimo_reset = datetime.fromisoformat(estado["ultimo_reset"])
                if ahora >= ultimo_reset + timedelta(hours=HORAS_RESET):
                    estado["consultas_restantes"] = LIMITE
                    estado["bloqueado_hasta"] = None
                    estado["ultimo_reset"] = ahora.isoformat()
                    with open(archivo, "w") as f:
                        _json.dump(estado, f)

            # Calcular tiempo restante
            ultimo_reset = datetime.fromisoformat(estado.get("ultimo_reset", ahora.isoformat()))
            proximo_reset = ultimo_reset + timedelta(hours=HORAS_RESET)
            diferencia = proximo_reset - ahora
            horas = max(0, int(diferencia.total_seconds()) // 3600)
            minutos = max(0, (int(diferencia.total_seconds()) % 3600) // 60)

            restantes = estado.get("consultas_restantes", LIMITE)
            bloqueado = restantes <= 0 or estado.get("bloqueado_hasta") is not None

            return {
                "status": "success",
                "consultas_restantes": restantes,
                "limite": LIMITE,
                "bloqueado": bloqueado,
                "horas": horas,
                "minutos": minutos
            }
        except Exception as e:
            return {
                "status": "success",
                "consultas_restantes": LIMITE,
                "limite": LIMITE,
                "bloqueado": False,
                "horas": 0,
                "minutos": 0
            }

    def consultar_imei_colombia_con_pantallazo(self, imei):
        """
        Consulta IMEI Colombia (estado/operador) + toma pantallazo.
        Guarda screenshot en Controllers/temp_screenshots/<imei>_colombia.png
        Retorna {status, estado, operador, screenshot_path}
        """
        try:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            temp_dir = os.path.join(base_dir, 'temp_screenshots')
            os.makedirs(temp_dir, exist_ok=True)
            ruta = os.path.join(temp_dir, f"{imei}_colombia.png")

            # Estado/operador
            scraper_est = ScraperEstado(headless=True)
            estado, operador = scraper_est.consultar(imei)
            scraper_est.close()

            # Pantallazo
            scraper_pan = ScraperPantallazo(headless=True)
            scraper_pan.consultar_y_capturar(imei, ruta)
            scraper_pan.close()

            screenshot_path = ruta if os.path.exists(ruta) else None
            return {
                "status": "success",
                "estado": estado,
                "operador": operador,
                "screenshot_path": screenshot_path
            }
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    # ── VERSIONES MIGRADAS A ConsultarModeloPro ────────────────────


    def consultar_modelos(self, imeis, headless: bool = False):
        """
        Consulta modelos en segundo plano para múltiples IMEIs.
        Migrado a ConsultarModeloPro.py (sin screenshot).
        """
        import json as _json
        for imei in imeis:
            self.actualizar_campo(imei, "modelo", "Consultando...")

        ruta_script = script_path("ConsultarModeloPro.py")

        def _bg():
            for imei in imeis:
                try:
                    cmd = [sys.executable, ruta_script, str(imei)]
                    proc = subprocess.Popen(
                        cmd,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True,
                        encoding="utf-8"
                    )
                    stdout, _ = proc.communicate(timeout=60)

                    for line in reversed(stdout.splitlines()):
                        line = line.strip()
                        if line.startswith("{"):
                            data = _json.loads(line)
                            modelo = data.get("modelo", "")
                            s = data.get("status", "")
                            if s == "success" and modelo:
                                self.actualizar_campo(imei, "modelo", modelo)
                            elif s in ("sin_cupos", "limite_web"):
                                # Sin cupos: marcar y detener el loop
                                self.actualizar_campo(imei, "modelo", "Sin cupos")
                                if self.window:
                                    msg = data.get("mensaje", "Sin cupos disponibles").replace("'", "\\'")
                                    self.window.evaluate_js(f"showToast('{msg}', 'warning')")
                                return
                            else:
                                self.actualizar_campo(imei, "modelo", "Error")
                            break
                except Exception:
                    self.actualizar_campo(imei, "modelo", "Error")

        threading.Thread(target=_bg, daemon=True).start()
        return {"status": "success", "mensaje": "Consulta de modelos iniciada en segundo plano"}

    def consultar_modelo_solo(self, imei):
        """
        Consulta modelo de un único IMEI (sincrónico).
        Migrado a ConsultarModeloPro.py (sin screenshot).
        """
        res = self.consultar_modelo_pro(imei, con_pantallazo=False)
        if res.get("status") == "success" and res.get("modelo"):
            return {
                "status": "success",
                "modelo": res["modelo"],
                "consultas_restantes": res.get("consultas_restantes", 0)
            }
        return {
            "status": "error",
            "mensaje": res.get("mensaje", "Modelo no encontrado"),
            "consultas_restantes": res.get("consultas_restantes", 0)
        }
    def consultar_modelo(self, imei):
        try:
            import json as _json
            import os, sys, subprocess

            _INVALID_MODELS = {"error", "no encontrado", "desconocido", "null", "undefined", ""}

            ruta_script = script_path("ConsultarModelo.py")

            if not os.path.exists(ruta_script):
                return {"status": "error", "mensaje": "Script de modelo no encontrado."}

            cmd = [sys.executable, ruta_script, str(imei), "--headless"]
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8')
            stdout, _ = proc.communicate()

            for line in reversed(stdout.splitlines()):
                if line.strip().startswith('{'):
                    data = _json.loads(line)
                    # Si el script mismo reporta error, devolvemos error
                    if data.get("status") == "error":
                        return {"status": "error", "mensaje": data.get("mensaje", "Modelo no encontrado.")}
                    modelo = (data.get("modelo") or "").strip()
                    if modelo.lower() in _INVALID_MODELS:
                        return {"status": "error", "mensaje": data.get("mensaje", "Modelo no encontrado.")}
                    return {"status": "success", "modelo": modelo}

            return {"status": "error", "mensaje": "Modelo no encontrado."}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def RegistrarETB(self, parametros):
        try:
            import os, json, subprocess, sys

            imei = str(parametros.get('imei', ''))
            linea = str(parametros.get('linea', ''))
            modo = parametros.get('modo', 'anonimo')
            datos_pdf = parametros.get('datos_pdf')

            ruta_script_etb = script_path("RegistrarEtb.py")

            if not os.path.exists(ruta_script_etb):
                return {"status": "error", "mensaje": f"Script ETB no encontrado."}

            # 1. Ejecutar el registro de ETB
            args_etb = [sys.executable, ruta_script_etb, imei, linea]
            proceso_etb = subprocess.run(args_etb, capture_output=True, text=True, encoding='utf-8')
            
            salida_final = {"status": "error", "mensaje": "Sin respuesta válida de ETB."}
            lineas = proceso_etb.stdout.strip().split('\n')
            for linea_texto in reversed(lineas):
                if linea_texto.strip().startswith('{'):
                    salida_final = json.loads(linea_texto.strip())
                    break

            # 2. Si ETB fue exitoso y el modo es estandar o detallada, llamar al GeneradorPDF
            if salida_final.get("status") == "success" and modo in ["estandar", "detallada"] and datos_pdf:
                ruta_script_pdf = script_path("GeneradorPDF.py")
                
                if os.path.exists(ruta_script_pdf):
                    datos_pdf['modo'] = modo
                    args_pdf = [sys.executable, ruta_script_pdf, json.dumps(datos_pdf)]
                    proceso_pdf = subprocess.run(args_pdf, capture_output=True, text=True, encoding='utf-8')
                    
                    for linea_pdf in reversed(proceso_pdf.stdout.strip().split('\n')):
                        if linea_pdf.strip().startswith('{'):
                            res_pdf = json.loads(linea_pdf.strip())
                            if res_pdf.get("status") == "success":
                                salida_final["pdf_ruta"] = res_pdf.get("ruta")
                                salida_final["mensaje"] += " (PDF generado)"
                                abrir_archivo(res_pdf.get("ruta"))
                            break

            return salida_final

        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def generar_declaracion_general(self, imei: str) -> dict:
        try:
            res = supabase.table('registros').select('*').eq('imei', imei).execute()
            if not res.data:
                return {"status": "error", "mensaje": "IMEI no encontrado."}
            reg = res.data[0]
            
            enc = self.obtener_encargado(reg.get('encargado', ''))
            if not enc:
                return {"status": "error", "mensaje": "Sin encargado asignado."}
                
            datos = {
                'nombre': enc.get('nombre', ''),
                'tipo_doc': 'C.C.',
                'num_doc': enc.get('identificacion', ''),
                'lugar_exp': enc.get('lugar_expedicion', ''),
                'linea_usuario': enc.get('lineas_etb', '').split(',')[0].strip() if enc.get('lineas_etb') else '',
                'operador': reg.get('operador', ''),
                'modelo': reg.get('modelo', ''),
                'imei': imei
            }
            
            import json, subprocess, sys, os
            ruta_script_pdf = script_path("GeneradorPDF.py")
            
            if os.path.exists(ruta_script_pdf):
                args_pdf = [sys.executable, ruta_script_pdf, json.dumps(datos)]
                proceso_pdf = subprocess.run(args_pdf, capture_output=True, text=True, encoding='utf-8')
                
                for linea_pdf in reversed(proceso_pdf.stdout.strip().split('\n')):
                    if linea_pdf.strip().startswith('{'):
                        res_pdf = json.loads(linea_pdf.strip())
                        if res_pdf.get("status") == "success":
                            output = res_pdf.get("ruta")
                            abrir_archivo(output)
                            return {"status": "success", "ruta": output, "mensaje": "Declaración general generada en Descargas."}
                        else:
                            return {"status": "error", "mensaje": res_pdf.get("mensaje", "Error al generar")}
            return {"status": "error", "mensaje": "Script GeneradorPDF no encontrado."}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def cargar_excel(self):
        """Abre el Finder para cargar un archivo Excel."""
        self._traer_al_frente()
        try:
            file_types = ('Archivos Excel (*.xlsx;*.xls)', 'Todos los archivos (*.*)')
            tipo_dialogo = getattr(webview.FileDialog, 'OPEN', getattr(webview, 'OPEN_DIALOG', 1))
            result = self.window.create_file_dialog(tipo_dialogo, allow_multiple=False, file_types=file_types)
            if not result:
                return {"status": "cancelled", "mensaje": "Carga cancelada"}
            ruta = result[0]
            wb = openpyxl.load_workbook(ruta)
            sheet_registros = wb.worksheets[0]
            registros_insertados = 0
            for row in sheet_registros.iter_rows(min_row=2, values_only=True):
                row_clean = [str(x) if x is not None else "" for x in row]
                while len(row_clean) < 11: row_clean.append("")
                if row_clean[0].strip() == "": continue
                try:
                    data = {
                        'imei': row_clean[0],
                        'modelo': row_clean[1],
                        'estado': row_clean[2],
                        'operador': row_clean[3],
                        'cliente': row_clean[4],
                        'razon': row_clean[5],
                        'encargado': row_clean[6],
                        'pago': row_clean[7],
                        'pin_desbloqueo': row_clean[8],
                        'reg_wom': row_clean[9] or 'No',
                        'reg_etb': row_clean[10] or 'No'
                    }
                    supabase.table('registros').upsert(data).execute()
                    registros_insertados += 1
                except Exception:
                    continue
            encargados_insertados = 0
            if len(wb.sheetnames) > 1:
                for row in wb.worksheets[1].iter_rows(min_row=2, values_only=True):
                    r = [str(x) if x is not None else "" for x in row]
                    while len(r) < 10: r.append("")
                    if r[0].strip() == "": continue
                    try:
                        data = {
                            'nombre': r[0],
                            'identificacion': r[1],
                            'lugar_expedicion': r[2],
                            'fecha_expedicion': r[3],
                            'direccion': r[4],
                            'lineas_wom': r[5],
                            'lineas_etb': r[6],
                            'correo': r[7],
                            'mensaje': r[8],
                            'color': r[9] or '#39FF14'
                        }
                        supabase.table('encargados').upsert(data).execute()
                        encargados_insertados += 1
                    except Exception:
                        pass
            return {"status": "success", "mensaje": f"Cargados: {registros_insertados} equipos y {encargados_insertados} encargados."}
        except Exception as e:
            return {"status": "error", "mensaje": f"Error interno al cargar: {str(e)}"}

    # ── IMPRESIÓN Y DESBLOQUEO ETB ─────────────────────────────────

    def imprimir_anexos_etb(self, imei: str) -> dict:
        """
        Une Anexo1.pdf y Anexo2.pdf desde Views/Files/ y abre el diálogo
        nativo de impresión del sistema (macOS Print Panel) vía AppleScript.
        Anexo1 = cara delantera, Anexo2 = reverso. B&N, 1 copia.
        """
        try:
            from pypdf import PdfReader, PdfWriter

            import tempfile
            anexo1 = self._resolver_ruta_archivo("Anexo1.pdf")
            anexo2 = self._resolver_ruta_archivo("Anexo2.pdf")

            faltantes = []
            if not anexo1 or not os.path.exists(anexo1): faltantes.append("Anexo1.pdf")
            if not anexo2 or not os.path.exists(anexo2): faltantes.append("Anexo2.pdf")
            if faltantes:
                return {
                    "status": "error",
                    "mensaje": f"No se encontraron en Views/Files/: {', '.join(faltantes)}"
                }

            # Unir Anexo1 (cara) + Anexo2 (reverso) en un solo PDF
            writer = PdfWriter()
            for path in [anexo1, anexo2]:
                for page in PdfReader(path).pages:
                    writer.add_page(page)

            tmp_dir = tempfile.gettempdir()
            tmp_path = os.path.join(tmp_dir, f"_tmp_print_{imei}.pdf")
            with open(tmp_path, "wb") as f:
                writer.write(f)

            if sys.platform == "win32":
                os.startfile(tmp_path, "print")
                mensaje = (
                    "Documento enviado a la cola de impresión.\n"
                    "• Recuerda configurar Blanco y Negro y Doble cara en tu impresora por defecto."
                )
            elif sys.platform == "darwin":
                # AppleScript: abrir en Preview y disparar ⌘P para el diálogo nativo
                script = f'''
set pdfPath to POSIX file "{tmp_path}"
tell application "Preview"
    activate
    open pdfPath
    delay 1.5
    tell application "System Events"
        tell process "Preview"
            keystroke "p" using command down
        end tell
    end tell
end tell
'''
                subprocess.Popen(['/usr/bin/osascript', '-e', script])
                mensaje = (
                    "Diálogo de impresión abierto en Preview.\n"
                    "• Selecciona Blanco y Negro\n"
                    "• 1 copia\n"
                    "• Doble cara: Anexo1 = cara · Anexo2 = reverso"
                )
            else:
                abrir_archivo(tmp_path)
                mensaje = "Documento abierto. Por favor imprímelo (Ctrl+P)."

            return {
                "status": "success",
                "mensaje": mensaje
            }
        except ImportError:
            return {"status": "error", "mensaje": "Instala pypdf: pip install pypdf"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}
            pass
    def seleccionar_anexos_pdf_etb(self, imei: str) -> dict:
        """Abre el Finder para elegir el/los anexos ya firmados y escaneados en PDF."""
        self._traer_al_frente()
        try:
            file_types = ('PDF (*.pdf)', 'Todos los archivos (*.*)')
            tipo_dialogo = getattr(webview.FileDialog, 'OPEN', getattr(webview, 'OPEN_DIALOG', 1))
            result = self.window.create_file_dialog(tipo_dialogo, allow_multiple=False, file_types=file_types)
            if not result:
                return {"status": "cancelled", "mensaje": "Cancelado"}
            src = result[0]
            files_imp = self._get_files_imp_dir()
            import shutil
            out = os.path.join(files_imp, f"{imei}_anexos_firmados.pdf")
            shutil.copy2(src, out)
            return {"status": "success", "ruta": out, "mensaje": "Anexos firmados guardados"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}
            
    def seleccionar_foto_celular_etb(self, imei: str) -> dict:
        """
        Abre el Finder para elegir la foto del celular.
        Convierte cualquier imagen a PDF automáticamente y la guarda en FilesIMP/.
        """
        self._traer_al_frente()
        try:
            file_types = (
                'Imagenes (*.png;*.jpg;*.jpeg;*.bmp;*.tiff;*.webp)',
                'PDF (*.pdf)',
                'Todos los archivos (*.*)'
            )
            tipo_dialogo = getattr(webview.FileDialog, 'OPEN', getattr(webview, 'OPEN_DIALOG', 1))
            result = self.window.create_file_dialog(tipo_dialogo, allow_multiple=False, file_types=file_types)
            if not result:
                return {"status": "cancelled", "mensaje": "Cancelado"}

            src = result[0]
            ext = os.path.splitext(src)[1].lower()
            files_imp = self._get_files_imp_dir()
            out_pdf = os.path.join(files_imp, f"{imei}_celular.pdf")

            if ext == '.pdf':
                import shutil
                shutil.copy2(src, out_pdf)
            else:
                from reportlab.pdfgen import canvas as pdf_canvas
                from reportlab.lib.pagesizes import letter
                from PIL import Image as PILImage

                img = PILImage.open(src).convert("RGB")
                img_w, img_h = img.size
                page_w, page_h = letter
                scale = min(page_w / img_w, page_h / img_h) * 0.95
                draw_w = img_w * scale
                draw_h = img_h * scale
                x = (page_w - draw_w) / 2
                y = (page_h - draw_h) / 2

                c = pdf_canvas.Canvas(out_pdf, pagesize=letter)
                c.drawImage(src, x, y, width=draw_w, height=draw_h)
                c.save()

            return {
                "status": "success",
                "ruta": out_pdf,
                "mensaje": "Foto del celular convertida a PDF"
            }
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def seleccionar_cc_pdf_etb(self, imei: str) -> dict:
        """Abre el Finder para elegir la copia del documento de identidad (PDF)."""
        self._traer_al_frente()
        try:
            file_types = ('PDF (*.pdf)', 'Todos los archivos (*.*)')
            tipo_dialogo = getattr(webview.FileDialog, 'OPEN', getattr(webview, 'OPEN_DIALOG', 1))
            result = self.window.create_file_dialog(tipo_dialogo, allow_multiple=False, file_types=file_types)
            if not result:
                return {"status": "cancelled", "mensaje": "Cancelado"}
            src = result[0]
            files_imp = self._get_files_imp_dir()
            import shutil
            out = os.path.join(files_imp, f"{imei}_cc_identidad.pdf")
            shutil.copy2(src, out)
            return {"status": "success", "ruta": out, "mensaje": "Copia de CC guardada"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def generar_pdf_desbloqueo_etb(self, imei: str, ruta_anexos: str, ruta_celular: str) -> dict:
        """
        Une los Anexos Firmados + foto celular + foto CC del encargado (tomada automáticamente)
        y guarda el resultado en ~/Downloads/[IMEI]desbloqueo.pdf
        """
        try:
            from pypdf import PdfReader, PdfWriter
            from reportlab.pdfgen import canvas as pdf_canvas
            from reportlab.lib.pagesizes import letter
            from PIL import Image as PILImage
            import shutil

            archivos = []
            faltantes = []

            # 1. Anexos primero
            if not ruta_anexos or not os.path.exists(ruta_anexos):
                faltantes.append("Anexos Firmados")
            else:
                archivos.append(ruta_anexos)

            # 2. Foto Celular
            if not ruta_celular or not os.path.exists(ruta_celular):
                faltantes.append("Foto celular")
            else:
                archivos.append(ruta_celular)

            # 3. CC del encargado — se obtiene automáticamente del registro
            ruta_cc = None
            try:
                reg = safe_supabase(lambda: supabase.table('registros').select('encargado').eq('imei', str(imei).strip()).execute())
                nombre_enc = reg.data[0].get('encargado') if reg and reg.data else None
                if nombre_enc:
                    enc = self.obtener_encargado(nombre_enc)
                    if enc:
                        foto_cc_raw = enc.get('foto_cc', '')
                        foto_cc = self._resolver_ruta_archivo(foto_cc_raw)
                        if foto_cc and os.path.exists(foto_cc):
                            ext_cc = os.path.splitext(foto_cc)[1].lower()
                            files_imp = self._get_files_imp_dir()
                            if ext_cc == '.pdf':
                                ruta_cc = os.path.join(files_imp, f"{imei}_cc_identidad.pdf")
                                shutil.copy2(foto_cc, ruta_cc)
                            else:
                                # Convertir imagen a PDF
                                img = PILImage.open(foto_cc).convert("RGB")
                                img_w, img_h = img.size
                                page_w, page_h = letter
                                scale = min(page_w / img_w, page_h / img_h) * 0.95
                                draw_w, draw_h = img_w * scale, img_h * scale
                                x = (page_w - draw_w) / 2
                                y = (page_h - draw_h) / 2
                                ruta_cc = os.path.join(files_imp, f"{imei}_cc_identidad.pdf")
                                c = pdf_canvas.Canvas(ruta_cc, pagesize=letter)
                                c.drawImage(foto_cc, x, y, width=draw_w, height=draw_h)
                                c.save()
            except Exception as e_cc:
                print(f"⚠️ No se pudo obtener la CC del encargado: {e_cc}")

            if ruta_cc and os.path.exists(ruta_cc):
                archivos.append(ruta_cc)
            else:
                print(f"ℹ️ CC del encargado no disponible, se omite del PDF de desbloqueo ETB.")

            if faltantes:
                return {"status": "error", "mensaje": f"Faltan archivos: {', '.join(faltantes)}"}

            writer = PdfWriter()
            for path in archivos:
                for page in PdfReader(path).pages:
                    writer.add_page(page)

            descargas = os.path.join(os.path.expanduser("~"), "Downloads")
            os.makedirs(descargas, exist_ok=True)
            output = os.path.join(descargas, f"{imei}desbloqueo.pdf")
            with open(output, "wb") as f:
                writer.write(f)

            from datetime import datetime
            fecha_gen = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            try:
                safe_supabase(lambda: supabase.table('registros').update({
                    'ruta_declaracion_generada': output,
                    'fecha_declaracion_generada': fecha_gen
                }).eq('imei', str(imei).strip()).execute())
            except Exception as e_up:
                print(f"⚠️ Error actualizando declaración ETB en registros: {e_up}")

            abrir_archivo(output)
            return {
                "status": "success",
                "ruta": output,
                "fecha": fecha_gen,
                "mensaje": f"PDF guardado en Descargas: {imei}desbloqueo.pdf"
            }
        except ImportError:
            return {"status": "error", "mensaje": "Instala pypdf: pip install pypdf"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def guardar_archivo_imp(self, ruta_origen: str) -> dict:
        """Copia cualquier archivo (png/pdf/jpg/etc.) a FilesIMP/."""
        try:
            import shutil
            if not ruta_origen or not os.path.exists(ruta_origen):
                return {"status": "error", "mensaje": "Archivo no encontrado."}
            dest_dir = self._get_files_imp_dir()
            nombre = os.path.basename(ruta_origen)
            dest = os.path.join(dest_dir, nombre)
            base, ext = os.path.splitext(nombre)
            counter = 1
            while os.path.exists(dest):
                dest = os.path.join(dest_dir, f"{base}_{counter}{ext}")
                counter += 1
            shutil.copy2(ruta_origen, dest)
            return {"status": "success", "ruta": dest, "mensaje": "Archivo guardado en FilesIMP"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    # ── DECLARACIÓN WOM ────────────────────────────────────────────

    def generar_declaracion_wom(self, imei: str) -> dict:
        """Llena el template DeclaraciónWom.pdf con los datos del IMEI y encargado."""
        try:
            from pypdf import PdfReader, PdfWriter, Transformation
            from datetime import datetime
            import copy

            import unicodedata
            res = safe_supabase(lambda: supabase.table('registros').select('*').eq('imei', str(imei).strip()).execute())
            reg = None
            if res and res.data:
                reg = res.data[0]
            else:
                res_fast = safe_supabase(lambda: supabase.table('FastReg').select('*').eq('IMEI', str(imei).strip()).execute())
                if res_fast and res_fast.data:
                    f_data = res_fast.data[0]
                    reg = {
                        'imei': f_data.get('IMEI'),
                        'modelo': f_data.get('MODELO'),
                        'encargado': f_data.get('encargado') or f_data.get('ENCARGADO'),
                        'linea': f_data.get('LÍNEA') or f_data.get('LINEA') or f_data.get('linea'),
                        'cliente': f_data.get('CLIENTE'),
                        'operador': f_data.get('OPERADOR')
                    }

            if not reg:
                return {"status": "error", "mensaje": "IMEI no encontrado en la base de datos."}

            enc_nombre = reg.get('encargado', '')
            if not enc_nombre and reg.get('linea'):
                try:
                    r_l = safe_supabase(lambda: supabase.table('lineas').select('encargado').eq('numero', str(reg.get('linea')).strip()).execute())
                    if r_l and r_l.data and r_l.data[0].get('encargado'):
                        enc_nombre = r_l.data[0]['encargado']
                except Exception:
                    pass

            enc = self.obtener_encargado(enc_nombre) if enc_nombre else None
            if not enc:
                return {"status": "error", "mensaje": "Sin encargado asignado. Asigna uno primero."}

            # — Diagnóstico firma —
            firma_path_raw = enc.get('declaracion_wom', '').strip()
            firma_path = self._resolver_ruta_archivo(firma_path_raw)
            print(f"[FIRMA] Encargado: '{enc.get('nombre')}' | declaracion_wom en BD: '{firma_path_raw}' -> resuelta: '{firma_path}'")

            files_dir = os.path.join(VIEWS_DIR, "Files")
            template_path = self._resolver_ruta_archivo("DeclaraciónWom.pdf")
            if not template_path:
                for name in [
                    "DeclaraciónWom.pdf", "DeclaracionWom.pdf",
                    "Declaración Wom.pdf", "declaracion_wom.pdf",
                    "DeclaraciónWOM.pdf"
                ]:
                    cand = self._resolver_ruta_archivo(name)
                    if cand and os.path.exists(cand):
                        template_path = cand
                        break

            if not template_path:
                return {"status": "error", "mensaje": "No se encontró 'DeclaraciónWom.pdf' en Views/Files/"}

            modelo       = (reg.get('modelo') or '').strip()
            mod_lower    = modelo.lower()

            if not modelo or mod_lower in ['error', 'error pro'] or mod_lower.startswith('error'):
                return {"status": "error", "mensaje": "No se puede generar la declaración WOM: El modelo del dispositivo es obligatorio y no puede ser 'Error' o 'Error Pro'."}

            if 'iphone' in mod_lower:
                marca = "Apple"
            else:
                partes_m = modelo.split()
                marca = partes_m[0] if len(partes_m) > 0 else modelo

            if marca.lower() in modelo.lower():
                marca_modelo = modelo
            else:
                marca_modelo = f"{marca} {modelo}"

            lineas       = [l.strip() for l in (enc.get('lineas_wom', '') or '').split(',') if l.strip()]
            primera_wom  = lineas[0] if lineas else ''
            fecha_hoy    = datetime.now().strftime("%d/%m/%Y")
            nombre_enc   = enc.get('nombre', '')
            id_enc       = enc.get('identificacion', '')
            lugar_exp    = enc.get('lugar_expedicion', '')
            direccion    = enc.get('direccion', '')

            campos = {
                "Nombres y Apellidos":             nombre_enc,
                "Documento ID":                    "CC",
                "Número de documento":             id_enc,
                "Lugar de expedición":             lugar_exp,
                "Marca de equipo":                 marca,
                "Modelo":                          modelo,
                "Números IMEIs":                   imei,
                "Firma_es_:signature":             "",
                "Nombre":                          nombre_enc,
                "Documento de identidad y número": f"CC {id_enc}",
                "Dirección":                       direccion,
                "Teléfono":                        primera_wom,
                "Ciudad":                          "Bogotá",
                "Fecha de la declaración":         fecha_hoy,
            }

            reader = PdfReader(template_path)
            writer = PdfWriter()
            writer.append(reader)

            import io
            from reportlab.pdfgen import canvas as pdf_canvas
            from reportlab.lib.pagesizes import letter
            from reportlab.pdfbase import pdfmetrics
            from reportlab.pdfbase.ttfonts import TTFont

            # Buscar/Registrar fuente Arial universal embebida
            font_name_wom = "Helvetica"
            font_path_arial = os.path.join(files_dir, "fonts", "Arial.ttf")
            if not os.path.exists(font_path_arial):
                for p in [
                    '/System/Library/Fonts/Supplemental/Arial.ttf',
                    '/Library/Fonts/Arial.ttf',
                    '/System/Library/Fonts/Arial.ttf',
                    r'C:\Windows\Fonts\arial.ttf',
                    r'C:\Windows\Fonts\Arial.ttf',
                ]:
                    if os.path.exists(p):
                        font_path_arial = p
                        break

            if os.path.exists(font_path_arial):
                try:
                    pdfmetrics.registerFont(TTFont('Arial', font_path_arial))
                    font_name_wom = 'Arial'
                except Exception as fe:
                    print(f"[PDF WOM] Error al registrar Arial: {fe}")

            packet = io.BytesIO()
            can = pdf_canvas.Canvas(packet, pagesize=letter)
            can.setFont(font_name_wom, 9.5)

            # Renderizar TODOS los campos del documento usando la fuente Arial embebida (tildes universales en Android/Windows/Mac)
            overlay_coords = [
                (109.2, 658.5, nombre_enc),
                (408.24, 658.5, "CC"),
                (85.08, 645.0, id_enc),
                (300.24, 645.0, lugar_exp),
                (85.08, 591.5, marca),
                (280.08, 591.5, modelo),
                (156.96, 578.0, imei),
                (85.0, 510.0, marca_modelo),
                (135.6, 321.0, nombre_enc),
                (274.68, 293.0, f"CC {id_enc}"),
                (139.26, 260.5, direccion),
                (135.36, 230.5, primera_wom),
                (126.24, 198.5, "Bogotá"),
                (214.20, 171.0, fecha_hoy),
            ]

            for x_pos, y_pos, val_txt in overlay_coords:
                if val_txt:
                    can.drawString(x_pos, y_pos, str(val_txt))

            # — Insertar firma imagen en el canvas de reportlab —
            es_imagen = False
            dst_x, dst_y, dst_w, dst_h = 87.1, 360.0, 203.6, 60.0
            if firma_path and os.path.isfile(firma_path):
                ext_firma = os.path.splitext(firma_path)[1].lower()
                if ext_firma in ('.png', '.jpg', '.jpeg', '.webp', '.PNG', '.JPG', '.JPEG'):
                    ext_firma = ext_firma.lower()
                if ext_firma in ('.png', '.jpg', '.jpeg', '.webp'):
                    try:
                        can.drawImage(firma_path, dst_x, dst_y, width=dst_w, height=dst_h,
                                      preserveAspectRatio=True, mask='auto')
                        es_imagen = True
                        print(f"[FIRMA] ✅ Imagen insertada en overlay: {firma_path}")
                    except Exception as fe:
                        print(f"[FIRMA] ⚠️ No se pudo insertar imagen de firma: {fe}")

            can.save()
            packet.seek(0)
            overlay_pdf = PdfReader(packet)
            writer.pages[0].merge_page(overlay_pdf.pages[0])

            # — Insertar firma PDF si no era imagen —
            if firma_path and os.path.isfile(firma_path) and not es_imagen:
                ext_firma = os.path.splitext(firma_path)[1].lower()
                if ext_firma == '.pdf':
                    try:
                        firma_reader = PdfReader(firma_path)
                        if len(firma_reader.pages) > 0:
                            firma_pg     = firma_reader.pages[0]
                            firma_w      = float(firma_pg.mediabox.width)
                            firma_h      = float(firma_pg.mediabox.height)
                            scale = min(dst_w / firma_w, dst_h / firma_h)
                            tx = dst_x + (dst_w - firma_w * scale) / 2
                            ty = dst_y
                            firma_copy = copy.deepcopy(firma_pg)
                            firma_copy.add_transformation(Transformation().scale(scale, scale).translate(tx, ty))
                            firma_copy.mediabox = copy.deepcopy(writer.pages[0].mediabox)
                            writer.pages[0].merge_page(firma_copy)
                            print(f"[FIRMA] ✅ PDF de firma insertado: {firma_path}")
                        else:
                            print(f"[FIRMA] ⚠️ Archivo PDF de firma sin páginas: {firma_path}")
                    except Exception as fe:
                        print(f"[FIRMA] ⚠️ No se pudo insertar PDF de firma: {fe}")
            elif not firma_path:
                print("[FIRMA] ⚠️ Sin firma para este encargado — declaración generada sin firma.")

            out_dir = os.path.join(files_dir, "declaraciones_generadas")
            os.makedirs(out_dir, exist_ok=True)
            output_path = os.path.join(out_dir, f"Declaracion_unico_usuario_{imei}.pdf")
            with open(output_path, "wb") as f:
                writer.write(f)

            fecha_gen = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            supabase.table('registros').update({
                'ruta_declaracion_generada': output_path,
                'fecha_declaracion_generada': fecha_gen
            }).eq('imei', imei).execute()

            abrir_archivo(output_path)
            return {
                "status": "success",
                "ruta": output_path,
                "fecha": fecha_gen,
                "mensaje": "Declaración WOM generada ✓"
            }
        except ImportError:
            return {"status": "error", "mensaje": "Instala pypdf: pip install pypdf"}
        except Exception as e:
            return {"status": "error", "mensaje": f"Error al generar PDF: {str(e)}"}


    # ── SCRAPER / IMEI ─────────────────────────────────────────────

    def actualizar_imei(self, imei, headless: bool = False):
        try:
            scraper = ScraperEstado(headless=headless)
            estado, operador = scraper.consultar(imei)
            scraper.close()

            old_reg = None
            try:
                old_res = supabase.table('registros').select('*').eq('imei', imei).execute()
                if old_res.data:
                    old_reg = old_res.data[0]
            except Exception as he:
                print(f"⚠️ [Hook] Error fetching old record in actualizar_imei: {he}")

            try:
                supabase.table('registros').update({
                    'estado': estado,
                    'operador': operador
                }).eq('imei', imei).execute()
            except Exception as ue:
                err_str = str(ue)
                print(f"⚠️ [Hook] Advertencia al actualizar BD en actualizar_imei: {err_str}")
                if "schema \"net\" does not exist" in err_str or "3F000" in err_str:
                    print("💡 [Trigger BD] Nota: El trigger trigger_cambio_estado en Supabase requiere la extensión pg_net o manejar EXCEPTION.")
                    return {
                        "status": "success",
                        "estado": estado,
                        "operador": operador,
                        "advertencia": "Estado consultado exitosamente. Nota: El trigger de BD requiere habilitar pg_net en Supabase."
                    }
                raise ue

            try:
                new_res = supabase.table('registros').select('*').eq('imei', imei).execute()
                new_reg = new_res.data[0] if new_res.data else None
                if old_reg and new_reg:
                    self._crear_notificacion_si_cambia_a_exitoso(imei, old_reg, new_reg)
            except Exception as he:
                print(f"⚠️ [Hook] Error checking transition in actualizar_imei: {he}")

            return {"status": "success", "estado": estado, "operador": operador}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def pantallazo_imei(self, imei, headless: bool = False, info: dict = None):
        try:
            home_dir = os.path.expanduser("~")
            app_dir  = os.path.join(home_dir, "IMEIManagerData")
            ruta     = os.path.join(app_dir, f"{imei}.png")
            scraper  = ScraperPantallazo(headless=headless)
            scraper.consultar_y_capturar(imei, ruta)
            scraper.close()
            
            if os.path.exists(ruta):
                from PIL import Image, ImageDraw, ImageFont
                img = Image.open(ruta)
                width, height = img.size
                
                # Recorte del 60% inferior, dejando el 40% superior
                cropped = img.crop((0, 0, width, int(height * 0.40)))
                
                text_height = 140
                new_img = Image.new("RGB", (width, cropped.height + text_height), "#1a1b26")
                new_img.paste(cropped, (0, 0))
                
                draw = ImageDraw.Draw(new_img)
                font_large, font_normal = _load_system_font(36, 28)
                
                info = info or {}
                modelo = info.get("modelo", "N/A") or "N/A"
                estado = info.get("estado", "N/A") or "N/A"
                operador = info.get("operador", "") or ""
                
                # Draw text layout
                draw.text((40, cropped.height + 25), f"IMEI: {imei}", font=font_large, fill="#7aa2f7")
                draw.text((40, cropped.height + 80), f"Modelo: {modelo}", font=font_normal, fill="#a9b1d6")
                
                estado_color = "#f7768e"
                if str(estado).lower() in ["limpio", "disponible", "sin reporte"]:
                    estado_color = "#9ece6a"
                
                draw.text((width // 2, cropped.height + 25), f"Estado: {estado}", font=font_large, fill=estado_color)
                if operador:
                    draw.text((width // 2, cropped.height + 80), f"Operador: {operador}", font=font_normal, fill="#bb9af7")
                
                new_img.save(ruta)

            if not _copiar_imagen_portapapeles(ruta):
                return {"status": "error", "mensaje": "No se pudo copiar la imagen al portapapeles en este sistema."}
            if os.path.exists(ruta):
                os.remove(ruta)
            return {"status": "success", "mensaje": "ScreenShot copiado al portapapeles"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def limpiar_temporales(self):
        try:
            eliminados = limpiar_archivos_desechables(dias=1)
            return {"status": "success", "eliminados": eliminados, "mensaje": f"Limpieza completada: {eliminados} archivos desechables eliminados."}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    # ── PAPELERA ───────────────────────────────────────────────────

    def obtener_papelera(self):
        try:
            res = safe_supabase(lambda: supabase.table('papelera').select('*').order('fecha_borrado', desc=True).execute())
            data = res.data if res and res.data else []
            if not self._es_admin():
                hidden_ids, hidden_names = self._get_hidden_client_identifiers()
                data = [r for r in data if not self._is_hidden_client(r.get('cliente'), hidden_ids, hidden_names)]
            return data
        except Exception as e:
            print(f"❌ [API] Error en obtener_papelera: {e}")
            return []

    def eliminar_registro(self, imei):
        try:
            res = supabase.table('registros').select('*').eq('imei', imei).execute()
            if not res.data:
                return {"status": "error", "mensaje": "Registro no encontrado."}
            registro = res.data[0]
            papelera_data = {
                'imei':                      registro['imei'],
                'modelo':                    registro.get('modelo') or '',
                'estado':                    registro.get('estado') or '',
                'operador':                  registro.get('operador') or '',
                'cliente':                   registro.get('cliente') or '',
                'razon':                     registro.get('razon') or '',
                'encargado':                 registro.get('encargado') or '',
                'pago':                      registro.get('pago') or '',
                'pin_desbloqueo':            registro.get('pin_desbloqueo') or '',
                'reg_wom':                   registro.get('reg_wom') or 'No',
                'reg_etb':                   registro.get('reg_etb') or 'No',
                'foto_dispositivo':          registro.get('foto_dispositivo') or '',
                'ruta_declaracion_generada': registro.get('ruta_declaracion_generada') or '',
                'fecha_declaracion_generada': registro.get('fecha_declaracion_generada') or '',
                'linea':                     registro.get('linea') or ''
            }
            supabase.table('papelera').upsert(papelera_data).execute()
            supabase.table('registros').delete().eq('imei', imei).execute()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def restaurar_registro(self, imei):
        try:
            res = supabase.table('papelera').select('*').eq('imei', imei).execute()
            if not res.data:
                return {"status": "error", "mensaje": "Registro no encontrado en papelera."}
            papelera_item = res.data[0]
            registro_data = {
                'imei':                      papelera_item['imei'],
                'modelo':                    papelera_item.get('modelo') or '',
                'estado':                    papelera_item.get('estado') or '',
                'operador':                  papelera_item.get('operador') or '',
                'cliente':                   papelera_item.get('cliente') or '',
                'razon':                     papelera_item.get('razon') or '',
                'encargado':                 papelera_item.get('encargado') or '',
                'pago':                      papelera_item.get('pago') or '',
                'pin_desbloqueo':            papelera_item.get('pin_desbloqueo') or '',
                'reg_wom':                   papelera_item.get('reg_wom') or 'No',
                'reg_etb':                   papelera_item.get('reg_etb') or 'No',
                'foto_dispositivo':          papelera_item.get('foto_dispositivo') or '',
                'ruta_declaracion_generada': papelera_item.get('ruta_declaracion_generada') or '',
                'fecha_declaracion_generada': papelera_item.get('fecha_declaracion_generada') or '',
                'linea':                     papelera_item.get('linea') or ''
            }
            supabase.table('registros').upsert(registro_data).execute()
            supabase.table('papelera').delete().eq('imei', imei).execute()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}
        try:
            res = supabase.table('papelera').select('*').eq('imei', imei).execute()
            if not res.data:
                return {"status": "error", "mensaje": "Registro no encontrado en papelera."}
            papelera_item = res.data[0]
            registro_data = {
                'imei':                    papelera_item['imei'],
                'modelo':                  papelera_item.get('modelo', ''),
                'estado':                  papelera_item.get('estado', ''),
                'operador':                papelera_item.get('operador', ''),
                'cliente':                 papelera_item.get('cliente', ''),
                'razon':                   papelera_item.get('razon', ''),
                'encargado':               papelera_item.get('encargado', ''),
                'pago':                    papelera_item.get('pago', ''),
                'pin_desbloqueo':          papelera_item.get('pin_desbloqueo', ''),
                'reg_wom':                 papelera_item.get('reg_wom', 'No'),
                'reg_etb':                 papelera_item.get('reg_etb', 'No'),
                'foto_dispositivo':        papelera_item.get('foto_dispositivo', ''),
                'ruta_declaracion_generada': papelera_item.get('ruta_declaracion_generada', ''),
                'fecha_declaracion_generada': papelera_item.get('fecha_declaracion_generada', ''),
                'linea':                   papelera_item.get('linea', '')
            }
            supabase.table('registros').upsert(registro_data).execute()
            supabase.table('papelera').delete().eq('imei', imei).execute()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def borrar_permanente(self, imei):
        try:
            supabase.table('papelera').delete().eq('imei', imei).execute()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def vaciar_papelera(self):
        try:
            res = supabase.table('papelera').select('imei').execute()
            if res.data:
                for item in res.data:
                    supabase.table('papelera').delete().eq('imei', item['imei']).execute()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    # ── MODELOS ────────────────────────────────────────────────────

    def consultar_modelos(self, imeis, headless: bool = False):
        import json as _json
        for imei in imeis:
            self.actualizar_campo(imei, 'modelo', 'Consultando...')
        ruta_script = script_path("ConsultarModelo.py")
        def _bg():
            try:
                cmd = [sys.executable, ruta_script] + [str(i) for i in imeis]
                if headless:
                    cmd.append("--headless")
                proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
                for line in proc.stdout:
                    line = line.strip()
                    if not line: continue
                    try:
                        data = _json.loads(line)
                        imei_r = data.get("imei", "")
                        modelo = data.get("modelo", "")
                        if imei_r and modelo:
                            self.actualizar_campo(
                                imei_r, 'modelo',
                                modelo if not modelo.startswith("Error") else 'Error'
                            )
                    except _json.JSONDecodeError:
                        pass
                proc.wait()
            except Exception:
                pass
        threading.Thread(target=_bg, daemon=True).start()
        return {"status": "success", "mensaje": "Consulta iniciada en segundo plano"}

    def consultar_modelo_solo(self, imei):
        try:
            import json as _json
            ruta_script = script_path("ConsultarModelo.py")
            cmd = [sys.executable, ruta_script, str(imei), "--headless"]
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            stdout, _ = proc.communicate()
            for line in stdout.splitlines():
                if line.startswith('{'):
                    data = _json.loads(line)
                    if data.get("modelo"):
                        return {"status": "success", "modelo": data["modelo"]}
            return {"status": "error", "mensaje": "Modelo no encontrado"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def consultar_blacklist(self, imei, con_pantallazo=False):
        """
        Ejecuta blacklist.py como subprocess (iunlocker.com GSMA Blacklist).
        Guarda el estado en Supabase columna 'blacklist' ("Blacklist" | "clean").
        Retorna {status, en_blacklist, mensaje, screenshot_path, fuente}
        """
        import json as _json
        try:
            ruta_script = script_path("blacklist.py")
            if not os.path.exists(ruta_script):
                return {"status": "error", "mensaje": "Script blacklist.py no encontrado."}

            cmd = [sys.executable, ruta_script, str(imei)]
            if con_pantallazo:
                cmd.append("--screenshot")

            proc = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                encoding="utf-8"
            )
            try:
                stdout, _ = proc.communicate(timeout=90)
            except subprocess.TimeoutExpired:
                proc.kill()
                return {"status": "error", "mensaje": "Tiempo de espera agotado (90s)."}

            # Parsear última línea JSON válida
            data = None
            for line in reversed(stdout.splitlines()):
                line = line.strip()
                if line.startswith("{"):
                    try:
                        data = _json.loads(line)
                        break
                    except Exception:
                        continue

            if not data:
                return {"status": "error", "mensaje": "Sin respuesta válida del script blacklist."}

            if data.get("status") == "success":
                valor_bd = data.get("valor_bd", "clean")  # "Blacklist" o "clean"
                # Guardar en Supabase
                try:
                    supabase.table('registros').update({'blacklist': valor_bd}).eq('imei', str(imei)).execute()
                    print(f"✅ [Blacklist] IMEI {imei} → blacklist={valor_bd} guardado en Supabase.")
                except Exception as se:
                    print(f"⚠️ [Blacklist] Error al guardar en Supabase: {se}")

            return data

        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def obtener_estado_cupos_blacklist(self):
        """
        Lee el estado actual de cupos de blacklist.py (sin hacer consulta).
        Retorna {status, consultas_restantes, limite, bloqueado, horas, minutos}
        """
        import json as _json
        try:
            ruta_script = script_path("blacklist.py")
            if not os.path.exists(ruta_script):
                return self._leer_estado_cupos_blacklist_directo()

            cmd = [sys.executable, ruta_script, "--estado"]
            proc = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                encoding="utf-8"
            )
            stdout, _ = proc.communicate(timeout=10)

            for line in reversed(stdout.splitlines()):
                line = line.strip()
                if line.startswith("{"):
                    return _json.loads(line)

            return self._leer_estado_cupos_blacklist_directo()
        except Exception as e:
            return {"status": "error", "mensaje": str(e), "consultas_restantes": 0}

    def _leer_estado_cupos_blacklist_directo(self):
        """Fallback: lee el JSON de estado directamente sin invocar el script."""
        import json as _json
        from datetime import datetime, timedelta

        LIMITE = 5
        HORAS_RESET = 24
        archivo = os.path.join(os.path.expanduser("~"), "IMEIManagerData", "estado_blacklist.json")

        try:
            if os.path.exists(archivo):
                with open(archivo, "r") as f:
                    estado = _json.load(f)
            else:
                estado = {
                    "consultas_restantes": LIMITE,
                    "bloqueado_hasta": None,
                    "ultimo_reset": datetime.now().isoformat()
                }

            ahora = datetime.now()

            # Asegurar claves
            if "consultas_restantes" not in estado:
                estado["consultas_restantes"] = LIMITE
            if "ultimo_reset" not in estado:
                estado["ultimo_reset"] = ahora.isoformat()

            # Verificar reset por tiempo
            if estado.get("ultimo_reset"):
                ultimo_reset = datetime.fromisoformat(estado["ultimo_reset"])
                if ahora >= ultimo_reset + timedelta(hours=HORAS_RESET):
                    estado["consultas_restantes"] = LIMITE
                    estado["bloqueado_hasta"] = None
                    estado["ultimo_reset"] = ahora.isoformat()
                    with open(archivo, "w") as f:
                        _json.dump(estado, f)

            # Calcular tiempo restante
            ultimo_reset = datetime.fromisoformat(estado.get("ultimo_reset", ahora.isoformat()))
            proximo_reset = ultimo_reset + timedelta(hours=HORAS_RESET)
            diferencia = proximo_reset - ahora
            horas = max(0, int(diferencia.total_seconds()) // 3600)
            minutos = max(0, (int(diferencia.total_seconds()) % 3600) // 60)

            restantes = estado.get("consultas_restantes", LIMITE)
            bloqueado = restantes <= 0 or estado.get("bloqueado_hasta") is not None

            return {
                "status": "success",
                "consultas_restantes": restantes,
                "limite": LIMITE,
                "bloqueado": bloqueado,
                "horas": horas,
                "minutos": minutos
            }
        except Exception as e:
            return {
                "status": "success",
                "consultas_restantes": LIMITE,
                "limite": LIMITE,
                "bloqueado": False,
                "horas": 0,
                "minutos": 0
            }

    # ── EXPORTAR EXCEL ─────────────────────────────────────────────

    def exportar_excel(self):
        from datetime import datetime
        try:
            descargas_dir = os.path.join(os.path.expanduser("~"), "Downloads")
            fecha_str     = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
            ruta_final    = os.path.join(descargas_dir, f"Respaldo_IMEI_{fecha_str}.xlsx")
            wb     = openpyxl.Workbook()
            ws_reg = wb.active
            ws_reg.title = "Registros"
            ws_reg.append([
                "IMEI", "Modelo", "Estado", "Operador", "Cliente",
                "Razon", "Encargado", "Pago", "PIN Desbloqueo", "Reg WOM", "Reg ETB"
            ])
            for reg in self.obtener_registros():
                ws_reg.append([reg.get(k, '') for k in [
                    'imei', 'modelo', 'estado', 'operador', 'cliente',
                    'razon', 'encargado', 'pago', 'pin_desbloqueo', 'reg_wom', 'reg_etb'
                ]])
            ws_enc = wb.create_sheet(title="Encargados")
            ws_enc.append([
                "Nombre", "Identificacion", "Lugar Expedicion", "Fecha Expedicion",
                "Direccion", "Lineas WOM", "Lineas ETB", "Correo", "Mensaje", "Color"
            ])
            for enc in self.obtener_todos_encargados():
                ws_enc.append([enc.get(k, '') for k in [
                    'nombre', 'identificacion', 'lugar_expedicion', 'fecha_expedicion',
                    'direccion', 'lineas_wom', 'lineas_etb', 'correo', 'mensaje', 'color'
                ]])
            wb.save(ruta_final)
            return {"status": "success", "mensaje": "¡Guardado en Descargas!"}
        except Exception as e:
            return {"status": "error", "mensaje": f"Error al exportar: {str(e)}"}

    # ── TEMA ───────────────────────────────────────────────────────

    def cambiar_tema(self, modo):
        try:
            set_dock_icon(modo)
        except Exception:
            pass
        return {"status": "success"}

    # ── CLIENTES & RBAC ─────────────────────────────────────────────

    def _es_admin(self):
        """Devuelve True si el usuario actual tiene rol 'admin'."""
        return bool(self.current_user and self.current_user.get('rol') == 'admin')

    def _get_hidden_client_identifiers(self):
        """Devuelve (set_ids, set_nombres) de clientes ocultos. Incluye siempre 420 y 512."""
        hidden_ids = {'420', '512'}
        hidden_names = set()
        try:
            res = safe_supabase(lambda: supabase.table('clientes').select('id, nombre, oculto').execute())
            if res and res.data:
                for c in res.data:
                    cid = str(c.get('id', '')).strip()
                    cnom = str(c.get('nombre', '')).strip().lower()
                    if c.get('oculto') is True or cid in hidden_ids:
                        if cid:
                            hidden_ids.add(cid)
                        if cnom:
                            hidden_names.add(cnom)
        except Exception as e:
            print(f"⚠️ [RBAC] Error obteniendo clientes ocultos: {e}")
        return hidden_ids, hidden_names

    def _is_hidden_client(self, cliente_val, hidden_ids, hidden_names):
        """Determina si un valor de cliente en registros o fastreg corresponde a un cliente oculto."""
        if not cliente_val:
            return False
        val_str = str(cliente_val).strip()
        val_lower = val_str.lower()

        # Coincidencia directa por ID
        if val_str in hidden_ids:
            return True

        # Coincidencia por nombre exacto
        if val_lower in hidden_names:
            return True

        # Coincidencia en cadenas compuestas tipo "Nombre (ID)" o "ID - Nombre"
        for hid in hidden_ids:
            if hid and (f"({hid})" in val_str or f" {hid}" in val_str or val_str.startswith(f"{hid} ") or val_str.startswith(f"{hid}-")):
                return True

        for hnom in hidden_names:
            if hnom and len(hnom) >= 3 and hnom in val_lower:
                return True

        return False

    def _get_hidden_lines(self):
        """Devuelve un set con los números de líneas marcadas como ocultas."""
        hidden_set = set()
        try:
            res = safe_supabase(lambda: supabase.table('configuracion').select('valor').eq('clave', 'hidden_lines').execute())
            if res and res.data and res.data[0].get('valor'):
                import json
                try:
                    loaded = json.loads(res.data[0]['valor'])
                    if isinstance(loaded, list):
                        hidden_set.update(str(x).strip() for x in loaded if x)
                except Exception:
                    pass
        except Exception:
            pass

        try:
            res_col = supabase.table('lineas').select('numero, oculto').eq('oculto', True).execute()
            if res_col and res_col.data:
                for row in res_col.data:
                    if row.get('numero'):
                        hidden_set.add(str(row['numero']).strip())
        except Exception:
            pass

        return hidden_set

    def _save_hidden_lines(self, line_set):
        """Persiste el conjunto de líneas ocultas en configuracion y opcionalmente en columna oculto."""
        import json
        list_to_save = sorted(list(line_set))
        try:
            safe_supabase(lambda: supabase.table('configuracion').upsert({
                'clave': 'hidden_lines',
                'valor': json.dumps(list_to_save)
            }).execute())
        except Exception as e:
            print(f"⚠️ [Lineas Ocultas] Error guardando en configuracion: {e}")

        try:
            # Si la columna oculto existe, sincronizar
            for num in list_to_save:
                try:
                    supabase.table('lineas').update({'oculto': True}).eq('numero', str(num).strip()).execute()
                except Exception:
                    pass
        except Exception:
            pass

    def guardar_cliente(self, datos):
        try:
            data = {
                'id':         str(datos['id']).strip(),
                'nombre':     datos['nombre'].strip(),
                'tipo_id':    datos.get('tipo_id', 'CC'),
                'celular':    datos.get('celular', ''),
                'email':      datos.get('email', ''),
                'expedicion': datos.get('expedicion', '')
            }
            if 'oculto' in datos and self._es_admin():
                data['oculto'] = bool(datos['oculto'])
            supabase.table('clientes').upsert(data).execute()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def verificar_id_cliente(self, id_cliente):
        try:
            id_str = str(id_cliente).strip()
            if not self._es_admin():
                hidden_ids, _ = self._get_hidden_client_identifiers()
                if id_str in hidden_ids:
                    return {"status": "available"}

            res = supabase.table('clientes').select('nombre, oculto').eq('id', id_str).execute()
            if res.data:
                if not self._es_admin() and res.data[0].get('oculto') is True:
                    return {"status": "available"}
                return {"status": "exists", "nombre": res.data[0]['nombre']}
            return {"status": "available"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def buscar_cliente(self, query):
        """Busca clientes. Los no-admin solo ven clientes públicos."""
        try:
            q = supabase.table('clientes').select('*').or_(
                f"nombre.ilike.%{query}%,id.ilike.%{query}%"
            )
            res = q.limit(10).execute()
            clientes = res.data if res and res.data else []
            if not self._es_admin():
                hidden_ids, hidden_names = self._get_hidden_client_identifiers()
                clientes = [
                    c for c in clientes
                    if not (c.get('oculto') is True or str(c.get('id', '')).strip() in hidden_ids or (c.get('nombre') or '').strip().lower() in hidden_names)
                ]
            return {"status": "success", "clientes": clientes[:5]}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def obtener_todos_clientes(self):
        """Devuelve todos los clientes públicos. Los no-admin no ven los ocultos."""
        try:
            res = safe_supabase(lambda: supabase.table('clientes').select('*').order('nombre').execute())
            clientes = res.data if res and res.data else []
            if not self._es_admin():
                hidden_ids, hidden_names = self._get_hidden_client_identifiers()
                clientes = [
                    c for c in clientes
                    if not (c.get('oculto') is True or str(c.get('id', '')).strip() in hidden_ids or (c.get('nombre') or '').strip().lower() in hidden_names)
                ]
            return clientes
        except Exception as e:
            print(f"Error en obtener_todos_clientes: {e}")
            return []

    # ── CLIENTES OCULTOS (solo admin) ───────────────────────────────

    def obtener_clientes_ocultos(self):
        """Devuelve la lista completa de clientes marcados como ocultos. Solo admin."""
        if not self._es_admin():
            return {"status": "error", "mensaje": "Acceso denegado. Solo el administrador."}
        try:
            hidden_ids, _ = self._get_hidden_client_identifiers()
            res = safe_supabase(lambda: supabase.table('clientes').select('*').order('nombre').execute())
            todos = res.data if res and res.data else []
            ocultos = [
                c for c in todos
                if c.get('oculto') is True or str(c.get('id', '')).strip() in hidden_ids
            ]
            return {"status": "success", "clientes": ocultos}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def toggle_cliente_oculto(self, id_cliente, oculto):
        """Cambia el flag oculto de un cliente. Solo admin."""
        if not self._es_admin():
            return {"status": "error", "mensaje": "Acceso denegado. Solo el administrador."}
        try:
            id_str = str(id_cliente).strip()
            supabase.table('clientes').update({'oculto': bool(oculto)}).eq('id', id_str).execute()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def editar_cliente_oculto(self, datos):
        """Edita los datos de un cliente oculto. Solo admin."""
        if not self._es_admin():
            return {"status": "error", "mensaje": "Acceso denegado. Solo el administrador."}
        try:
            id_str = str(datos.get('id')).strip()
            if not id_str:
                return {"status": "error", "mensaje": "ID requerido"}
            data = {
                'nombre':     datos.get('nombre', '').strip(),
                'tipo_id':    datos.get('tipo_id', 'CC'),
                'celular':    datos.get('celular', ''),
                'email':      datos.get('email', ''),
                'expedicion': datos.get('expedicion', ''),
                'oculto':     True
            }
            supabase.table('clientes').update(data).eq('id', id_str).execute()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def eliminar_cliente_oculto(self, id_cliente):
        """Elimina permanentemente un cliente oculto. Solo admin."""
        if not self._es_admin():
            return {"status": "error", "mensaje": "Acceso denegado. Solo el administrador."}
        try:
            supabase.table('clientes').delete().eq('id', str(id_cliente).strip()).execute()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def crear_cliente_oculto(self, datos):
        """Crea un cliente nuevo directamente con oculto=True. Solo admin."""
        if not self._es_admin():
            return {"status": "error", "mensaje": "Acceso denegado. Solo el administrador."}
        try:
            data = {
                'id':         str(datos['id']).strip(),
                'nombre':     datos['nombre'].strip(),
                'tipo_id':    datos.get('tipo_id', 'CC'),
                'celular':    datos.get('celular', ''),
                'email':      datos.get('email', ''),
                'expedicion': datos.get('expedicion', ''),
                'oculto':     True
            }
            supabase.table('clientes').upsert(data).execute()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    # ── LÍNEAS ─────────────────────────────────────────────────────

    def obtener_lineas(self):
        """Devuelve las líneas públicas. Si no es admin, oculta las líneas ocultas."""
        try:
            respuesta = safe_supabase(lambda: supabase.table('lineas').select('*').execute())
            lineas = respuesta.data if respuesta and respuesta.data else []
            if not self._es_admin():
                hidden_lines = self._get_hidden_lines()
                lineas = [
                    l for l in lineas
                    if str(l.get('numero', '')).strip() not in hidden_lines and l.get('oculto') is not True
                ]
            return {"status": "success", "lineas": lineas}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def guardar_linea(self, datos):
        try:
            data = {
                "numero":        str(datos['numero']).strip(),
                "operador":      datos['operador'],
                "estado":        datos.get('estado') or datos.get('tipo') or 'Disponible',
                "imei_vinculado": datos.get('imei_vinculado', ''),
                "encargado":     datos.get('encargado', '')
            }
            safe_supabase(lambda: supabase.table('lineas').upsert(data).execute())
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def eliminar_linea(self, numero):
        try:
            num_str = str(numero).strip()
            safe_supabase(lambda: supabase.table('lineas').delete().eq('numero', num_str).execute())
            hidden = self._get_hidden_lines()
            if num_str in hidden:
                hidden.remove(num_str)
                self._save_hidden_lines(hidden)
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    # ── LÍNEAS OCULTAS (solo admin) ─────────────────────────────────

    def obtener_lineas_ocultas(self):
        """Devuelve la lista completa de líneas marcadas como ocultas. Solo admin."""
        if not self._es_admin():
            return {"status": "error", "mensaje": "Acceso denegado. Solo el administrador."}
        try:
            hidden_set = self._get_hidden_lines()
            res = safe_supabase(lambda: supabase.table('lineas').select('*').execute())
            lineas = res.data if res and res.data else []
            ocultas = [
                l for l in lineas
                if str(l.get('numero', '')).strip() in hidden_set or l.get('oculto') is True
            ]
            return {"status": "success", "lineas": ocultas}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def toggle_linea_oculta(self, numero, oculto):
        """Oculta o desoculta una línea. Solo admin."""
        if not self._es_admin():
            return {"status": "error", "mensaje": "Acceso denegado. Solo el administrador."}
        try:
            num_str = str(numero).strip()
            hidden = self._get_hidden_lines()
            if oculto:
                hidden.add(num_str)
            else:
                hidden.discard(num_str)
            self._save_hidden_lines(hidden)

            # Intentar actualizar columna oculto si existe
            try:
                supabase.table('lineas').update({'oculto': bool(oculto)}).eq('numero', num_str).execute()
            except Exception:
                pass

            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def crear_linea_oculta(self, datos):
        """Crea una nueva línea y la agrega inmediatamente a líneas ocultas. Solo admin."""
        if not self._es_admin():
            return {"status": "error", "mensaje": "Acceso denegado. Solo el administrador."}
        try:
            num_str = str(datos['numero']).strip()
            data = {
                "numero":        num_str,
                "operador":      datos['operador'],
                "estado":        datos.get('estado') or 'Disponible',
                "imei_vinculado": datos.get('imei_vinculado', ''),
                "encargado":     datos.get('encargado', '')
            }
            safe_supabase(lambda: supabase.table('lineas').upsert(data).execute())
            hidden = self._get_hidden_lines()
            hidden.add(num_str)
            self._save_hidden_lines(hidden)
            try:
                supabase.table('lineas').update({'oculto': True}).eq('numero', num_str).execute()
            except Exception:
                pass
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def editar_linea_oculta(self, datos):
        """Edita los datos de una línea oculta. Solo admin."""
        if not self._es_admin():
            return {"status": "error", "mensaje": "Acceso denegado. Solo el administrador."}
        try:
            num_str = str(datos['numero']).strip()
            data = {
                "operador":      datos.get('operador', 'WOM'),
                "estado":        datos.get('estado', 'Disponible'),
                "imei_vinculado": datos.get('imei_vinculado', ''),
                "encargado":     datos.get('encargado', '')
            }
            safe_supabase(lambda: supabase.table('lineas').update(data).eq('numero', num_str).execute())
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def eliminar_linea_oculta(self, numero):
        """Elimina permanentemente una línea oculta. Solo admin."""
        if not self._es_admin():
            return {"status": "error", "mensaje": "Acceso denegado. Solo el administrador."}
        return self.eliminar_linea(numero)

    # ── TABLA DE REGISTROS (FASTREG) ────────────────────────────────
    
    def guardar_en_fastreg(self, datos):
        """Guarda o actualiza un registro directamente en FastReg con fallback seguro"""
        try:
            from datetime import datetime
            ahora_iso = datetime.now().astimezone().isoformat()
            
            imei = str(datos.get('imei') or datos.get('IMEI') or '').strip()
            if not imei:
                return {"status": "error", "mensaje": "IMEI requerido"}

            operador = datos.get('operador') or datos.get('OPERADOR') or 'WOM'
            linea_num = str(datos.get('linea') or datos.get('LÍNEA') or datos.get('LINEA') or '').strip()
            encargado_val = datos.get('encargado') or datos.get('ENCARGADO') or ''
            modelo_val = datos.get('modelo') or datos.get('MODELO') or ''
            cliente_val = datos.get('cliente') or datos.get('CLIENTE') or 'Anónimo'
            estado_val = datos.get('estado') or datos.get('ESTADO') or 'Registrado'
            razon_val = datos.get('razon') or datos.get('RAZÓN') or datos.get('RAZON') or f"Registro {operador}"
            pago_val = datos.get('pago') or datos.get('PAGO') or 'No'
            ingreso_val = datos.get('ingreso') or datos.get('INGRESO') or ahora_iso

            # Si no hay encargado, buscar en tabla lineas
            if not encargado_val and linea_num:
                try:
                    r_l = safe_supabase(lambda: supabase.table('lineas').select('encargado').eq('numero', linea_num).execute())
                    if r_l and r_l.data and r_l.data[0].get('encargado'):
                        encargado_val = r_l.data[0]['encargado']
                except Exception:
                    pass

            # Si no hay modelo o cliente, buscar en tabla registros
            if not modelo_val or not cliente_val or cliente_val == 'Anónimo':
                try:
                    r_reg = safe_supabase(lambda: supabase.table('registros').select('modelo, cliente, encargado').eq('imei', imei).execute())
                    if r_reg and r_reg.data:
                        if not modelo_val:
                            modelo_val = r_reg.data[0].get('modelo', '')
                        if not cliente_val or cliente_val == 'Anónimo':
                            cliente_val = r_reg.data[0].get('cliente', 'Anónimo')
                        if not encargado_val:
                            encargado_val = r_reg.data[0].get('encargado', '')
                except Exception:
                    pass

            fast_payload = {
                'IMEI': imei,
                'MODELO': modelo_val or '',
                'ESTADO': estado_val,
                'OPERADOR': operador,
                'CLIENTE': cliente_val or 'Anónimo',
                'PAGO': pago_val,
                'LÍNEA': linea_num,
                'encargado': encargado_val,
                'RAZÓN': razon_val,
                'INGRESO': ingreso_val
            }
            safe_supabase(lambda: supabase.table('FastReg').upsert(fast_payload).execute())
            print(f"✅ [FastReg] Guardado exitosamente para IMEI {imei} ({operador})")

            # Actualizar las_use en lineas
            if linea_num:
                try:
                    safe_supabase(lambda: supabase.table('lineas').update({'las_use': ahora_iso}).eq('numero', linea_num).execute())
                except Exception:
                    pass

            if self.window:
                self.window.evaluate_js("if (typeof window.recibirActualizacionFastReg === 'function') { window.recibirActualizacionFastReg(); }")

            return {"status": "success", "mensaje": "Guardado en FastReg correctamente", "data": fast_payload}
        except Exception as e:
            print(f"❌ [FastReg] Error al guardar_en_fastreg: {e}")
            return {"status": "error", "mensaje": str(e)}

    def obtener_fastreg(self):
        """Retorna todos los datos de la tabla FastReg para el Dashboard"""
        if self._is_db_locked():
            return {"status": "error", "mensaje": "Base de datos en descanso"}
        try:
            res = safe_supabase(lambda: supabase.table('FastReg').select('*').order('INGRESO', desc=True).execute())
            data = res.data if res and res.data else []
            if not self._es_admin():
                hidden_ids, hidden_names = self._get_hidden_client_identifiers()
                data = [r for r in data if not self._is_hidden_client(r.get('CLIENTE') or r.get('cliente'), hidden_ids, hidden_names)]
            return {"status": "success", "data": data}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def actualizar_campo_fastreg(self, imei, campo, valor):
        """Actualiza un campo específico en la tabla FastReg por IMEI"""
        try:
            safe_supabase(lambda: supabase.table('FastReg').update({campo: valor}).eq('IMEI', str(imei).strip()).execute())
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def eliminar_fastreg(self, imei):
        """Borra un registro de FastReg y lo manda a la papelera"""
        try:
            # 1. Leer de FastReg
            res = safe_supabase(lambda: supabase.table('FastReg').select('*').eq('IMEI', imei).execute())
            if not res or not res.data:
                return {"status": "error", "mensaje": "IMEI no encontrado en FastReg"}

            fast = res.data[0]

            # 2. Intentar enriquecer con datos completos de 'registros'
            reg_full = {}
            try:
                r2 = safe_supabase(lambda: supabase.table('registros').select('*').eq('imei', imei).execute())
                if r2 and r2.data:
                    reg_full = r2.data[0]
            except Exception:
                pass

            # 3. Construir payload con todos los campos que papelera necesita
            papelera_data = {
                'imei':                       imei,
                'modelo':                     fast.get('MODELO') or reg_full.get('modelo') or '',
                'estado':                     fast.get('ESTADO') or reg_full.get('estado') or '',
                'operador':                   fast.get('OPERADOR') or reg_full.get('operador') or '',
                'cliente':                    fast.get('CLIENTE') or reg_full.get('cliente') or '',
                'razon':                      fast.get('RAZÓN') or reg_full.get('razon') or 'Eliminado desde FastReg',
                'encargado':                  fast.get('encargado') or reg_full.get('encargado') or '',
                'pago':                       fast.get('PAGO') or reg_full.get('pago') or 'No',
                'linea':                      fast.get('LÍNEA') or reg_full.get('linea') or '',
                'pin_desbloqueo':             reg_full.get('pin_desbloqueo') or '',
                'reg_wom':                    reg_full.get('reg_wom') or 'No',
                'reg_etb':                    reg_full.get('reg_etb') or 'No',
                'foto_dispositivo':           reg_full.get('foto_dispositivo') or '',
                'ruta_declaracion_generada':  reg_full.get('ruta_declaracion_generada') or '',
                'fecha_declaracion_generada': reg_full.get('fecha_declaracion_generada') or '',
            }
            safe_supabase(lambda: supabase.table('papelera').upsert(papelera_data).execute())
            safe_supabase(lambda: supabase.table('FastReg').delete().eq('IMEI', imei).execute())
            print(f"🗑️  [FastReg] IMEI {imei} movido a papelera")
            return {"status": "success"}
        except Exception as e:
            print(f"❌ [FastReg] Error en eliminar_fastreg: {e}")
            return {"status": "error", "mensaje": str(e)}


    def procesar_fastreg(self, payload):
        """Procesa el ingreso individual o masivo desde Registro Rápido a FastReg"""
        try:
            import json, subprocess, sys, os
            operador = payload.get('operador', 'Desconocido')
            es_masivo = payload.get('masivo', False)
            tipo_decl = payload.get('tipo', 'anonimo')
            
            if not es_masivo:
                # ── INGRESO INDIVIDUAL ──
                imei = payload.get('imei', '').strip()
                if not imei: return {"status": "error", "mensaje": "IMEI es obligatorio"}
                
                estado_registro = payload.get('estado', 'Registrado')
                linea_num = payload.get('linea', '').strip()
                
                encargado_linea = ''
                encargado_data = None
                if linea_num:
                    try:
                        res_linea = supabase.table('lineas').select('encargado').eq('numero', linea_num).execute()
                        if res_linea.data:
                            encargado_linea = res_linea.data[0].get('encargado', '')
                            if encargado_linea:
                                res_enc = supabase.table('encargados').select('*').eq('nombre', encargado_linea).execute()
                                if res_enc.data:
                                    encargado_data = res_enc.data[0]
                    except Exception as e:
                        print(f"Error fetching encargado/line data for line {linea_num}: {e}")

                pdf_ruta = None
                if estado_registro == 'Registrado' and tipo_decl in ['estandar', 'detallada']:
                    is_wom_op = (operador or '').upper() == 'WOM'
                    if is_wom_op and encargado_data and not payload.get('nombre_propietario'):
                        pdf_nombre = encargado_data.get('nombre', 'Anónimo')
                        pdf_tipo_doc = 'C.C.'
                        pdf_num_doc = encargado_data.get('identificacion', '')
                        pdf_lugar_exp = encargado_data.get('lugar_expedicion', '')
                        pdf_correo = encargado_data.get('correo', '')
                        pdf_linea_usuario = linea_num
                    else:
                        pdf_nombre = payload.get('nombre_propietario', '').strip() or payload.get('nombre', 'Anónimo')
                        pdf_tipo_doc = 'C.C.'
                        pdf_num_doc = payload.get('cedula_propietario', '').strip() or payload.get('cedula', '')
                        pdf_lugar_exp = payload.get('ciudad', '').strip()
                        pdf_correo = payload.get('correo', '').strip()
                        pdf_linea_usuario = payload.get('linea_usuario', '').strip()

                    # Carpeta de salida individual → FilesIMP/Cliente - Fecha
                    from datetime import datetime as _dt
                    _fecha_hoy = _dt.now().strftime('%d-%m-%Y')
                    _cliente_ind = payload.get('nombre', 'Anónimo') or 'Anónimo'
                    _cliente_folder = re.sub(r'[<>:"/\\|?*]', '_', _cliente_ind.strip())
                    _files_imp_dir = self._get_files_imp_dir()
                    _output_dir = os.path.join(_files_imp_dir, f"{_cliente_folder} - {_fecha_hoy}")
                    os.makedirs(_output_dir, exist_ok=True)

                    datos_pdf = {
                        'nombre': pdf_nombre,
                        'tipo_doc': pdf_tipo_doc,
                        'num_doc': pdf_num_doc,
                        'lugar_exp': pdf_lugar_exp,
                        'linea_usuario': pdf_linea_usuario,
                        'operador': payload.get('operador_declaracion', operador),
                        'modelo': payload.get('modelo', ''),
                        'imei': imei,
                        'modo': tipo_decl,
                        'salida_dir': _output_dir
                    }
                    ruta_script_pdf = script_path("GeneradorPDF.py")
                    if os.path.exists(ruta_script_pdf):
                        args_pdf = [sys.executable, ruta_script_pdf, json.dumps(datos_pdf)]
                        proceso_pdf = subprocess.run(args_pdf, capture_output=True, text=True, encoding='utf-8')
                        for linea_pdf in reversed(proceso_pdf.stdout.strip().split('\n')):
                            if linea_pdf.strip().startswith('{'):
                                res_pdf = json.loads(linea_pdf.strip())
                                if res_pdf.get("status") == "success":
                                    pdf_ruta = res_pdf.get("ruta")
                                    abrir_archivo(pdf_ruta)
                                break
                
                # Inserción en DB
                data = {
                    'IMEI': imei,
                    'MODELO': payload.get('modelo', ''),
                    'ESTADO': estado_registro,
                    'OPERADOR': operador,
                    'CLIENTE': payload.get('nombre', 'Anónimo') if payload.get('nombre') else 'Anónimo',
                    'PAGO': 'No',
                    'LÍNEA': linea_num,
                    'encargado': encargado_linea,
                    'RAZÓN': f"Registro Rápido ({tipo_decl.capitalize()})"
                }
                supabase.table('FastReg').upsert(data).execute()
                
                if linea_num:
                    try:
                        from datetime import datetime
                        ahora_iso = datetime.now().astimezone().isoformat()
                        supabase.table('lineas').update({'las_use': ahora_iso}).eq('numero', linea_num).execute()
                        print(f"✅ [FastReg] updated las_use for line {linea_num} to {ahora_iso}")
                    except Exception as le:
                        print(f"⚠️ [FastReg] Error updating las_use for line {linea_num}: {le}")

                ret = {"status": "success", "mensaje": "Procesado correctamente"}
                if pdf_ruta:
                    ret["pdf_ruta"] = pdf_ruta
                return ret
                
            else:
                # ── INGRESO MASIVO ESTRUCTURADO ──
                registros_lista = payload.get('registros', [])
                if not registros_lista and payload.get('textoExcel'):
                    texto = payload.get('textoExcel', '').strip()
                    if texto:
                        for l in texto.split('\n'):
                            cols = l.split('\t')
                            if cols and len(cols[0].strip()) >= 15:
                                registros_lista.append({
                                    'imei': cols[0].strip(),
                                    'modelo': cols[1].strip() if len(cols) > 1 else ''
                                })
                
                if not registros_lista:
                    return {"status": "error", "mensaje": "No se proporcionaron registros válidos para la carga masiva"}

                lineas_perm = [str(num).strip() for num in payload.get('lineas', []) if str(num).strip()]
                cliente_val = payload.get('cliente', 'Anónimo').strip() or 'Anónimo'
                inc_opts = payload.get('inc_pantallazo', {})
                
                from datetime import datetime
                ahora_dt = datetime.now().astimezone()
                grupo_id = f"MASIVO_{ahora_dt.strftime('%Y%m%d_%H%M%S')}"
                
                # Directorio para guardar resultados de la carga masiva → FilesIMP/Cliente - Fecha (sin corchetes)
                fecha_hoy = ahora_dt.strftime('%d-%m-%Y')
                cliente_folder = re.sub(r'[<>:"/\\|?*]', '_', cliente_val)
                folder_name = f"{cliente_folder} - {fecha_hoy}"
                files_imp_dir = self._get_files_imp_dir()
                output_dir = os.path.join(files_imp_dir, folder_name)
                try:
                    os.makedirs(output_dir, exist_ok=True)
                except Exception as fe:
                    print(f"⚠️ Error al crear carpeta de resultados masivos: {fe}")

                lineas_usadas_set = set()
                batch_data = []
                items_a_procesar = []

                for idx, reg in enumerate(registros_lista):
                    imei_val = str(reg.get('imei', '')).strip()
                    if len(imei_val) != 15:
                        continue

                    modelo_val = str(reg.get('modelo', '')).strip()

                    # Asignación cíclica de línea (Round-Robin)
                    linea_num = str(reg.get('linea', '')).strip()
                    if not linea_num and lineas_perm:
                        linea_num = lineas_perm[idx % len(lineas_perm)]
                    if linea_num:
                        lineas_usadas_set.add(linea_num)

                    # Determinar operador — usa el que viene en la fila primero
                    operador_reg = str(reg.get('operador', '')).strip() or payload.get('operador_declaracion', '').strip() or operador

                    encargado_linea = str(reg.get('titular', '')).strip()

                    # Si no hay encargado en la fila, consultamos la línea
                    if linea_num and (not encargado_linea or not operador_reg or operador_reg == 'Desconocido'):
                        try:
                            res_linea = supabase.table('lineas').select('encargado, operador').eq('numero', linea_num).execute()
                            if res_linea.data:
                                if not encargado_linea:
                                    encargado_linea = res_linea.data[0].get('encargado', '')
                                if not operador_reg or operador_reg == 'Desconocido':
                                    operador_reg = res_linea.data[0].get('operador', '') or operador_reg
                        except Exception as le:
                            print(f"Error fetching line data for {linea_num}: {le}")

                    item_dict = {
                        'imei': imei_val,
                        'modelo': modelo_val,
                        'operador': operador_reg or 'ETB',
                        'linea': linea_num,
                        'encargado': encargado_linea or cliente_val,
                        'nombre_propietario': str(reg.get('nombre_propietario', '')).strip(),
                        'cedula_propietario': str(reg.get('cedula_propietario', '')).strip(),
                        'linea_usuario': str(reg.get('linea_usuario', '')).strip(),
                        'ciudad': str(reg.get('ciudad', '')).strip(),
                        'correo': str(reg.get('correo', '')).strip(),
                        'operador_declaracion': str(reg.get('operador_declaracion', '')).strip()
                    }
                    items_a_procesar.append(item_dict)

                    batch_data.append({
                        'IMEI': imei_val,
                        'MODELO': modelo_val,
                        'ESTADO': 'Pendiente',
                        'OPERADOR': operador_reg or 'ETB',
                        'CLIENTE': cliente_val,
                        'PAGO': 'No',
                        'LÍNEA': linea_num,
                        'encargado': encargado_linea or cliente_val,
                        'RAZÓN': f"Masivo ({tipo_decl.capitalize()}) [{grupo_id}]"
                    })

                if not items_a_procesar:
                    return {"status": "error", "mensaje": "No se encontraron IMEIs válidos de 15 dígitos en el lote"}

                # 1. Upsert inicial en FastReg
                if batch_data:
                    try:
                        supabase.table('FastReg').upsert(batch_data).execute()
                    except Exception as be:
                        print(f"Error guardando lote en FastReg: {be}")

                # 2. Actualizar las_use para líneas usadas
                ahora_iso = ahora_dt.isoformat()
                for l_num in lineas_usadas_set:
                    try:
                        supabase.table('lineas').update({'las_use': ahora_iso}).eq('numero', l_num).execute()
                    except Exception as le:
                        print(f"Error updating las_use for line {l_num}: {le}")

                # 3. Función Worker para ejecutar registro secuencial UNO A LA VEZ
                def worker_registro_masivo(items, cliente_nombre, tipo_declaracion, inc_opciones, out_dir):
                    total = len(items)
                    print(f" [Masivo] Iniciando registro secuencial de {total} equipos...")
                    exitos = 0
                    fallos = 0

                    for idx, reg_item in enumerate(items):
                        imei_val = reg_item['imei']
                        modelo_val = reg_item['modelo']
                        linea_num = reg_item['linea']
                        operador_reg = (reg_item['operador'] or '').upper().strip()
                        encargado_val = reg_item['encargado']

                        try:
                            if self.window:
                                op_txt = operador_reg or 'Operador'
                                self.window.evaluate_js(f"showToast('({idx+1}/{total}) Registrando IMEI {imei_val} en {op_txt}...', 'info');")
                        except Exception:
                            pass

                        opts_pantallazo = {
                            'incluir_operador': inc_opciones.get('operador', True),
                            'incluir_imei': inc_opciones.get('imei', True),
                            'incluir_modelo': inc_opciones.get('modelo', True),
                            'incluir_linea': inc_opciones.get('linea', True),
                            'incluir_propietario': inc_opciones.get('titular', True),
                            'modelo': modelo_val,
                            'propietario': encargado_val or cliente_nombre,
                            'linea': linea_num
                        }

                        res_bot = None
                        con_pantallazo = (tipo_declaracion == 'original')

                        try:
                            if 'WOM' in operador_reg:
                                res_bot = self.registrar_wom(imei_val, linea_num, async_run=False, con_pantallazo=con_pantallazo, opciones_pantallazo=opts_pantallazo)
                            elif 'ETB' in operador_reg:
                                res_bot = self.registrar_etb(imei_val, linea_num, async_run=False, con_pantallazo=con_pantallazo, opciones_pantallazo=opts_pantallazo)
                            else:
                                # Si el operador es otro o no definido, chequear operador de la línea
                                op_linea = ''
                                if linea_num:
                                    try:
                                        rl = supabase.table('lineas').select('operador').eq('numero', linea_num).execute()
                                        if rl.data and rl.data[0].get('operador'):
                                            op_linea = rl.data[0]['operador'].upper()
                                    except Exception:
                                        pass
                                if 'WOM' in op_linea:
                                    res_bot = self.registrar_wom(imei_val, linea_num, async_run=False, con_pantallazo=con_pantallazo, opciones_pantallazo=opts_pantallazo)
                                else:
                                    res_bot = self.registrar_etb(imei_val, linea_num, async_run=False, con_pantallazo=con_pantallazo, opciones_pantallazo=opts_pantallazo)
                        except Exception as bot_err:
                            print(f"Error en registro secuencial de {imei_val}: {bot_err}")
                            res_bot = {"status": "error", "mensaje": str(bot_err)}

                        es_exito = bool(res_bot and res_bot.get('status') == 'success')
                        estado_final = "Registrado" if es_exito else "Fallido"
                        if es_exito:
                            exitos += 1
                        else:
                            fallos += 1

                        # Actualizar estado en FastReg
                        try:
                            supabase.table('FastReg').update({
                                'ESTADO': estado_final,
                                'MODELO': modelo_val
                            }).eq('IMEI', imei_val).execute()
                        except Exception as fe_err:
                            print(f"Error actualizando FastReg status para {imei_val}: {fe_err}")

                        # Guardar comprobante pantallazo si se generó
                        if res_bot and isinstance(res_bot, dict):
                            ss_path = res_bot.get('screenshot_path')
                            if ss_path and os.path.exists(ss_path):
                                try:
                                    import shutil
                                    dest_ss = os.path.join(out_dir, f"{imei_val}_{operador_reg or 'comprobante'}.png")
                                    shutil.copy2(ss_path, dest_ss)
                                except Exception as sse:
                                    print(f"Error guardando comprobante en carpeta de lote: {sse}")

                        # PDF o Constancia si es detallada o estándar
                        if tipo_declaracion in ['detallada', 'estandar']:
                            try:
                                datos_pdf = {
                                    'nombre': reg_item.get('nombre_propietario') or cliente_nombre,
                                    'tipo_doc': 'C.C.',
                                    'num_doc': reg_item.get('cedula_propietario'),
                                    'lugar_exp': reg_item.get('ciudad'),
                                    'linea_usuario': reg_item.get('linea_usuario'),
                                    'operador': reg_item.get('operador_declaracion') or operador_reg,
                                    'modelo': modelo_val,
                                    'imei': imei_val,
                                    'modo': tipo_declaracion,
                                    'salida_dir': out_dir
                                }
                                ruta_script_pdf = script_path("GeneradorPDF.py")
                                if os.path.exists(ruta_script_pdf):
                                    subprocess.run([sys.executable, ruta_script_pdf, json.dumps(datos_pdf)],
                                                   capture_output=True, text=True, encoding='utf-8')
                            except Exception as pe:
                                print(f"Error generando PDF/constancia masivo item {imei_val}: {pe}")

                        # Notificar resultado individual al frontend
                        try:
                            if self.window:
                                icon = "✓" if es_exito else "✗"
                                toast_type = "success" if es_exito else "warning"
                                self.window.evaluate_js(f"showToast('{icon} ({idx+1}/{total}) IMEI {imei_val}: {estado_final}', '{toast_type}');")
                                self.window.evaluate_js("if (typeof window.recibirActualizacionFastReg === 'function') { window.recibirActualizacionFastReg(); }")
                        except Exception:
                            pass

                        time.sleep(1.2)

                    # Fin de todo el lote
                    try:
                        if self.window:
                            self.window.evaluate_js(f"showToast(' Lote Masivo Completado: {exitos} exitosos, {fallos} fallidos.', 'success');")
                            self.window.evaluate_js("if (typeof cargarDatosFastReg === 'function') { cargarDatosFastReg(); }")
                            self.window.evaluate_js("if (typeof renderizarTabla === 'function') { renderizarTabla(); }")
                    except Exception:
                        pass

                # Lanzar en hilo secundario para procesamiento secuencial no bloqueante de la interfaz
                threading.Thread(
                    target=worker_registro_masivo,
                    args=(items_a_procesar, cliente_val, tipo_decl, inc_opts, output_dir),
                    daemon=True
                ).start()

                return {
                    "status": "success",
                    "mensaje": f"Iniciando registro masivo secuencial de {len(items_a_procesar)} equipos...",
                    "grupo_id": grupo_id
                }

        except Exception as e:
            print(f"[procesar_fastreg] ERROR: {e}")
            import traceback; traceback.print_exc()
            return {"status": "error", "mensaje": str(e)}
# ── SERVIDOR HTTP LOCAL ────────────────────────────────────────────

def iniciar_servidor(ruta_base, puerto):
    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=ruta_base, **kwargs)
        def log_message(self, format, *args):
            pass

    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("127.0.0.1", puerto), QuietHandler) as httpd:
            httpd.serve_forever()
    except Exception:
        pass


# ── ENTRY POINT ────────────────────────────────────────────────────

if __name__ == '__main__':
    api = Api()

    if getattr(sys, 'frozen', False):
        PROJECT_ROOT = sys._MEIPASS
        CONTROLLERS_DIR = os.path.join(PROJECT_ROOT, "Controllers")
        application_path = sys._MEIPASS
    else:
        CONTROLLERS_DIR = os.path.dirname(os.path.abspath(__file__))
        PROJECT_ROOT = os.path.dirname(CONTROLLERS_DIR)
        application_path = PROJECT_ROOT

    VIEWS_DIR = os.path.join(PROJECT_ROOT, "Views")
    VIEWS_HTML = os.path.join(VIEWS_DIR, "html")
    VIEWS_ICONS = os.path.join(VIEWS_DIR, "icons")
    MODELS_DIR = os.path.join(PROJECT_ROOT, "Models")

    puerto_asignado = obtener_puerto_libre()
    print(f" [SERVER] Iniciando en puerto {puerto_asignado}...")

    hilo_servidor = threading.Thread(
        target=iniciar_servidor,
        args=(application_path, puerto_asignado),
        daemon=True
    )
    hilo_servidor.start()
    time.sleep(1)

    url_local = _dashboard_url(puerto_asignado, application_path)

    print("\n" + "═" * 50)
    print("  IMEI MANAGER PRO v2.0 - MODO MVC ACTIVADO")
    print(f"  URL local: {url_local}")
    print(f"   Plataforma: {platform.system()} · GUI: {_get_webview_gui()}")
    print("═" * 50 + "\n")

    ventana = webview.create_window(
        'IMEI Manager Pro',
        url=url_local,
        js_api=api,
        width=1300,
        height=900,
        min_size=(1000, 700),
        background_color='#0f172a',
        maximized=True
    )
    api.set_window(ventana)

    webview.start(debug=False, gui=_get_webview_gui())