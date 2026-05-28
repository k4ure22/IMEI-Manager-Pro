import sys
import os
import math
import json
import time
import random
import ssl
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

ssl._create_default_https_context = ssl._create_unverified_context


def log(msg):
    print(f"[DEBUG] {msg}", file=sys.stderr, flush=True)


def crear_driver(headless: bool = False):
    options = webdriver.ChromeOptions()
    # Modo invisible (headless)
    if headless:
        options.add_argument("--headless=new")
    
    # Ocultar que es un bot
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36")
    options.add_argument("--window-size=1920,1080")
    
    # Estrategia de carga para no esperar a que toda la página (imágenes, etc.) cargue
    options.page_load_strategy = 'eager'
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    # Inyectar script para ocultar webdriver
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    })
    
    wait = WebDriverWait(driver, 10)
    return driver, wait


def consultar_modelos(imeis, headless: bool = False):
    log("Iniciando Chrome con Stealth...")
    driver, wait = crear_driver(headless=headless)

    try:
        log("Navegando a movical.net...")
        driver.get("https://www.movical.net")
        input_field = wait.until(EC.element_to_be_clickable((By.ID, "searchomeinput")))
        log("Input listo")

        for imei in imeis:
            resultado = {"imei": imei, "modelo": ""}
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