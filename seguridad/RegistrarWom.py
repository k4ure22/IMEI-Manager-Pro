import sys
import time
import random
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def human_type(element, text):
    """Escritura rápida pero simulando evento de teclado"""
    element.clear()
    for char in str(text):
        element.send_keys(char)
        time.sleep(random.uniform(0.01, 0.04)) # Mucho más rápido

def main():
    if len(sys.argv) < 8:
        print(json.dumps({"status": "error", "mensaje": "Argumentos insuficientes."}))
        return

    imei = sys.argv[1]
    linea_wom = sys.argv[2]
    documento = sys.argv[3]
    primer_nombre = sys.argv[4] if sys.argv[4] != "NULL" else ""
    segundo_nombre = sys.argv[5] if sys.argv[5] != "NULL" else ""
    primer_apellido = sys.argv[6] if sys.argv[6] != "NULL" else ""
    segundo_apellido = sys.argv[7] if sys.argv[7] != "NULL" else ""

    options = Options()
    options.add_experimental_option("detach", True) # Permite mantenerlo abierto
    # options.add_argument('--headless') # Descomenta para modo oculto (sin ventana)
    
    driver = webdriver.Chrome(options=options)
    
    try:
        driver.get("https://movilpt.co/informacion-importante/registra-tu-equipo-imei")
        wait = WebDriverWait(driver, 10)

        # Clic inicial (Cookies)
        try:
            btn_inicial = wait.until(EC.element_to_be_clickable((By.XPATH, '/html/body/div[3]/div/div/button')))
            btn_inicial.click()
            time.sleep(0.5) 
        except: pass

        # Formularios
        if primer_nombre:
            human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="primerNombre"]'))), primer_nombre)
        
        if segundo_nombre:
            try:
                human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="imeiForm"]/div/div[1]/div[2]//input'))), segundo_nombre)
            except:
                human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="imeiForm"]/div/div[1]/div[2]'))), segundo_nombre)
        
        if primer_apellido:
            human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="primerApellido"]'))), primer_apellido)
        
        if segundo_apellido:
            try:
                human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="segundoApellido"]'))), segundo_apellido)
            except:
                pass
        
        select_doc = Select(wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="documentType"]'))))
        select_doc.select_by_visible_text('Cédula de ciudadanía')
        
        human_type(driver.find_element(By.XPATH, '//*[@id="documentNumber"]'), documento)
        human_type(driver.find_element(By.XPATH, '//*[@id="imeiNumber"]'), imei)
        human_type(driver.find_element(By.XPATH, '//*[@id="imeiCelular"]'), linea_wom)
        
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(0.5)
        
        driver.find_element(By.XPATH, '//*[@id="imeiForm"]/div/div[5]/div/div[1]/label/span').click()
        driver.find_element(By.XPATH, '//*[@id="imeiForm"]/div/div[6]/div/div[1]/label/span').click()
        
        # Submit
        driver.find_element(By.XPATH, '//*[@id="imeiForm"]/div/div[7]/div/button').click()
        
       # Submit
        driver.find_element(By.XPATH, '//*[@id="imeiForm"]/div/div[7]/div/button').click()
        
        # 5. ESCANEO RÁPIDO DE RESPUESTA (Radar WOM)
        inicio_espera = time.time()
        estado_final = "warning"
        mensaje_final = "WOM: Tiempo agotado, verifica si se registró."

        while time.time() - inicio_espera < 15:
            try:
                # A. Buscar el modal de error exacto del Jefe
                errores = driver.find_elements(By.XPATH, '//*[@id="popup-modal-imei-fail"]/div')
                if errores and errores[0].is_displayed():
                    estado_final = "error"
                    mensaje_final = "WOM: ¡Ups! El IMEI no puede ser Registrado."
                    break
                
                # B. Buscar confirmación de éxito en toda la página
                texto_pagina = driver.find_element(By.TAG_NAME, 'body').text.lower()
                if "exitoso" in texto_pagina or "registrado con éxito" in texto_pagina or "exitosamente" in texto_pagina or "registro exitoso" in texto_pagina:
                    estado_final = "success"
                    mensaje_final = "WOM: Registrado exitosamente."
                    break
            except:
                pass
            time.sleep(0.5) # Escanea 2 veces por segundo

        print(json.dumps({"status": estado_final, "mensaje": mensaje_final}))
        time.sleep(6) # Pausa para confirmación visual

    except Exception as e:
        print(json.dumps({"status": "error", "mensaje": "WOM: Error inesperado en la página."}))
        time.sleep(10)
    finally:
        driver.quit()

if __name__ == "__main__":
    main()