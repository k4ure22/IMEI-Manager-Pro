from asyncio import threads
import os
import sys
from supabase import create_client, Client

# Pega aquí tus credenciales (las que sacaste del Paso 1)
SUPABASE_URL = "https://oxylxjzubuwtrxvfxjfb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94eWx4anp1YnV3dHJ4dmZ4amZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MDEzNDQsImV4cCI6MjA5NTM3NzM0NH0.ST6kYcx3F4K1_qGRkz6VpUBPbraXAIC774YcQigoajE"

# Crear el cliente de la BD
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
# ── Asegurar que Controllers/ esté en sys.path para imports locales ──
_SELF_DIR = os.path.dirname(os.path.abspath(__file__))
if _SELF_DIR not in sys.path:
    sys.path.insert(0, _SELF_DIR)
# ────────────────────────────────────────────────────────────────────

import webview
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
import threading
import http.server
import socketserver
import socket
import time
import sqlite3
import hashlib
import openpyxl
import subprocess
from AppKit import NSApp, NSImage

# Importaciones para Selenium
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
# Controllers/ es donde vive este main.py
CONTROLLERS_DIR = os.path.dirname(os.path.abspath(__file__))
# Raíz del proyecto (un nivel arriba de Controllers/)
PROJECT_ROOT    = os.path.dirname(CONTROLLERS_DIR)
# Views/
VIEWS_DIR       = os.path.join(PROJECT_ROOT, "Views")
VIEWS_HTML      = os.path.join(VIEWS_DIR,    "html")
VIEWS_ICONS     = os.path.join(VIEWS_DIR,    "icons")
# Models/
MODELS_DIR      = os.path.join(PROJECT_ROOT, "Models")
# ──────────────────────────────────────────────────────────────────

def resource_path(relative_path):
    """Obtiene la ruta absoluta de los recursos (necesario para PyInstaller)"""
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(PROJECT_ROOT, relative_path)

def set_dock_icon(mode):
    """Cambia el icono en el Dock según el modo"""
    suffix = "light" if mode == "light" else "dark"
    icon_path = os.path.join(VIEWS_ICONS, f"logoIMP{suffix}.png")
    image = NSImage.alloc().initByReferencingFile_(icon_path)
    NSApp.setApplicationIconImage_(image)

def obtener_puerto_libre():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]

class Api:
    def __init__(self):
        self.window = None
        self.current_user = None
        self.db_path = self.obtener_ruta_bd()
        self.init_db()

    def obtener_ruta_bd(self):
        # Asegurar que la carpeta Models existe
        os.makedirs(MODELS_DIR, exist_ok=True)
        db_path = os.path.join(MODELS_DIR, "imei_database.db")

        # Intentar migrar desde la ubicación antigua si el archivo nuevo no existe
        old_path = os.path.join(os.path.expanduser("~"), "IMEIManagerData", "imei_database.sqlite")
        
        if os.path.exists(old_path):
            # Solo copiar si el destino no existe o está vacío
            if not os.path.exists(db_path) or os.path.getsize(db_path) == 0:
                import shutil
                try:
                    shutil.copy2(old_path, db_path)
                    print(f"✅ [MVC] Base de datos migrada: {old_path} -> {db_path}")
                except Exception as e:
                    print(f"❌ [MVC] Error migrando BD: {e}")
        return db_path

    def init_db(self):
        self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS registros (
                imei TEXT PRIMARY KEY, modelo TEXT, estado TEXT, operador TEXT,
                cliente TEXT, razon TEXT, encargado TEXT, pago TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS papelera (
                imei TEXT PRIMARY KEY, modelo TEXT, estado TEXT, operador TEXT,
                cliente TEXT, razon TEXT, encargado TEXT, pago TEXT,
                fecha_borrado DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        for query in [
            "ALTER TABLE registros ADD COLUMN pin_desbloqueo TEXT DEFAULT ''",
            "ALTER TABLE papelera ADD COLUMN pin_desbloqueo TEXT DEFAULT ''",
            "ALTER TABLE registros ADD COLUMN reg_wom TEXT DEFAULT 'No'",
            "ALTER TABLE papelera ADD COLUMN reg_wom TEXT DEFAULT 'No'",
            "ALTER TABLE registros ADD COLUMN reg_etb TEXT DEFAULT 'No'",
            "ALTER TABLE papelera ADD COLUMN reg_etb TEXT DEFAULT 'No'",
        ]:
            try: cursor.execute(query)
            except sqlite3.OperationalError: pass
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS encargados (
                nombre TEXT PRIMARY KEY, identificacion TEXT DEFAULT '',
                lugar_expedicion TEXT DEFAULT '', fecha_expedicion TEXT DEFAULT '',
                direccion TEXT DEFAULT '', lineas_wom TEXT DEFAULT '',
                lineas_etb TEXT DEFAULT '', correo TEXT DEFAULT '',
                mensaje TEXT DEFAULT '', color TEXT DEFAULT '#39FF14',
                app_password TEXT DEFAULT '',
                declaracion_wom TEXT DEFAULT ''
            )
        ''')
        for q in [
            "ALTER TABLE encargados ADD COLUMN color TEXT DEFAULT '#39FF14'",
            "ALTER TABLE encargados ADD COLUMN app_password TEXT DEFAULT ''",
            "ALTER TABLE encargados ADD COLUMN declaracion_wom TEXT DEFAULT ''",
            "ALTER TABLE encargados ADD COLUMN foto_cc TEXT DEFAULT ''",
            "ALTER TABLE registros ADD COLUMN foto_dispositivo TEXT DEFAULT ''",
            "ALTER TABLE papelera ADD COLUMN foto_dispositivo TEXT DEFAULT ''",
            "ALTER TABLE registros ADD COLUMN ruta_declaracion_generada TEXT DEFAULT ''",
            "ALTER TABLE papelera ADD COLUMN ruta_declaracion_generada TEXT DEFAULT ''",
            "ALTER TABLE registros ADD COLUMN fecha_declaracion_generada TEXT DEFAULT ''",
            "ALTER TABLE papelera ADD COLUMN fecha_declaracion_generada TEXT DEFAULT ''",
        ]:
            try: cursor.execute(q)
            except sqlite3.OperationalError: pass

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS clientes (
                id TEXT PRIMARY KEY, nombre TEXT, tipo_id TEXT,
                celular TEXT, email TEXT, expedicion TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS usuarios (
                usuario TEXT PRIMARY KEY,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                rol TEXT NOT NULL DEFAULT 'user',
                estado TEXT NOT NULL DEFAULT 'activo',
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS configuracion (
                clave TEXT PRIMARY KEY,
                valor TEXT NOT NULL
            )
        ''')
        cursor.execute('''
            INSERT OR IGNORE INTO configuracion (clave, valor) VALUES ('db_status', 'active')
        ''')
        self.conn.commit()

    # --- CONTROL DE ACCESO Y SEGURIDAD ---
    def _hash_password(self, password: str, salt: str) -> str:
        # PBKDF2 con HMAC-SHA256, 100,000 iteraciones
        hashed = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return hashed.hex()

    def _is_db_locked(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute("SELECT valor FROM configuracion WHERE clave = 'db_status'")
            row = cursor.fetchone()
            db_status = row['valor'] if row else 'active'
            if db_status == 'paused':
                # Si está pausada y no es administrador, está bloqueada
                if not self.current_user or self.current_user.get('rol') != 'admin':
                    return True
            return False
        except:
            return False

    def registrar_usuario(self, usuario, password):
        usuario = usuario.strip()
        if not usuario or not password:
            return {"status": "error", "mensaje": "El usuario y la contraseña no pueden estar vacíos."}
        try:
            cursor = self.conn.cursor()
            # Verificar si ya existe algún usuario
            cursor.execute("SELECT COUNT(*) as total FROM usuarios")
            row = cursor.fetchone()
            total_usuarios = row['total'] if row else 0

            # El primer usuario que se registra siempre es administrador
            rol = 'admin' if total_usuarios == 0 else 'user'

            salt = os.urandom(16).hex()
            pw_hash = self._hash_password(password, salt)

            cursor.execute('''
                INSERT INTO usuarios (usuario, password_hash, salt, rol)
                VALUES (?, ?, ?, ?)
            ''', (usuario, pw_hash, salt, rol))
            self.conn.commit()
            return {"status": "success", "mensaje": f"Usuario registrado con éxito como {rol.upper()}."}
        except sqlite3.IntegrityError:
            return {"status": "error", "mensaje": "Este nombre de usuario ya está registrado."}
        except Exception as e:
            return {"status": "error", "mensaje": f"Error al registrar: {str(e)}"}

    def login_usuario(self, usuario, password):
        usuario = usuario.strip()
        if not usuario or not password:
            return {"status": "error", "mensaje": "El usuario y la contraseña son requeridos."}
        try:
            cursor = self.conn.cursor()
            # Obtener estado de la base de datos
            cursor.execute("SELECT valor FROM configuracion WHERE clave = 'db_status'")
            state_row = cursor.fetchone()
            db_status = state_row['valor'] if state_row else 'active'

            # Buscar usuario
            cursor.execute("SELECT * FROM usuarios WHERE usuario = ?", (usuario,))
            row = cursor.fetchone()
            if not row:
                return {"status": "error", "mensaje": "Usuario o contraseña incorrectos."}

            user_dict = dict(row)
            pw_hash = self._hash_password(password, user_dict['salt'])

            if pw_hash != user_dict['password_hash']:
                return {"status": "error", "mensaje": "Usuario o contraseña incorrectos."}

            if user_dict['estado'] != 'activo':
                return {"status": "error", "mensaje": "Tu cuenta se encuentra suspendida."}

            # Si la BD está pausada, solo el administrador puede entrar
            if db_status == 'paused' and user_dict['rol'] != 'admin':
                return {
                    "status": "paused",
                    "mensaje": "El administrador ha puesto la base de datos en descanso temporal por mantenimiento."
                }

            # Guardar en la sesión de la API
            self.current_user = {
                "usuario": user_dict['usuario'],
                "rol": user_dict['rol']
            }
            return {
                "status": "success",
                "user": self.current_user,
                "mensaje": f"Bienvenido de nuevo, {usuario}."
            }
        except Exception as e:
            return {"status": "error", "mensaje": f"Error al iniciar sesión: {str(e)}"}

    def logout_usuario(self):
        self.current_user = None
        return {"status": "success", "mensaje": "Sesión cerrada correctamente."}

    def obtener_estado_bd(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute("SELECT valor FROM configuracion WHERE clave = 'db_status'")
            row = cursor.fetchone()
            status = row['valor'] if row else 'active'
            return {"status": "success", "db_status": status}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def cambiar_estado_bd(self, usuario_admin, nuevo_estado):
        if nuevo_estado not in ['active', 'paused']:
            return {"status": "error", "mensaje": "Estado de base de datos inválido."}
        try:
            cursor = self.conn.cursor()
            # Validar que quien lo solicita sea admin
            cursor.execute("SELECT rol FROM usuarios WHERE usuario = ?", (usuario_admin,))
            row = cursor.fetchone()
            if not row or row['rol'] != 'admin':
                return {"status": "error", "mensaje": "Permiso denegado. Se requiere ser Administrador."}

            cursor.execute("UPDATE configuracion SET valor = ? WHERE clave = 'db_status'", (nuevo_estado,))
            self.conn.commit()
            return {
                "status": "success",
                "db_status": nuevo_estado,
                "mensaje": f"Base de datos cambiada a estado: {'ACTIVA' if nuevo_estado == 'active' else 'EN DESCANSO'}."
            }
        except Exception as e:
            return {"status": "error", "mensaje": f"Error al cambiar estado: {str(e)}"}

    # --- AUTOMATIZACIÓN ---
    def registrar_wom(self, imei, linea_wom):
        cursor = self.conn.cursor()
        cursor.execute('SELECT encargado FROM registros WHERE imei = ?', (imei,))
        reg = cursor.fetchone()
        if not reg or not reg['encargado']:
            return {"status": "error", "mensaje": "IMEI sin encargado."}
        encargado = self.obtener_encargado(reg['encargado'])
        if not encargado:
            return {"status": "error", "mensaje": "Encargado no encontrado."}
        partes = encargado['nombre'].strip().split()
        primer_nombre = partes[0] if partes else "NULL"
        segundo_nombre, primer_apellido, segundo_apellido = "NULL", "NULL", "NULL"
        if len(partes) == 2:   primer_apellido = partes[1]
        elif len(partes) == 3: segundo_nombre = partes[1]; primer_apellido = partes[2]
        elif len(partes) >= 4: segundo_nombre = partes[1]; primer_apellido = partes[2]; segundo_apellido = " ".join(partes[3:])
        documento = encargado['identificacion']
        if not documento or not linea_wom:
            return {"status": "error", "mensaje": "Faltan datos de ID o Línea."}
        script_path = os.path.join(CONTROLLERS_DIR, "RegistrarWom.py")
        def _bg():
            import json
            from datetime import datetime
            try:
                cmd = [sys.executable, script_path, str(imei), str(linea_wom), str(documento),
                       str(primer_nombre), str(segundo_nombre), str(primer_apellido), str(segundo_apellido)]
                proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
                stdout, _ = proc.communicate()
                resultado = {"status": "error", "mensaje": "Error de comunicación con Selenium."}
                for line in stdout.splitlines():
                    if line.startswith('{'):
                        try: resultado = json.loads(line)
                        except: pass
                if resultado.get("status") == "success":
                    self.actualizar_campo(imei, 'reg_wom', datetime.now().isoformat())
                elif resultado.get("status") == "error":
                    self.actualizar_campo(imei, 'reg_wom', 'Error')
                if self.window:
                    msg = resultado.get('mensaje', '').replace("'", "\\'")
                    self.window.evaluate_js(f"showToast('{msg}', '')")
                    self.window.evaluate_js("cargarDatos().then(() => actualizarUIBotonesRegistro())")
            except Exception as e:
                if self.window: self.window.evaluate_js(f"showToast('Error interno: {str(e)}', '')")
        threading.Thread(target=_bg, daemon=True).start()
        return {"status": "success", "mensaje": "Bot WOM lanzado..."}

    def registrar_etb(self, imei, linea_etb):
        if not linea_etb:
            return {"status": "error", "mensaje": "Falta la línea ETB."}
        script_path = os.path.join(CONTROLLERS_DIR, "RegistrarEtb.py")
        def _bg():
            import json
            from datetime import datetime
            try:
                cmd = [sys.executable, script_path, str(imei), str(linea_etb)]
                proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
                stdout, _ = proc.communicate()
                resultado = {"status": "error", "mensaje": "Error de comunicación con Selenium ETB."}
                for line in stdout.splitlines():
                    if line.startswith('{'):
                        try: resultado = json.loads(line)
                        except: pass
                if resultado.get("status") == "success":
                    self.actualizar_campo(imei, 'reg_etb', datetime.now().isoformat())
                elif resultado.get("status") == "error":
                    self.actualizar_campo(imei, 'reg_etb', 'Error')
                if self.window:
                    msg = resultado.get('mensaje', '').replace("'", "\\'")
                    self.window.evaluate_js(f"showToast('{msg}', '')")
                    self.window.evaluate_js("cargarDatos().then(() => actualizarUIBotonesRegistro())")
            except Exception as e:
                if self.window: self.window.evaluate_js(f"showToast('Error interno: {str(e)}', '')")
        threading.Thread(target=_bg, daemon=True).start()
        return {"status": "success", "mensaje": "Bot ETB lanzado..."}

    def obtener_todos_encargados(self):
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM encargados')
        return [dict(f) for f in cursor.fetchall()]

    def obtener_encargado(self, nombre):
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM encargados WHERE nombre = ?', (nombre,))
        fila = cursor.fetchone()
        return dict(fila) if fila else None

    def guardar_encargado(self, datos):
        try:
            cursor = self.conn.cursor()
            # Fetch existing files if updating
            cursor.execute("SELECT declaracion_wom, foto_cc FROM encargados WHERE nombre = ?", (datos['nombre'],))
            existente = cursor.fetchone()
            
            decl_existente = existente['declaracion_wom'] if existente else ''
            cc_existente = existente['foto_cc'] if existente else ''

            cursor.execute('''
                INSERT OR REPLACE INTO encargados
                (nombre, identificacion, lugar_expedicion, fecha_expedicion, direccion,
                 lineas_wom, lineas_etb, correo, mensaje, color, app_password, declaracion_wom, foto_cc)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (datos['nombre'], datos.get('identificacion', ''), datos.get('lugar_expedicion', ''),
                  datos.get('fecha_expedicion', ''), datos.get('direccion', ''), datos.get('lineas_wom', ''),
                  datos.get('lineas_etb', ''), datos.get('correo', ''), datos.get('mensaje', ''),
                  datos.get('color', '#39FF14'), datos.get('app_password', ''),
                  datos.get('declaracion_wom', decl_existente),
                  datos.get('foto_cc', cc_existente)))
            self.conn.commit()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def eliminar_encargado(self, nombre):
        try:
            cursor = self.conn.cursor()
            cursor.execute('DELETE FROM encargados WHERE nombre = ?', (nombre,))
            self.conn.commit()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def guardar_pin(self, imei, pin):
        try:
            cursor = self.conn.cursor()
            cursor.execute("UPDATE registros SET pin_desbloqueo = ? WHERE imei = ?", (pin, imei))
            self.conn.commit()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def set_window(self, window):
        self.window = window

    def obtener_registros(self):
        if self._is_db_locked():
            print("⚠️ [API] Acceso bloqueado a registros: La BD está en descanso.")
            return []
        print("📡 [API] Solicitando registros...")
        try:
            cursor = self.conn.cursor()
            cursor.execute('SELECT * FROM registros')
            filas = cursor.fetchall()
            data = [dict(fila) for fila in filas]
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
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT INTO registros (imei, modelo, estado, operador, cliente, razon, encargado, pago)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (datos['imei'], datos['modelo'], datos['estado'], datos['operador'], 
                  datos['cliente'], datos['razon'], datos['encargado'], datos['pago']))
            self.conn.commit()
            print("✅ [API] Registro guardado con éxito.")
            return {"status": "success"}
        except sqlite3.IntegrityError:
            print("⚠️ [API] IMEI ya existe.")
            return {"status": "error", "mensaje": "Este IMEI ya está registrado."}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def actualizar_campo(self, imei, campo, valor):
        if self._is_db_locked():
            return {"status": "error", "mensaje": "La base de datos está actualmente en descanso. Acción no permitida."}
        campos_permitidos = ["modelo", "cliente", "razon", "encargado", "pago", "reg_wom", "reg_etb", "foto_dispositivo"]
        if campo not in campos_permitidos:
            return {"status": "error", "mensaje": f"Campo {campo} no modificable."}
        try:
            cursor = self.conn.cursor()
            cursor.execute(f"UPDATE registros SET {campo} = ? WHERE imei = ?", (valor, imei))
            self.conn.commit()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    # ── CORREO DESBLOQUEO WOM ──────────────────────────────────────────
    def enviar_correo_desbloqueo_wom(self, imei, ruta_foto: str = ""):
        """Reúne los datos necesarios y envía el correo de desbloqueo WOM."""
        if not enviar_correo_desbloqueo:
            return {"status": "error", "mensaje": "Módulo de correo no disponible."}

        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM registros WHERE imei = ?', (imei,))
        reg = cursor.fetchone()
        if not reg:
            return {"status": "error", "mensaje": "IMEI no encontrado en registros."}
        reg = dict(reg)

        nombre_enc = reg.get('encargado', '')
        if not nombre_enc:
            return {"status": "error", "mensaje": "El registro no tiene encargado asignado."}

        enc = self.obtener_encargado(nombre_enc)
        if not enc:
            return {"status": "error", "mensaje": "Encargado no encontrado en la base de datos."}

        # Validar datos mínimos
        faltantes = []
        if not enc.get('correo'):          faltantes.append("correo del encargado")
        if not enc.get('app_password'):    faltantes.append("contraseña de aplicación Gmail")
        if not enc.get('identificacion'):  faltantes.append("número de identificación (CC)")
        if not enc.get('lineas_wom'):      faltantes.append("líneas WOM")
        pin = reg.get('pin_desbloqueo', '').strip()
        if not pin:                        faltantes.append("PIN de desbloqueo (se enviará como PENDIENTE)")
        if faltantes:
            # Advertir pero no bloquear si solo falta el PIN
            solo_pin = faltantes == ["PIN de desbloqueo (se enviará como PENDIENTE)"]
            if not solo_pin:
                faltan_str = ", ".join(faltantes)
                return {"status": "error", "mensaje": f"Faltan datos: {faltan_str}"}

        # Ruta declaración WOM generada para el equipo
        decl_path = reg.get('ruta_declaracion_generada', '').strip() or None
        if not decl_path:
            return {"status": "error", "mensaje": "No se ha generado la declaración WOM para este IMEI."}

        # Foto de CC
        foto_cc = enc.get('foto_cc', '').strip() or None
        if not foto_cc:
            return {"status": "error", "mensaje": "Falta la fotocopia de la CC del encargado."}

        # Foto del dispositivo (puede venir de la llamada o de la BD)
        foto_path = ruta_foto.strip() if ruta_foto else reg.get('foto_dispositivo', '').strip() or None

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
                    ruta_foto_dispositivo=foto_path,
                    ruta_declaracion_wom=decl_path,
                    ruta_foto_cc=foto_cc
                )
                if self.window:
                    msg = resultado.get('mensaje', '').replace("'", "\\'")
                    icon = '' if resultado['status'] == 'success' else '❌'
                    self.window.evaluate_js(f"showToast('{msg}', '{icon}')")
            except Exception as e:
                if self.window:
                    self.window.evaluate_js(f"showToast('Error al enviar correo: {str(e)}', '❌')")

        threading.Thread(target=_bg, daemon=True).start()
        return {"status": "success", "mensaje": "Enviando correo de desbloqueo WOM..."}

    def seleccionar_foto_dispositivo(self, imei: str):
        """Abre diálogo para elegir foto y la guarda en Views/Files/<imei>.*"""
        try:
            files_dir = os.path.join(VIEWS_DIR, "Files")
            os.makedirs(files_dir, exist_ok=True)
            file_types = ('Imagenes (*.png)', 'Imagenes (*.jpg)', 'Imagenes (*.jpeg)', 'Todos los archivos (*.*)')
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
        """Abre diálogo para elegir la firma PDF del encargado."""
        try:
            files_dir = os.path.join(VIEWS_DIR, "Files")
            os.makedirs(files_dir, exist_ok=True)
            file_types = ('Archivos PDF (*.pdf)', 'Todos los archivos (*.*)')
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
            cursor = self.conn.cursor()
            cursor.execute("UPDATE encargados SET declaracion_wom = ? WHERE nombre = ?", (dst, nombre_encargado))
            self.conn.commit()
            return {"status": "success", "ruta": dst, "mensaje": "Firma PDF guardada"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def seleccionar_foto_cc(self, nombre_encargado: str):
        """Abre diálogo para elegir la foto de la CC del encargado."""
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
            cursor = self.conn.cursor()
            cursor.execute("UPDATE encargados SET foto_cc = ? WHERE nombre = ?", (dst, nombre_encargado))
            self.conn.commit()
            return {"status": "success", "ruta": dst, "mensaje": "Fotocopia CC guardada"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def generar_declaracion_wom(self, imei: str) -> dict:
        """Llena el template DeclaraciónWom.pdf con los datos del IMEI y encargado."""
        try:
            from pypdf import PdfReader, PdfWriter, Transformation
            from datetime import datetime
            import copy

            # Obtener registro
            cursor = self.conn.cursor()
            cursor.execute('SELECT * FROM registros WHERE imei = ?', (imei,))
            reg = cursor.fetchone()
            if not reg:
                return {"status": "error", "mensaje": "IMEI no encontrado."}
            reg = dict(reg)

            enc = self.obtener_encargado(reg.get('encargado', ''))
            if not enc:
                return {"status": "error", "mensaje": "Sin encargado asignado. Asigna uno primero."}

            # Buscar template
            files_dir = os.path.join(VIEWS_DIR, "Files")
            template_path = None
            for name in ["DeclaraciónWom.pdf", "DeclaracionWom.pdf",
                         "Declaración Wom.pdf", "declaracion_wom.pdf",
                         "DeclaraciónWOM.pdf"]:
                p = os.path.join(files_dir, name)
                if os.path.exists(p):
                    template_path = p
                    break
            if not template_path:
                return {"status": "error",
                        "mensaje": "No se encontró 'DeclaraciónWom.pdf' en Views/Files/"}

            # ── Preparar datos ────────────────────────────────────────
            modelo        = reg.get('modelo', '')
            partes_m      = modelo.split()
            # Marca = primera palabra; si el modelo trae la marca (ej "iPhone 13 Pro Max")
            # se usa la primera palabra; si hay solo una, marca=modelo
            marca         = partes_m[0] if len(partes_m) > 1 else modelo
            marca_modelo  = modelo                            # "iPhone 13 Pro Max"
            primera_wom   = (enc.get('lineas_wom', '') or '').split(',')[0].strip()
            fecha_hoy     = datetime.now().strftime("%d/%m/%Y")
            nombre_enc    = enc.get('nombre', '')
            id_enc        = enc.get('identificacion', '')
            lugar_exp     = enc.get('lugar_expedicion', '')
            direccion     = enc.get('direccion', '')

            # ── Mapeo campos AcroForm ─────────────────────────────────
            # Coordenadas confirmadas de cada campo (x, y_bottom, w, h):
            #   Firma_es_:signature → x=87.1, y=377.8, w=203.6, h=16.8
            campos = {
                # Cuerpo superior
                "Nombres y Apellidos":            nombre_enc,
                "Documento ID":                   "CC",
                "Número de documento":            id_enc,
                "Lugar de expedición":            lugar_exp,
                # Marca y Modelo en la misma línea del primer párrafo
                "Marca de equipo":                marca,
                "Modelo":                         marca_modelo,   # ej: "iPhone 13 Pro Max"
                "Números IMEIs":                  imei,
                # Firma queda vacía (se superpone el PDF de firma a escala)
                "Firma_es_:signature":            "",
                # Sección firma propietario
                "Nombre":                         nombre_enc,
                "Documento de identidad y número": f"CC {id_enc}",
                "Dirección":                      direccion,
                "Teléfono":                       primera_wom,
                "Ciudad":                         "Bogotá",
                "Fecha de la declaración":        fecha_hoy,
            }

            # ── Leer template y rellenar campos ──────────────────────
            reader = PdfReader(template_path)
            writer = PdfWriter()
            writer.append(reader)
            writer.update_page_form_field_values(
                writer.pages[0], campos, auto_regenerate=False
            )

            # ── Superponer modelo y firma escalada ─────────────────────────────
            import io
            from reportlab.pdfgen import canvas as pdf_canvas
            from reportlab.lib.pagesizes import letter

            # Crear un canvas temporal para el modelo en la línea vacía
            packet = io.BytesIO()
            can = pdf_canvas.Canvas(packet, pagesize=letter)
            can.setFont("Helvetica", 10)
            # Dibujar el modelo en la línea vacía (ajustar Y según sea necesario)
            can.drawString(85, 510, marca_modelo)
            can.save()
            packet.seek(0)
            overlay_pdf = PdfReader(packet)
            writer.pages[0].merge_page(overlay_pdf.pages[0])

            # Campo firma: x=87.1, y=377.8, w=203.6, h=16.8  (en pts)
            firma_path = enc.get('declaracion_wom', '').strip()
            if firma_path and os.path.isfile(firma_path) and firma_path.lower().endswith('.pdf'):
                try:
                    firma_reader  = PdfReader(firma_path)
                    firma_pg      = firma_reader.pages[0]
                    firma_w       = float(firma_pg.mediabox.width)
                    firma_h       = float(firma_pg.mediabox.height)

                    # Zona destino: ancho del campo, altura razonable para firma
                    dst_x   = 87.1          # izquierda del campo firma
                    dst_y   = 360.0         # base de la zona (un poco debajo del campo)
                    dst_w   = 203.6         # ancho del campo firma
                    dst_h   = 60.0          # altura cómoda para la firma

                    scale   = min(dst_w / firma_w, dst_h / firma_h)

                    # Centrar horizontalmente dentro de la zona
                    tx = dst_x + (dst_w - firma_w * scale) / 2
                    ty = dst_y

                    firma_copy = copy.deepcopy(firma_pg)
                    firma_copy.add_transformation(
                        Transformation().scale(scale, scale).translate(tx, ty)
                    )
                    # Recortar al tamaño del documento base para evitar desbordamiento
                    firma_copy.mediabox = copy.deepcopy(writer.pages[0].mediabox)
                    writer.pages[0].merge_page(firma_copy)
                except Exception as fe:
                    print(f"[WARN] No se pudo insertar firma: {fe}")

            # ── Guardar y abrir ───────────────────────────────────────
            out_dir = os.path.join(files_dir, "declaraciones_generadas")
            os.makedirs(out_dir, exist_ok=True)
            output_path = os.path.join(out_dir, f"Declaracion_unico_usuario_{imei}.pdf")
            with open(output_path, "wb") as f:
                writer.write(f)

            # Actualizar DB
            fecha_gen = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cursor = self.conn.cursor()
            cursor.execute('''
                UPDATE registros SET ruta_declaracion_generada = ?, fecha_declaracion_generada = ? WHERE imei = ?
            ''', (output_path, fecha_gen, imei))
            self.conn.commit()

            subprocess.Popen(["open", output_path])
            return {"status": "success", "ruta": output_path, "fecha": fecha_gen,
                    "mensaje": "Declaración WOM generada ✓"}

        except ImportError:
            return {"status": "error", "mensaje": "Instala pypdf: pip install pypdf"}
        except Exception as e:
            return {"status": "error", "mensaje": f"Error al generar PDF: {str(e)}"}

    def actualizar_imei(self, imei, headless: bool = False):
        try:
            scraper = ScraperEstado(headless=headless)
            estado, operador = scraper.consultar(imei)
            scraper.close()
            cursor = self.conn.cursor()
            cursor.execute('UPDATE registros SET estado = ?, operador = ? WHERE imei = ?', (estado, operador, imei))
            self.conn.commit()
            return {"status": "success", "estado": estado, "operador": operador}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def pantallazo_imei(self, imei, headless: bool = False):
        try:
            home_dir = os.path.expanduser("~")
            app_dir = os.path.join(home_dir, "IMEIManagerData")
            ruta = os.path.join(app_dir, f"{imei}.png")
            scraper = ScraperPantallazo(headless=headless)
            scraper.consultar_y_capturar(imei, ruta)
            scraper.close()
            subprocess.run(['/usr/bin/osascript', '-e',
                            f'set the clipboard to (read (POSIX file "{ruta}") as TIFF picture)'],
                           stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if os.path.exists(ruta): os.remove(ruta)
            return {"status": "success", "mensaje": "ScreenShot copiado al portapapeles"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def obtener_papelera(self):
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM papelera ORDER BY fecha_borrado DESC')
        return [dict(f) for f in cursor.fetchall()]

    def eliminar_registro(self, imei):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO papelera (imei, modelo, estado, operador, cliente, razon, encargado, pago)
                SELECT imei, modelo, estado, operador, cliente, razon, encargado, pago
                FROM registros WHERE imei = ?
            ''', (imei,))
            cursor.execute('DELETE FROM registros WHERE imei = ?', (imei,))
            self.conn.commit()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def restaurar_registro(self, imei):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO registros (imei, modelo, estado, operador, cliente, razon, encargado, pago)
                SELECT imei, modelo, estado, operador, cliente, razon, encargado, pago
                FROM papelera WHERE imei = ?
            ''', (imei,))
            cursor.execute('DELETE FROM papelera WHERE imei = ?', (imei,))
            self.conn.commit()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def borrar_permanente(self, imei):
        try:
            cursor = self.conn.cursor()
            cursor.execute('DELETE FROM papelera WHERE imei = ?', (imei,))
            self.conn.commit()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def vaciar_papelera(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute('DELETE FROM papelera')
            self.conn.commit()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def consultar_modelos(self, imeis, headless: bool = False):
        import json as _json
        for imei in imeis:
            self.actualizar_campo(imei, 'modelo', 'Consultando...')
        script_path = os.path.join(CONTROLLERS_DIR, "ConsultarModelo.py")
        def _bg():
            try:
                cmd = [sys.executable, script_path] + [str(i) for i in imeis]
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
                            self.actualizar_campo(imei_r, 'modelo', modelo if not modelo.startswith("Error") else 'Error')
                    except _json.JSONDecodeError:
                        pass
                proc.wait()
            except Exception:
                pass
        threading.Thread(target=_bg, daemon=True).start()
        return {"status": "success", "mensaje": "Consulta iniciada en segundo plano"}

    def cargar_excel(self):
        try:
            file_types = ('Archivos Excel (*.xlsx;*.xls)', 'Todos los archivos (*.*)')
            tipo_dialogo = getattr(webview.FileDialog, 'OPEN', getattr(webview, 'OPEN_DIALOG', 1))
            result = self.window.create_file_dialog(tipo_dialogo, allow_multiple=False, file_types=file_types)
            if not result:
                return {"status": "cancelled", "mensaje": "Carga cancelada"}
            ruta = result[0]
            wb = openpyxl.load_workbook(ruta)
            cursor = self.conn.cursor()
            sheet_registros = wb.worksheets[0]
            registros_insertados = 0
            for row in sheet_registros.iter_rows(min_row=2, values_only=True):
                row_clean = [str(x) if x is not None else "" for x in row]
                while len(row_clean) < 11: row_clean.append("")
                if row_clean[0].strip() == "": continue
                try:
                    cursor.execute('''
                        INSERT INTO registros
                        (imei, modelo, estado, operador, cliente, razon, encargado, pago, pin_desbloqueo, reg_wom, reg_etb)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (row_clean[0], row_clean[1], row_clean[2], row_clean[3],
                          row_clean[4], row_clean[5], row_clean[6], row_clean[7],
                          row_clean[8], row_clean[9] or 'No', row_clean[10] or 'No'))
                    registros_insertados += 1
                except sqlite3.IntegrityError:
                    continue
            encargados_insertados = 0
            if len(wb.sheetnames) > 1:
                for row in wb.worksheets[1].iter_rows(min_row=2, values_only=True):
                    r = [str(x) if x is not None else "" for x in row]
                    while len(r) < 10: r.append("")
                    if r[0].strip() == "": continue
                    try:
                        cursor.execute('''
                            INSERT OR REPLACE INTO encargados
                            (nombre, identificacion, lugar_expedicion, fecha_expedicion, direccion,
                             lineas_wom, lineas_etb, correo, mensaje, color)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ''', (r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9] or '#39FF14'))
                        encargados_insertados += 1
                    except Exception:
                        pass
            self.conn.commit()
            return {"status": "success", "mensaje": f"Cargados: {registros_insertados} equipos y {encargados_insertados} encargados."}
        except Exception as e:
            return {"status": "error", "mensaje": f"Error interno al cargar: {str(e)}"}

    def exportar_excel(self):
        from datetime import datetime
        try:
            descargas_dir = os.path.join(os.path.expanduser("~"), "Downloads")
            fecha_str = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
            ruta_final = os.path.join(descargas_dir, f"Respaldo_IMEI_{fecha_str}.xlsx")
            wb = openpyxl.Workbook()
            ws_reg = wb.active
            ws_reg.title = "Registros"
            ws_reg.append(["IMEI", "Modelo", "Estado", "Operador", "Cliente", "Razon",
                            "Encargado", "Pago", "PIN Desbloqueo", "Reg WOM", "Reg ETB"])
            for reg in self.obtener_registros():
                ws_reg.append([reg.get(k, '') for k in
                                ['imei','modelo','estado','operador','cliente','razon',
                                 'encargado','pago','pin_desbloqueo','reg_wom','reg_etb']])
            ws_enc = wb.create_sheet(title="Encargados")
            ws_enc.append(["Nombre","Identificacion","Lugar Expedicion","Fecha Expedicion",
                            "Direccion","Lineas WOM","Lineas ETB","Correo","Mensaje","Color"])
            for enc in self.obtener_todos_encargados():
                ws_enc.append([enc.get(k, '') for k in
                                ['nombre','identificacion','lugar_expedicion','fecha_expedicion',
                                 'direccion','lineas_wom','lineas_etb','correo','mensaje','color']])
            wb.save(ruta_final)
            return {"status": "success", "mensaje": "¡Guardado en Descargas!"}
        except Exception as e:
            return {"status": "error", "mensaje": f"Error al exportar: {str(e)}"}

    def cambiar_tema(self, modo):
        try:
            set_dock_icon(modo)
        except Exception:
            pass
        return {"status": "success"}

    def guardar_cliente(self, datos):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO clientes (id, nombre, tipo_id, celular, email, expedicion)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (datos['id'], datos['nombre'], datos['tipo_id'], datos.get('celular', ''),
                  datos.get('email', ''), datos.get('expedicion', '')))
            self.conn.commit()
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def verificar_id_cliente(self, id_cliente):
        try:
            cursor = self.conn.cursor()
            cursor.execute('SELECT nombre FROM clientes WHERE id = ?', (id_cliente,))
            res = cursor.fetchone()
            if res:
                return {"status": "exists", "nombre": res['nombre']}
            return {"status": "available"}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def buscar_cliente(self, query):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                SELECT * FROM clientes 
                WHERE nombre LIKE ? OR id LIKE ?
                LIMIT 5
            ''', (f'%{query}%', f'%{query}%'))
            filas = cursor.fetchall()
            return {"status": "success", "clientes": [dict(f) for f in filas]}
        except Exception as e:
            return {"status": "error", "mensaje": str(e)}

    def obtener_todos_clientes(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute('SELECT * FROM clientes ORDER BY nombre ASC')
            filas = cursor.fetchall()
            return [dict(f) for f in filas]
        except Exception as e:
            print(f"Error en obtener_todos_clientes: {e}")
            return []

    def consultar_modelo_solo(self, imei):
        try:
            import json as _json
            script_path = os.path.join(CONTROLLERS_DIR, "ConsultarModelo.py")
            cmd = [sys.executable, script_path, str(imei), "--headless"]
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


if __name__ == '__main__':
    api = Api()

    if getattr(sys, 'frozen', False):
        application_path = sys._MEIPASS
    else:
        # Raíz del proyecto cuando se corre desde Controllers/
        application_path = PROJECT_ROOT

    ruta_html = os.path.join(VIEWS_HTML, "Dashboard.html")
    if not os.path.exists(ruta_html):
        print(f"[ERROR] No se encontró Dashboard.html en: {ruta_html}")
        sys.exit(1)

    # Iniciar servidor
    puerto_asignado = obtener_puerto_libre()
    print(f"🚀 [SERVER] Iniciando en puerto {puerto_asignado}...")
    
    hilo_servidor = threading.Thread(
        target=iniciar_servidor,
        args=(application_path, puerto_asignado),
        daemon=True
    )
    hilo_servidor.start()
    time.sleep(2) # Dar un poco más de tiempo para el arranque

    # --- INICIO DE APLICACIÓN ---
    ruta_abs = os.path.abspath(ruta_html)
    url_local = "file://" + ruta_abs

    print("\n" + "═"*50)
    print(" 🚀 IMEI MANAGER PRO v2.0 - MODO MVC ACTIVADO")
    print(f" 📂 ARCHIVO: {ruta_abs}")
    print(f" 🌐 API: CONECTANDO...")
    print("═"*50 + "\n")

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
    # Habilitamos debug=True para poder inspeccionar con clic derecho
    webview.start(debug=True)