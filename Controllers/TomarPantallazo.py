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
    print("⚠️ AVISO: Tesseract no encontrado en rutas estándar. Si usas consultas de IMEI, instálalo en Windows (https://github.com/UB-Mannheim/tesseract/wiki) o en Mac ('brew install tesseract').")
def generar_acronimo(texto):
    if not texto: return "DESC" 
    palabras = str(texto).split()
    return "".join([p[0].upper() for p in palabras if p])
class IMEIScraper:
    def __init__(self, headless: bool = False):
        self.driver = self._init_driver(headless=headless)
        self.wait = WebDriverWait(self.driver, 10)
        
        # Rutas absolutas temporales seguras para ejecutables .app
        self.temp_dir = tempfile.gettempdir()
        self.ruta_temp_img = os.path.join(self.temp_dir, "temp_captcha_pant.png")
        self.ruta_proc_img = os.path.join(self.temp_dir, "captcha_procesado_pant.png")
    def _init_driver(self, headless: bool = False):
        options = webdriver.ChromeOptions()
        if headless:
            options.add_argument("--headless=new")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36")
        options.add_argument("--window-size=1920,1080")
        return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
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
    def preprocesar_captcha(self, ruta_img):
        img = cv2.imread(ruta_img)
        if img is None: return None
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        mask = cv2.bitwise_or(cv2.inRange(hsv, np.array([0, 100, 100]), np.array([10, 255, 255])),
                            cv2.inRange(hsv, np.array([160, 100, 100]), np.array([180, 255, 255])))
        resultado = cv2.bitwise_not(mask)
        cv2.imwrite(self.ruta_proc_img, resultado)
        return self.ruta_proc_img
    def resolver_captcha(self):
        try:
            captcha_el = self.wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="captcha"]')))
            captcha_el.screenshot(self.ruta_temp_img)
            procesada_path = self.preprocesar_captcha(self.ruta_temp_img)
            if not procesada_path: return ""
            txt_cap = pytesseract.image_to_string(Image.open(procesada_path),
                                                config='--psm 7 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789').strip()
            return "".join(filter(str.isalnum, txt_cap))
        except Exception as e:
            print(f"Error resolviendo captcha: {e}")
            return ""
    def consultar_y_capturar(self, imei, ruta_guardado):
        max_retries = 7
        self.driver.get(URL_CONSULTA)
        try:
            input_imei = self.wait.until(EC.presence_of_element_located((By.XPATH, '/html/body/table[1]/tbody/tr[3]/td[2]/form/table/tbody/tr[3]/td[2]/font/input')))
            input_imei.clear()
            self.human_type(input_imei, imei)
        except Exception as e:
            print(f"Error cargando IMEI {imei}: {e}")
            return False
        for intento in range(max_retries):
            try:
                txt_cap = self.resolver_captcha()
                if not txt_cap:
                    self._refrescar_captcha()
                    continue
                
                input_cap = self.driver.find_element(By.XPATH, '//*[@id="txtInput"]')
                input_cap.clear()
                input_cap.send_keys(txt_cap)
                self.driver.find_element(By.XPATH, '/html/body/table[1]/tbody/tr[3]/td[2]/form/table/tbody/tr[7]/td[2]/a').click()
                time.sleep(1.5)
                
                if self._check_error_captcha():
                    self._refrescar_captcha()
                    continue
                
                try:
                    xpath_info = '/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td[2]/table/tbody/tr[3]/td/table/tbody/tr[2]/td[1]'
                    WebDriverWait(self.driver, 4).until(EC.presence_of_element_located((By.XPATH, xpath_info)))
                    
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
                    
                except Exception as e:
                    self._refrescar_captcha()
                    continue
            except Exception:
                self._refrescar_captcha()
        
        print("Falló 7 veces intentando resolver el captcha.")
        return False
    def _check_error_captcha(self):
        try: return self.driver.find_element(By.XPATH, '//*[@id="errorCaptcha"]').is_displayed()
        except: return False
    def _refrescar_captcha(self):
        try:
            self.driver.find_element(By.XPATH, '//*[@id="refresh"]').click()
            time.sleep(1.5)
        except: pass
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
        print(f"❌ Error: No se pudo conectar a Excel. Asegúrate de tenerlo abierto. Detalles: {e}")
        return
    celda_activa = app.selection
    fila = celda_activa.row
    
    imei_val = sheet.range((fila, 1)).value
    COLUMNA_MODELO = 2 
    modelo_val = sheet.range((fila, COLUMNA_MODELO)).value
    
    if not imei_val:
        print("❌ Error: La celda del IMEI está vacía.")
        return
        
    imei_str = str(int(imei_val)) if isinstance(imei_val, (int, float)) else str(imei_val).strip()
    acronimo = generar_acronimo(modelo_val)
    nombre_archivo = f"{imei_str}_{acronimo}.png"
    ruta_guardado = os.path.join(pantallazos_dir, nombre_archivo)
    print(f"🔎 Procesando IMEI: {imei_str} | Modelo: {modelo_val} ({acronimo})")
    print(f"📂 El pantallazo se guardará en: {ruta_guardado}")
    scraper = IMEIScraper()
    
    try:
        exito = scraper.consultar_y_capturar(imei_str, ruta_guardado)
        if exito:
            print(f"✅ Pantallazo guardado exitosamente: {nombre_archivo}")
        else:
            print(f"❌ No se pudo capturar el pantallazo para el IMEI {imei_str}")
    except Exception as e:
        print(f"❌ Error en ejecución: {e}")
    finally:
        scraper.close()
            
    print("--- FINALIZADO ---")
if __name__ == "__main__":
    main()