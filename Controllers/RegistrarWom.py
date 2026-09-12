import os
import sys

if sys.platform == "win32":
    if hasattr(sys.stdout, 'reconfigure'):
        try: sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        except Exception: pass
    if hasattr(sys.stderr, 'reconfigure'):
        try: sys.stderr.reconfigure(encoding='utf-8', errors='replace')
        except Exception: pass

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
    """Escritura rápida pero simulando evento de teclado humano"""
    element.clear()
    for char in str(text):
        element.send_keys(char)
        time.sleep(random.uniform(0.01, 0.04))

def main():
    if len(sys.argv) < 8:
        print(json.dumps({"status": "error", "mensaje": "Argumentos insuficientes."}))
        return

    imei = sys.argv[1]
    linea_wom = sys.argv[2]
    documento = sys.argv[3]
    primer_nombre = sys.argv[4]
    segundo_nombre = sys.argv[5] if sys.argv[5] not in ["None", "NULL"] else ""
    primer_apellido = sys.argv[6]
    segundo_apellido = sys.argv[7] if sys.argv[7] not in ["None", "NULL"] else ""

    ruta_pantallazo = sys.argv[8] if len(sys.argv) >= 9 else None
    opciones_pantallazo = {}
    if len(sys.argv) >= 10:
        try:
            opciones_pantallazo = json.loads(sys.argv[9])
        except Exception:
            pass

    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-popup-blocking")

    driver = None
    estado_final = "error"
    mensaje_final = "WOM: Error inesperado en la página."

    try:
        driver = webdriver.Chrome(options=options)
        driver.get("https://movilpt.co/informacion-importante/registra-tu-equipo-imei")
        wait = WebDriverWait(driver, 10)

        # 1. Clic inicial (Permitir Cookies)
        try:
            btn_inicial = wait.until(EC.element_to_be_clickable((
                By.XPATH, '/html/body/div[3]/div/div/button | //button[contains(@class, "action-accept") or contains(text(), "Aceptar") or contains(text(), "ACEPTAR") or contains(text(), "Permitir") or contains(@id, "btn-cookie") or contains(@id, "cookie")] | //*[@id="notice-cookie-block"]//button | //*[@id="btn-accept-cookie"]'
            )))
            btn_inicial.click()
            time.sleep(0.5) 
        except Exception:
            pass

        # 2. Formularios (Secuencia original con human_type)
        human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="primerNombre"]'))), primer_nombre)
        
        if segundo_nombre:
            try:
                human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="segundoNombre"] | //*[@id="imeiForm"]/div/div[1]/div[2]//input'))), segundo_nombre)
            except Exception:
                try:
                    human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="imeiForm"]/div/div[1]/div[2]'))), segundo_nombre)
                except Exception:
                    pass
        
        human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="primerApellido"]'))), primer_apellido)
        
        if segundo_apellido:
            try:
                human_type(wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="segundoApellido"]'))), segundo_apellido)
            except Exception:
                pass
        
        try:
            select_doc = Select(wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="documentType"]'))))
            select_doc.select_by_visible_text('Cédula de ciudadanía')
        except Exception:
            try:
                select_doc = Select(driver.find_element(By.XPATH, '//*[@id="documentType"]'))
                select_doc.select_by_value('CC')
            except Exception:
                pass

        human_type(driver.find_element(By.XPATH, '//*[@id="documentNumber"]'), documento)
        human_type(driver.find_element(By.XPATH, '//*[@id="imeiNumber"]'), imei)
        human_type(driver.find_element(By.XPATH, '//*[@id="imeiCelular"]'), linea_wom)
        
        # 3. Scroll y Clic en Checkboxes (JavaScript directo para evitar hacer clic en el enlace <a> de la declaración)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(0.5)
        
        # Checkbox 1: Declaración de uso y propiedad
        try:
            driver.execute_script("""
                var chk1 = document.getElementById('imeiAcquisition');
                if (chk1) {
                    chk1.click();
                }
            """)
            time.sleep(0.3)
        except Exception:
            try:
                driver.find_element(By.XPATH, '//input[@id="imeiAcquisition"]/following-sibling::span[@class="checkmark"]').click()
            except Exception:
                pass

        # Checkbox 2: Autorización tratamiento datos
        try:
            driver.execute_script("""
                var chk2 = document.getElementById('imeiauthorization');
                if (chk2) {
                    chk2.click();
                }
            """)
            time.sleep(0.3)
        except Exception:
            try:
                driver.find_element(By.XPATH, '//input[@id="imeiauthorization"]/following-sibling::span[@class="checkmark"]').click()
            except Exception:
                pass

        # 4. Submit
        try:
            btn_submit = driver.find_element(By.XPATH, '//*[@id="imeiForm"]/div/div[7]/div/button | //button[@type="submit" and contains(@class, "lead-imeiform")] | //button[@type="submit"]')
            btn_submit.click()
        except Exception:
            driver.find_element(By.XPATH, '//*[@id="imeiForm"]//button[@type="submit"]').click()

        # 5. ESCANEO DE RESPUESTA (Radar WOM original)
        inicio_espera = time.time()
        estado_final = "warning"
        mensaje_final = "WOM: Tiempo agotado, verifica si se registró."

        while time.time() - inicio_espera < 35:
            try:
                # A. Buscar el modal de ERROR
                errores = driver.find_elements(By.ID, "popup-modal-imei-fail")
                if not errores:
                    errores = driver.find_elements(By.XPATH, '//*[contains(@id, "fail")]')
                
                if errores and errores[0].is_displayed():
                    txt_err = errores[0].text.lower()
                    if "no puede" in txt_err or "error" in txt_err or "fail" in txt_err:
                        estado_final = "error"
                        mensaje_final = "WOM: ¡Ups! El IMEI no puede ser Registrado."
                        break
                
                # B. Buscar el modal de ÉXITO (Prioridad al H2)
                h2_exito = driver.find_elements(By.XPATH, '//*[@id="popup-modal-imei-success"]/div/h2 | //*[@id="popup-modal-imei-success"]//h2')
                if not h2_exito:
                    h2_exito = driver.find_elements(By.XPATH, '//*[contains(text(), "Gracias")] | //*[contains(text(), "exitoso")]')
                
                if h2_exito:
                    txt_h2 = h2_exito[0].text
                    if "Gracias" in txt_h2 or "¡Gracias!" in txt_h2 or "exitoso" in txt_h2.lower():
                        estado_final = "success"
                        mensaje_final = "WOM: Registrado exitosamente."
                        break

                modal_exito = driver.find_elements(By.ID, "popup-modal-imei-success")
                if modal_exito and modal_exito[0].is_displayed():
                    estado_final = "success"
                    mensaje_final = "WOM: Registrado exitosamente."
                    break

                p_exito = driver.find_elements(By.XPATH, '//*[@id="popup-modal-imei-success"]/div/p')
                if p_exito and "exitoso" in p_exito[0].text.lower():
                    estado_final = "success"
                    mensaje_final = "WOM: Registrado exitosamente."
                    break
                
                texto_body = driver.find_element(By.TAG_NAME, "body").text.lower()
                if "registro exitoso" in texto_body or "registrado con éxito" in texto_body or "fue exitoso" in texto_body:
                    estado_final = "success"
                    mensaje_final = "WOM: Registrado exitosamente."
                    break

            except Exception:
                pass
            time.sleep(0.5)

        # Esperar 1.0s adicional para que el modal y las animaciones carguen por completo
        time.sleep(1.0)

        # Captura de pantalla si se solicitó (recortada al modal/resultado)
        if ruta_pantallazo:
            try:
                os.makedirs(os.path.dirname(os.path.abspath(ruta_pantallazo)), exist_ok=True)
                modal_capturado = False
                xpaths_resultado = [
                    '//*[@id="popup-modal-imei-success"]//div[contains(@class, "modal-inner-wrap")]',
                    '//*[@id="popup-modal-imei-success"]//div[contains(@class, "modal-content")]',
                    '//*[@id="popup-modal-imei-success"]',
                    '//*[@id="popup-modal-imei-fail"]//div[contains(@class, "modal-inner-wrap")]',
                    '//*[@id="popup-modal-imei-fail"]//div[contains(@class, "modal-content")]',
                    '//*[@id="popup-modal-imei-fail"]'
                ]
                for xp in xpaths_resultado:
                    try:
                        elems = driver.find_elements(By.XPATH, xp)
                        for el in elems:
                            if el.is_displayed() and el.size['width'] > 50 and el.size['height'] > 50:
                                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", el)
                                time.sleep(0.3)
                                el.screenshot(ruta_pantallazo)
                                modal_capturado = True
                                break
                        if modal_capturado:
                            break
                    except Exception:
                        pass

                if not modal_capturado:
                    driver.save_screenshot(ruta_pantallazo)
            except Exception as e_ss:
                print(f"[WARN] Error capturando pantalla WOM: {e_ss}", file=sys.stderr)

    except Exception as e:
        estado_final = "error"
        mensaje_final = f"WOM: Error inesperado en la página ({str(e)})."
        if ruta_pantallazo:
            try:
                os.makedirs(os.path.dirname(os.path.abspath(ruta_pantallazo)), exist_ok=True)
                if driver:
                    driver.save_screenshot(ruta_pantallazo)
            except Exception:
                pass

    finally:
        if ruta_pantallazo and os.path.exists(ruta_pantallazo):
            try:
                base_dir = os.path.dirname(os.path.abspath(__file__))
                if base_dir not in sys.path:
                    sys.path.append(base_dir)
                from EstilizadorPantallazo import estilizar_pantallazo
                nombre_titular = " ".join([p for p in [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido] if p]).strip()
                datos_estilo = {
                    "imei": imei,
                    "linea": linea_wom,
                    "propietario": nombre_titular,
                    "operador": "WOM",
                    "estado": estado_final,
                    "incluir_operador": True,
                    "incluir_imei": True,
                    "incluir_modelo": True,
                    "incluir_linea": True,
                    "incluir_propietario": True
                }
                if isinstance(opciones_pantallazo, dict):
                    for k, v in opciones_pantallazo.items():
                        if k.startswith("incluir_"):
                            datos_estilo[k] = v
                        elif v:
                            datos_estilo[k] = v
                estilizar_pantallazo(ruta_pantallazo, datos_estilo)
            except Exception as e_est:
                print(f"[WARN] Error estilizando comprobante WOM: {e_est}", file=sys.stderr)

        res_payload = {"status": estado_final, "mensaje": mensaje_final}
        if ruta_pantallazo and os.path.exists(ruta_pantallazo):
            res_payload["screenshot_path"] = ruta_pantallazo
        
        print(json.dumps(res_payload, ensure_ascii=False))

        if 'driver' in locals() and driver:
            try:
                driver.close()
            except Exception:
                pass
            try:
                driver.quit()
            except Exception:
                pass

if __name__ == "__main__":
    main()