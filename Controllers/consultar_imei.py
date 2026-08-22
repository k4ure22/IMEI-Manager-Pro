import sys
import time
import random
import os
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

#INYECCIÓN DE VARIABLES DE ENTORNO PARA MACOS
if sys.platform == "darwin":
    os.environ["PATH"] += os.pathsep + "/opt/homebrew/bin" + os.pathsep + "/usr/local/bin"

# CONFIGURACIÓN
EXCEL_FILE = 'IMEI_MAC.xlsm'
SHEET_NAME = 'IMEI'
URL_CONSULTA = "https://www.imeicolombia.com.co"

#TESSERACT
posibles_rutas = [
    '/opt/homebrew/bin/tesseract',
    '/usr/local/bin/tesseract',
    '/usr/bin/tesseract',
    r'C:\Program Files\Tesseract-OCR\tesseract.exe',
    r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
]
_local_appdata = os.environ.get('LOCALAPPDATA')
if _local_appdata:
    posibles_rutas.append(os.path.join(_local_appdata, 'Tesseract-OCR', 'tesseract.exe'))
    posibles_rutas.append(os.path.join(_local_appdata, 'Programs', 'Tesseract-OCR', 'tesseract.exe'))
ruta_tesseract = next((r for r in posibles_rutas if os.path.exists(r)), shutil.which('tesseract'))
if ruta_tesseract:
    pytesseract.pytesseract.tesseract_cmd = ruta_tesseract
else:
    print("❌ ERROR: Tesseract no encontrado. Instálalo con 'brew install tesseract' en Mac o su instalador en Windows")

class IMEIScraper:
    def __init__(self, headless: bool = False):
        self.driver = self._init_driver(headless=headless)
        self.wait = WebDriverWait(self.driver, 10)
        
        # Rutas absolutas temporales seguras para ejecutables .app
        self.temp_dir = tempfile.gettempdir()
        self.ruta_temp_img = os.path.join(self.temp_dir, "temp_captcha.png")
        self.ruta_proc_img = os.path.join(self.temp_dir, "captcha_procesado.png")

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
        # Limpieza de temporales al cerrar
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

    @staticmethod
    def limpiar_operador(texto):
        texto = texto.upper()
        if "PARTNERS TELECOM" in texto or "WOM" in texto: return "WOM"
        if "COMUNICACIÓN CELULAR" in texto or "COMCEL" in texto or "CLARO" in texto: return "Claro"
        if "TELEFÓNICA" in texto or "MOVISTAR" in texto: return "Movistar"
        if "ETB" in texto: return "ETB"
        if "TIGO" in texto or "COLOMBIA MOVIL" in texto: return "Tigo"
        if "AVANTEL" in texto: return "Avantel"
        return texto.strip().title()

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

    def consultar(self, imei):
        max_retries = 7
        self.driver.get(URL_CONSULTA)
        try:
            input_imei = self.wait.until(EC.presence_of_element_located((By.XPATH, '/html/body/table[1]/tbody/tr[3]/td[2]/form/table/tbody/tr[3]/td[2]/font/input')))
            input_imei.clear()
            self.human_type(input_imei, imei)
        except Exception as e:
            print(f"Error cargando IMEI {imei}: {e}")
            return "Error", "No cargó página/input"

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
                    xpath_operador = '/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td[2]/table/tbody/tr[3]/td/table/tbody/tr[2]/td[2]'
                    WebDriverWait(self.driver, 3).until(EC.presence_of_element_located((By.XPATH, xpath_info)))
                    texto_estado = self.driver.find_element(By.XPATH, xpath_info).text.upper()
                    if "NO SE ENCUENTRA REGISTRADO EN LA BASE DE DATOS NEGATIVA" in texto_estado:
                        return "Libre", ""
                    raw_operador = self.driver.find_element(By.XPATH, xpath_operador).text
                    operador_final = self.limpiar_operador(raw_operador)
                    if "EXTRAVÍO" in texto_estado or "EXTRAVIO" in texto_estado: return "Extravío", operador_final
                    if "ROBO" in texto_estado or "HURTO" in texto_estado: return "Robo/Hurto", operador_final
                    if "NO REGISTRADO" in texto_estado: return "No Registrado", operador_final
                    return "Libre", ""
                except:
                    self._refrescar_captcha()
                    continue
            except Exception:
                self._refrescar_captcha()
        return "Error Consulta", "Falló 7 veces"

    def _check_error_captcha(self):
        try: return self.driver.find_element(By.XPATH, '//*[@id="errorCaptcha"]').is_displayed()
        except: return False

    def _refrescar_captcha(self):
        try:
            self.driver.find_element(By.XPATH, '//*[@id="refresh"]').click()
            time.sleep(1.5)
        except: pass

def main():
    print("--- INICIANDO SCRIPT V8.4 (PRECISION SELECTION) ---")
    
    try:
        wb = xw.books.active
        sheet = wb.sheets[SHEET_NAME]
        app = wb.app
    except Exception as e:
        print(f"❌ Error: No se pudo conectar a Excel. {e}")
        return

    seleccion = app.selection
    filas_seleccionadas = sorted(list(set(cell.row for cell in seleccion if cell.column == 1 and cell.row >= 6)))

    if filas_seleccionadas:
        filas_a_procesar = filas_seleccionadas
        print(f"📂 Modo: Procesando selección ({len(filas_a_procesar)} filas)")
    else:
        print("📂 Modo: Procesar todo (No hay selección válida en columna A)")
        last_row = sheet.range('A' + str(sheet.cells.last_cell.row)).end('up').row
        filas_a_procesar = range(6, last_row + 1)

    scraper = IMEIScraper()
    VERDE = (0, 255, 0)
    ROJO = (255, 0, 0)
    
    try:
        for i in filas_a_procesar:
            imei_val = sheet.range((i, 1)).value
            if not imei_val: continue
            
            imei_str = str(int(imei_val)) if isinstance(imei_val, (int, float)) else str(imei_val).strip()
            razon = str(sheet.range((i, 6)).value or "").lower().strip()
            
            print(f"🔎 Fila {i}: {imei_str} | Razón: {razon}")
            estado, operador = scraper.consultar(imei_str)
            
            sheet.range((i, 3)).value = estado
            sheet.range((i, 4)).value = operador

            if "desbloqueo" in razon:
                sheet.range((i, 1)).color = VERDE if estado == "Libre" else ROJO
            elif "bloqueo" in razon:
                sheet.range((i, 1)).color = VERDE if estado != "Libre" else ROJO
            elif "no registro" in razon:
                if estado == "Libre":
                    sheet.range((i, 1)).color = VERDE
                elif estado == "No Registrado":
                    sheet.range((i, 1)).color = ROJO
            
            print(f"-> {estado} | {operador}")

    except Exception as e:
        print(f"❌ Error en ejecución: {e}")
    finally:
        scraper.close()
        print("--- FINALIZADO ---")

if __name__ == "__main__":
    main()