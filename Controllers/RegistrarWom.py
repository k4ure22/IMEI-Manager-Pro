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
    primer_nombre = sys.argv[4]
    segundo_nombre = sys.argv[5] if sys.argv[5] != "NULL" else ""
    primer_apellido = sys.argv[6]
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
        human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="primerNombre"]'))), primer_nombre)
        
        if segundo_nombre:
            try:
                human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="imeiForm"]/div/div[1]/div[2]//input'))), segundo_nombre)
            except:
                human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="imeiForm"]/div/div[1]/div[2]'))), segundo_nombre)
        
        human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="primerApellido"]'))), primer_apellido)
        
        if segundo_apellido:
            human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="segundoApellido"]'))), segundo_apellido)
        
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
        
        # 5. ESCANEO DE RESPUESTA (Radar WOM)
        inicio_espera = time.time()
        estado_final = "warning"
        mensaje_final = "WOM: Tiempo agotado, verifica si se registró."

        while time.time() - inicio_espera < 40: # Aumentado a 40 segundos
            try:
                # A. Buscar el modal de ERROR
                errores = driver.find_elements(By.ID, "popup-modal-imei-fail")
                if not errores:
                    errores = driver.find_elements(By.XPATH, '//*[contains(@id, "fail")]')
                
                if errores:
                    # Verificar si el error es realmente visible o tiene contenido de error
                    txt_err = errores[0].text.lower()
                    if "no puede" in txt_err or "error" in txt_err or "fail" in txt_err:
                        estado_final = "error"
                        mensaje_final = "WOM: ¡Ups! El IMEI no puede ser Registrado."
                        break
                
                # B. Buscar el modal de ÉXITO (Prioridad al H2 que dijo el usuario)
                # XPath del H2: //*[@id="popup-modal-imei-success"]/div/h2
                h2_exito = driver.find_elements(By.XPATH, '//*[@id="popup-modal-imei-success"]/div/h2')
                if not h2_exito:
                    h2_exito = driver.find_elements(By.XPATH, '//*[contains(text(), "Gracias")]')
                
                if h2_exito:
                    txt_h2 = h2_exito[0].text
                    if "Gracias" in txt_h2 or "¡Gracias!" in txt_h2:
                        estado_final = "success"
                        mensaje_final = "WOM: Registrado exitosamente."
                        break

                # C. Buscar por el ID del modal de éxito directamente
                modal_exito = driver.find_elements(By.ID, "popup-modal-imei-success")
                if modal_exito:
                    estado_final = "success"
                    mensaje_final = "WOM: Registrado exitosamente."
                    break

                # D. Buscar el texto en el P del modal de éxito
                p_exito = driver.find_elements(By.XPATH, '//*[@id="popup-modal-imei-success"]/div/p')
                if p_exito and "exitoso" in p_exito[0].text.lower():
                    estado_final = "success"
                    mensaje_final = "WOM: Registrado exitosamente."
                    break
                
                # E. Respaldo: Texto general en la página (muy amplio)
                texto_body = driver.find_element(By.TAG_NAME, "body").text.lower()
                if "registro exitoso" in texto_body or "registrado con éxito" in texto_body:
                    estado_final = "success"
                    mensaje_final = "WOM: Registrado exitosamente."
                    break

            except:
                pass
            time.sleep(0.7) # Polling ligeramente más lento para no saturar el DOM

        print(json.dumps({"status": estado_final, "mensaje": mensaje_final}))
        time.sleep(6) # Pausa para confirmación visual

    except Exception as e:
        print(json.dumps({"status": "error", "mensaje": "WOM: Error inesperado en la página."}))
        time.sleep(10)
    finally:
        driver.quit()

if __name__ == "__main__":
    main()