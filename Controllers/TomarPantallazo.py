import sys
import os

if sys.platform == "win32":
    if hasattr(sys.stdout, 'reconfigure'):
        try: sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        except Exception: pass
    if hasattr(sys.stderr, 'reconfigure'):
        try: sys.stderr.reconfigure(encoding='utf-8', errors='replace')
        except Exception: pass

import time
import random
import shutil
import cv2
import pytesseract
import numpy as np
import xlwings as xw
import tempfile
from PIL import Image
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
# --- INYECCIÓN DE VARIABLES DE ENTORNO PARA MACOS (.app) ---
if sys.platform == "darwin":
    os.environ["PATH"] += os.pathsep + "/opt/homebrew/bin" + os.pathsep + "/usr/local/bin"
# --- CONFIGURACIÓN ---
EXCEL_FILE = 'IMEI_MAC.xlsm'
SHEET_NAME = 'IMEI'
URL_CONSULTA = "https://www.imeicolombia.com.co"
# --- CONFIGURACIÓN TESSERACT ---
posibles_rutas = [
    '/opt/homebrew/bin/tesseract', 
    '/usr/local/bin/tesseract', 
    '/usr/bin/tesseract',
    r'C:\Program Files\Tesseract-OCR\tesseract.exe',
    r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
    r'C:\Tesseract-OCR\tesseract.exe',
]
_app_base = os.path.dirname(sys.executable) if getattr(sys, 'frozen', False) else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
posibles_rutas.append(os.path.join(_app_base, 'Tesseract-OCR', 'tesseract.exe'))
posibles_rutas.append(os.path.join(_app_base, 'tesseract', 'tesseract.exe'))
if hasattr(sys, '_MEIPASS'):
    posibles_rutas.append(os.path.join(sys._MEIPASS, 'Tesseract-OCR', 'tesseract.exe'))
_local_appdata = os.environ.get('LOCALAPPDATA')
if _local_appdata:
    posibles_rutas.append(os.path.join(_local_appdata, 'Tesseract-OCR', 'tesseract.exe'))
    posibles_rutas.append(os.path.join(_local_appdata, 'Programs', 'Tesseract-OCR', 'tesseract.exe'))
_user_profile = os.environ.get('USERPROFILE')
if _user_profile:
    posibles_rutas.append(os.path.join(_user_profile, 'AppData', 'Local', 'Programs', 'Tesseract-OCR', 'tesseract.exe'))
    posibles_rutas.append(os.path.join(_user_profile, 'AppData', 'Local', 'Tesseract-OCR', 'tesseract.exe'))
ruta_tesseract = next((r for r in posibles_rutas if os.path.exists(r)), shutil.which('tesseract'))
if ruta_tesseract:
    pytesseract.pytesseract.tesseract_cmd = ruta_tesseract
else:
    print("[WARN] AVISO: Tesseract no encontrado en rutas estándar. Si usas consultas de IMEI, instálalo en Windows (https://github.com/UB-Mannheim/tesseract/wiki) o en Mac ('brew install tesseract').")
def generar_acronimo(texto):
    if not texto: return "DESC" 
    palabras = str(texto).split()
    return "".join([p[0].upper() for p in palabras if p])
class IMEIScraper:
    _cached_driver_path = None  # Cache del chromedriver para evitar verificación de red

    def __init__(self, headless: bool = False):
        self.headless = headless
        self.driver = self._init_driver(headless=headless)
        self.wait = WebDriverWait(self.driver, 10)
        
        # Rutas absolutas temporales seguras para ejecutables .app
        self.temp_dir = tempfile.gettempdir()
        self.ruta_temp_img = os.path.join(self.temp_dir, "temp_captcha_pant.png")
        self.ruta_proc_img = os.path.join(self.temp_dir, "captcha_procesado_pant.png")

    @classmethod
    def _get_driver_path(cls):
        """Obtiene el path del chromedriver, usando caché para evitar verificación de red repetida."""
        if cls._cached_driver_path and os.path.exists(cls._cached_driver_path):
            return cls._cached_driver_path
        os.environ['WDM_LOG'] = '0'
        os.environ['WDM_LOG_LEVEL'] = '0'
        cls._cached_driver_path = ChromeDriverManager().install()
        return cls._cached_driver_path

    def _init_driver(self, headless: bool = False):
        options = webdriver.ChromeOptions()
        if headless:
            options.add_argument("--headless=new")
        else:
            options.add_argument("--start-maximized")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36")
        options.add_argument("--window-size=1920,1080")
        # Flags de rendimiento para arranque más rápido
        options.add_argument("--disable-extensions")
        options.add_argument("--no-first-run")
        options.add_argument("--no-default-browser-check")
        options.add_argument("--disable-default-apps")
        options.add_argument("--disable-popup-blocking")
        options.add_argument("--dns-prefetch-disable")
        options.add_argument("--disable-dev-shm-usage")
        options.page_load_strategy = 'eager'  # No esperar a que carguen todos los recursos
        driver = webdriver.Chrome(service=Service(self._get_driver_path()), options=options)
        if not headless:
            try:
                driver.maximize_window()
            except Exception:
                pass
            if sys.platform == "darwin":
                try:
                    import subprocess
                    subprocess.run(["osascript", "-e", 'tell application "Google Chrome" to activate'], check=False)
                except Exception:
                    pass
        return driver
    def close(self):
        if self.driver:
            self.driver.quit()
        # Limpieza de temporales
        for path in [self.ruta_temp_img, self.ruta_proc_img]:
            if os.path.exists(path):
                try: os.remove(path)
                except: pass
    @staticmethod
    def human_type(element, text):
        for char in text:
            element.send_keys(char)
            time.sleep(random.uniform(0.005, 0.03))
    # ── Estrategias de preprocesamiento de CAPTCHA (multi-pipeline) ──────

    @staticmethod
    # ── Estrategias de preprocesamiento de CAPTCHA (multi-pipeline de alta precisión) ──────

    @staticmethod
    def _captcha_strategy_threshold_median(img, thresh=105):
        """Umbralización óptima para eliminar líneas finas (~136) preservando texto (~52)."""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, th = cv2.threshold(gray, thresh, 255, cv2.THRESH_BINARY)
        med = cv2.medianBlur(th, 3)
        padded = cv2.copyMakeBorder(med, 14, 14, 16, 16, cv2.BORDER_CONSTANT, value=255)
        h, w = padded.shape
        return cv2.resize(padded, (w * 3, h * 3), interpolation=cv2.INTER_CUBIC)

    @staticmethod
    def _captcha_strategy_bilateral(img, thresh=110):
        """Filtro bilateral para reducir ruido manteniendo bordes definidos de letras como 6 y 9."""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        bilat = cv2.bilateralFilter(gray, 5, 45, 45)
        _, th = cv2.threshold(bilat, thresh, 255, cv2.THRESH_BINARY)
        padded = cv2.copyMakeBorder(th, 14, 14, 16, 16, cv2.BORDER_CONSTANT, value=255)
        h, w = padded.shape
        return cv2.resize(padded, (w * 3, h * 3), interpolation=cv2.INTER_CUBIC)

    @staticmethod
    def _captcha_strategy_connected_components(img, thresh=115):
        """Elimina ruido aislado de baja área por componentes conectados."""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, binary = cv2.threshold(gray, thresh, 255, cv2.THRESH_BINARY_INV)
        num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(binary)
        clean_inv = np.zeros_like(binary)
        for i in range(1, num_labels):
            area = stats[i, cv2.CC_STAT_AREA]
            w = stats[i, cv2.CC_STAT_WIDTH]
            h = stats[i, cv2.CC_STAT_HEIGHT]
            if area > 24 and (w > 3 or h > 6):
                clean_inv[labels == i] = 255
        clean = cv2.bitwise_not(clean_inv)
        padded = cv2.copyMakeBorder(clean, 14, 14, 16, 16, cv2.BORDER_CONSTANT, value=255)
        h, w = padded.shape
        return cv2.resize(padded, (w * 3, h * 3), interpolation=cv2.INTER_CUBIC)

    def preprocesar_captcha(self, ruta_img):
        """Preprocesamiento (respaldo)."""
        img = cv2.imread(ruta_img)
        if img is None: return None
        return self._captcha_strategy_threshold_median(img, 105)

    def _obtener_imagen_captcha(self):
        """
        Obtiene la imagen del captcha como array cv2 directamente en memoria.
        Retorna None si no se encuentra, o 'ALTERADA' si no hay captcha.
        """
        import base64 as _b64
        try:
            captcha_el = self.wait.until(EC.presence_of_element_located(
                (By.XPATH, '//*[@id="contenido"]/app-consulta-imei/section[1]/div[3]/div[2]/div/form/div[2]/div/img')))
        except Exception:
            try:
                captcha_el = self.driver.find_element(By.CSS_SELECTOR, "img.captcha__imagen")
            except Exception:
                try:
                    captcha_el = self.driver.find_element(By.XPATH, '//*[@id="captcha"]')
                except Exception:
                    return "ALTERADA"

        # Esperar que la imagen tenga datos válidos
        src = None
        for _ in range(5):
            src = captcha_el.get_attribute("src")
            if src and (src.startswith("data:image") and len(src) > 100):
                break
            time.sleep(0.15)

        if src and src.startswith("data:image"):
            try:
                raw_data = _b64.b64decode(src.split(",", 1)[1])
                nparr = np.frombuffer(raw_data, np.uint8)
                return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            except Exception:
                pass

        # Fallback: screenshot del elemento
        try:
            captcha_el.screenshot(self.ruta_temp_img)
            return cv2.imread(self.ruta_temp_img)
        except Exception:
            return None

    def resolver_captcha(self):
        """
        Resuelve el captcha usando múltiples estrategias óptimas y votación por consenso.
        Garantiza devolver una predicción limpia de 5 caracteres reparada si es necesario.
        """
        try:
            img = self._obtener_imagen_captcha()
            if img is None:
                return ""
            if isinstance(img, str) and img == "ALTERADA":
                return "ALTERADA_NO_CAPTCHA"

            pipelines = [
                lambda i: self._captcha_strategy_threshold_median(i, 105),
                lambda i: self._captcha_strategy_threshold_median(i, 95),
                lambda i: self._captcha_strategy_bilateral(i, 110),
                lambda i: self._captcha_strategy_connected_components(i, 115),
            ]

            configs = [
                '--psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                '--psm 7 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            ]

            exact_5 = []
            other_cands = []

            for p_fn in pipelines:
                try:
                    proc = p_fn(img)
                    pil_img = Image.fromarray(proc)
                    for cfg in configs:
                        raw = pytesseract.image_to_string(pil_img, config=cfg)
                        cleaned = "".join(filter(str.isalnum, raw)).upper()
                        if len(cleaned) == 5:
                            exact_5.append(cleaned)
                        elif cleaned:
                            other_cands.append(cleaned)
                except Exception:
                    continue

            # Consenso por mayoría de votos si hay lecturas de 5 caracteres
            if exact_5:
                from collections import Counter
                return Counter(exact_5).most_common(1)[0][0]

            # Reparación inteligente de candidatos (por ejemplo, ruido residual de 6 caracteres)
            def _repair(c):
                if len(c) == 6:
                    if c[0] in ('I', '1', 'L', 'J'): return c[1:]
                    if c[-1] in ('I', '1', 'L', 'J'): return c[:5]
                    for idx in range(len(c)):
                        if c[idx] in ('I', '1') and idx > 0 and c[idx-1] in ('M', 'W', 'H', 'B', '9', '8'):
                            return c[:idx] + c[idx+1:]
                    return c[:5]
                if len(c) > 6:
                    return c[:5]
                return c

            repaired = [_repair(c) for c in other_cands if len(_repair(c)) == 5]
            if repaired:
                from collections import Counter
                return Counter(repaired).most_common(1)[0][0]

            if other_cands:
                other_cands.sort(key=lambda x: abs(len(x) - 5))
                return _repair(other_cands[0])

            return ""
        except Exception as e:
            print(f"Error resolviendo captcha: {e}")
            return ""

    def consultar_y_capturar(self, imei, ruta_guardado):
        if str(imei).strip().upper() in ("ALTERADA", "TEST_ALTERADA", "TEST"):
            return "Pagina Alterada", "IMEI Colombia", "Simulación de prueba: la estructura de la página IMEI Colombia ha sido modificada."

        max_retries = 12
        self.driver.get(URL_CONSULTA)
        if not self.headless and sys.platform == "darwin":
            try:
                import subprocess
                subprocess.run(["osascript", "-e", 'tell application "Google Chrome" to activate'], check=False)
            except Exception:
                pass
        try:
            try:
                input_imei = self.wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="imei"]')))
            except Exception:
                input_imei = self.wait.until(EC.presence_of_element_located((By.XPATH, '/html/body/table[1]/tbody/tr[3]/td[2]/form/table/tbody/tr[3]/td[2]/font/input')))
            input_imei.clear()
            self.human_type(input_imei, str(imei))
        except Exception as e:
            print(f"Error cargando IMEI {imei}: {e}")
            return False

        for intento in range(max_retries):
            try:
                txt_cap = self.resolver_captcha()

                # Si no se leyó nada o es demasiado corto, refrescar hasta 2 veces antes de forzar intento
                if len(txt_cap) < 4 and intento < 2:
                    self._refrescar_captcha()
                    continue

                # Ajustar longitud si vino con 6 o 4 caracteres en reintentos
                if len(txt_cap) > 5:
                    txt_cap = txt_cap[:5]
                elif len(txt_cap) == 4 and intento < 1:
                    self._refrescar_captcha()
                    continue

                # ¡SIEMPRE intentar enviar! Nunca abortar la consulta sin haber intentado resolver
                try:
                    input_cap = self.driver.find_element(By.XPATH, '//*[@id="captchaRespuesta"]')
                except Exception:
                    input_cap = self.driver.find_element(By.XPATH, '//*[@id="txtInput"]')
                input_cap.clear()
                input_cap.send_keys(txt_cap)

                try:
                    btn_consultar = self.driver.find_element(By.XPATH, '//*[@id="contenido"]/app-consulta-imei/section[1]/div[3]/div[2]/div/form/button')
                except Exception:
                    try:
                        btn_consultar = self.driver.find_element(By.CSS_SELECTOR, "form button[type='submit']")
                    except Exception:
                        btn_consultar = self.driver.find_element(By.XPATH, '/html/body/table[1]/tbody/tr[3]/td[2]/form/table/tbody/tr[7]/td[2]/a')
                btn_consultar.click()

                # Espera activa del modal dialog (optimizada)
                dialog = None
                for _ in range(10):
                    time.sleep(0.15)
                    try:
                        d = self.driver.find_element(By.XPATH, '//*[@id="contenido"]/app-consulta-imei/dialog')
                        if d.get_attribute("open") is not None or "open" in d.get_attribute("outerHTML"):
                            dialog = d
                            break
                    except Exception:
                        pass

                try:
                    dialog = self.driver.find_element(By.XPATH, '//*[@id="contenido"]/app-consulta-imei/dialog')
                except Exception:
                    dialog = None

                if dialog and (dialog.get_attribute("open") is not None or "open" in dialog.get_attribute("outerHTML")):
                    try:
                        dialog.screenshot(ruta_guardado)
                    except Exception:
                        try:
                            panel = dialog.find_element(By.CSS_SELECTOR, ".dialogo__panel")
                            panel.screenshot(ruta_guardado)
                        except Exception:
                            self.driver.save_screenshot(ruta_guardado)
                    return True

                # Fallback interfaz antigua
                try:
                    xpath_info = '/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td[2]/table/tbody/tr[3]/td/table/tbody/tr[2]/td[1]'
                    WebDriverWait(self.driver, 2).until(EC.presence_of_element_located((By.XPATH, xpath_info)))
                    try:
                        tabla_box = self.driver.find_element(By.XPATH, '/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td[2]/table')
                        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", tabla_box)
                        time.sleep(0.3)
                        tabla_box.screenshot(ruta_guardado)
                    except Exception:
                        tabla_resultados = self.driver.find_element(By.XPATH, '/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td[2]/table/tbody/tr[3]')
                        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", tabla_resultados)
                        time.sleep(0.3)
                        tabla_resultados.screenshot(ruta_guardado)
                    return True
                except Exception:
                    pass

                self._refrescar_captcha()
                continue
            except Exception:
                self._refrescar_captcha()

        print("Falló intentando resolver el captcha.")
        return False

    def _check_error_captcha(self):
        try:
            form_text = self.driver.find_element(By.CSS_SELECTOR, "form").text
            return "Ocurrió un error" in form_text or "Escriba los caracteres" in form_text
        except:
            return False

    def _refrescar_captcha(self):
        """Refresca el captcha y espera inteligentemente a que la nueva imagen cargue."""
        try:
            old_src = ""
            for xpath in [
                '//*[@id="contenido"]/app-consulta-imei/section[1]/div[3]/div[2]/div/form/div[2]/div/img',
                '//img[contains(@class,"captcha")]',
                '//*[@id="captcha"]'
            ]:
                try:
                    img_el = self.driver.find_element(By.XPATH, xpath)
                    old_src = (img_el.get_attribute("src") or "")[:80]
                    if old_src: break
                except Exception:
                    pass

            # Clic en botón de recarga
            for sel, by_type in [
                ("button.captcha__recargar", By.CSS_SELECTOR),
                ('//*[@id="contenido"]/app-consulta-imei/section[1]/div[3]/div[2]/div/form/div[2]/div/button', By.XPATH),
                ('//button[contains(@class,"recargar")]', By.XPATH),
                ('//*[@id="refresh"]', By.XPATH)
            ]:
                try:
                    self.driver.find_element(by_type, sel).click()
                    break
                except Exception:
                    pass

            # Espera activa: polling rápido hasta que src cambie
            if old_src:
                for _ in range(30):  # 30 × 50ms = 1.5s máx
                    time.sleep(0.05)
                    for xpath in [
                        '//*[@id="contenido"]/app-consulta-imei/section[1]/div[3]/div[2]/div/form/div[2]/div/img',
                        '//img[contains(@class,"captcha")]',
                        '//*[@id="captcha"]'
                    ]:
                        try:
                            new_src = (self.driver.find_element(By.XPATH, xpath).get_attribute("src") or "")[:80]
                            if new_src and new_src != old_src and len(new_src) > 40:
                                return
                        except Exception:
                            pass
            else:
                time.sleep(0.35)
        except Exception:
            time.sleep(0.25)
def main():
    print("--- INICIANDO CAPTURA DE PANTALLAZO ---")
    
    try:
        wb = xw.books.active
        sheet = wb.sheets[SHEET_NAME]
        app = wb.app
        
        excel_path = wb.fullname
        base_dir = os.path.dirname(excel_path)
        pantallazos_dir = os.path.join(base_dir, "pantallazos")
        os.makedirs(pantallazos_dir, exist_ok=True)
        
    except Exception as e:
        print(f"[ERROR] Error: No se pudo conectar a Excel. Asegúrate de tenerlo abierto. Detalles: {e}")
        return
    celda_activa = app.selection
    fila = celda_activa.row
    
    imei_val = sheet.range((fila, 1)).value
    COLUMNA_MODELO = 2 
    modelo_val = sheet.range((fila, COLUMNA_MODELO)).value
    
    if not imei_val:
        print("[ERROR] Error: La celda del IMEI está vacía.")
        return
        
    imei_str = str(int(imei_val)) if isinstance(imei_val, (int, float)) else str(imei_val).strip()
    acronimo = generar_acronimo(modelo_val)
    nombre_archivo = f"{imei_str}_{acronimo}.png"
    ruta_guardado = os.path.join(pantallazos_dir, nombre_archivo)
    print(f"[PROCESO] Procesando IMEI: {imei_str} | Modelo: {modelo_val} ({acronimo})")
    print(f"[RUTA] El pantallazo se guardará en: {ruta_guardado}")
    scraper = IMEIScraper()
    
    try:
        exito = scraper.consultar_y_capturar(imei_str, ruta_guardado)
        if exito:
            try:
                from EstilizadorPantallazo import crear_pantallazo_profesional
                crear_pantallazo_profesional(ruta_guardado, {
                    "imei": imei_str,
                    "modelo": str(modelo_val or ""),
                    "estado": "Libre",
                    "operador": ""
                }, ruta_guardado)
            except Exception as est_err:
                print(f"[WARN] Error al estilizar pantallazo profesional: {est_err}")
            print(f"[OK] Pantallazo guardado exitosamente: {nombre_archivo}")
        else:
            print(f"[ERROR] No se pudo capturar el pantallazo para el IMEI {imei_str}")
    except Exception as e:
        print(f"[ERROR] Error en ejecución: {e}")
    finally:
        scraper.close()
            
    print("--- FINALIZADO ---")
if __name__ == "__main__":
    main()