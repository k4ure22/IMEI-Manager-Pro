import sys
import os

if sys.platform == "win32":
    if hasattr(sys.stdout, 'reconfigure'):
        try: sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        except Exception: pass
    if hasattr(sys.stderr, 'reconfigure'):
        try: sys.stderr.reconfigure(encoding='utf-8', errors='replace')
        except Exception: pass

import math
import json
import time
import random
import ssl
import uuid
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

ssl._create_default_https_context = ssl._create_unverified_context


def log(msg):
    print(f"[DEBUG] {msg}", file=sys.stderr, flush=True)

def get_chromedriver_path():
    """Busca chromedriver: primero junto al ejecutable, luego descarga."""
    bin_name = 'chromedriver.exe' if sys.platform.startswith('win') else 'chromedriver'
    if getattr(sys, 'frozen', False):
        base = os.path.dirname(sys.executable)
        for candidate in [
            os.path.join(base, bin_name),
            os.path.join(base, '..', 'Resources', bin_name),
            os.path.join(sys._MEIPASS, bin_name),
        ]:
            candidate = os.path.normpath(candidate)
            if os.path.isfile(candidate):
                if sys.platform != "win32":
                    try:
                        os.chmod(candidate, 0o755)
                    except Exception:
                        pass
                return candidate

    local = os.path.join(os.path.dirname(os.path.abspath(__file__)), bin_name)
    if os.path.isfile(local):
        if sys.platform != "win32":
            try:
                os.chmod(local, 0o755)
            except Exception:
                pass
        return local

    from webdriver_manager.chrome import ChromeDriverManager
    return ChromeDriverManager().install()


def crear_driver(headless: bool = False):
    options = webdriver.ChromeOptions()
    if headless:
        options.add_argument("--headless=new")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                         "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.page_load_strategy = 'eager'

    driver_path = get_chromedriver_path()
    log(f"Usando chromedriver: {driver_path}")

    driver = webdriver.Chrome(service=Service(driver_path), options=options)
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    })
    return driver, WebDriverWait(driver, 10)

def consultar_modelos(imeis, headless: bool = False):
    log("Iniciando Chrome con Stealth...")
    driver, wait = crear_driver(headless=headless)

    # Crear directorio temporal para los pantallazos en la misma ruta del script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    temp_dir = os.path.join(base_dir, 'temp_screenshots')
    os.makedirs(temp_dir, exist_ok=True)

    try:
        log("Navegando a movical.net...")
        driver.get("https://www.movical.net")
        input_field = wait.until(EC.element_to_be_clickable((By.ID, "searchomeinput")))
        log("Input listo")

        for imei in imeis:
            # Añadimos la clave pantallazo vacía por defecto
            resultado = {"imei": imei, "modelo": "", "pantallazo": ""}
            try:
                log(f"Consultando: {imei}")
                
                input_field = wait.until(EC.element_to_be_clickable((By.ID, "searchomeinput")))
                input_field.clear()
                
                # Ingresar el IMEI lo más rápido posible
                input_field.send_keys(str(imei))

                try:
                    # Esperar máximo 3.5 segundos para la opción rápida
                    fast_wait = WebDriverWait(driver, 3.5)
                    opcion_modelo = fast_wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "li.ui-menu-item a")))
                    resultado["modelo"] = opcion_modelo.text.strip()
                    log(f"-> (Rápido) {resultado['modelo']}")
                    
                    # ─── CAPTURA DE PANTALLA ───
                    screenshot_name = f"modelo_{imei}_{uuid.uuid4().hex[:6]}.png"
                    screenshot_path = os.path.join(temp_dir, screenshot_name)
                    driver.save_screenshot(screenshot_path)
                    resultado["pantallazo"] = screenshot_path
                    
                    driver.get("https://www.movical.net")
                except:
                    log("No se encontró rápido, registrando como Error.")
                    resultado["modelo"] = "Error"
                    driver.get("https://www.movical.net")

            except Exception as e:
                log(f"Error: {e}")
                resultado["modelo"] = "Error"
                try:
                    driver.get("https://www.movical.net")
                    wait.until(EC.element_to_be_clickable((By.ID, "searchomeinput")))
                except:
                    pass

            print(json.dumps(resultado), flush=True)

    finally:
        try:
            driver.quit()
        except:
            pass
        log("Chrome cerrado")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No se proporcionaron IMEIs"}), flush=True)
        sys.exit(1)

    headless = ("--headless" in sys.argv)
    imeis = [a for a in sys.argv[1:] if a != "--headless"]
    log(f"IMEIs: {imeis}")
    consultar_modelos(imeis, headless=headless)
    log("Fin")