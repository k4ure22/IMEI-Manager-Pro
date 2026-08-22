import os
import sys
import time
import random
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def human_type(element, text):
    """Escritura simulando teclado humano"""
    element.clear()
    for char in str(text):
        element.send_keys(char)
        time.sleep(random.uniform(0.01, 0.04))

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    
    if len(args) < 2:
        print(json.dumps({"status": "error", "mensaje": "Argumentos insuficientes. Se requiere IMEI y Línea."}))
        return

    imei = args[0]
    linea_etb = args[1]
    ruta_pantallazo = args[2] if len(args) >= 3 else None
    opciones_pantallazo = {}
    if len(args) >= 4:
        try:
            opciones_pantallazo = json.loads(args[3])
        except Exception:
            pass

    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-popup-blocking")
    
    driver = None
    estado_final = "error"
    mensaje_final = "ETB Error en la página."

    try:
        driver = webdriver.Chrome(options=options)
        driver.get("https://etb.com/registroImei.aspx")
        wait = WebDriverWait(driver, 10)

        # 1. Ingresar Número de Línea
        input_linea = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="ContentPlaceHolder1_txtNMEtb"] | //*[@id="txtLinea"]')))
        human_type(input_linea, linea_etb)

        # 2. Ingresar IMEI
        input_imei = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="ContentPlaceHolder1_txtImei"] | //*[@id="txtImei"]')))
        human_type(input_imei, imei)

        # 3. Marcar Checkbox Autorización
        chk_certi = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="ContentPlaceHolder1_chkCerti"] | //*[@id="chkAutorizacion"]')))
        if not chk_certi.is_selected():
            chk_certi.click()
        time.sleep(0.3)

        # 4. Enviar
        btn_enviar = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="ContentPlaceHolder1_btnEnviar"] | //*[@id="btnRegistrar"]')))
        btn_enviar.click()

        # 5. ESCANEO RÁPIDO DE RESPUESTA (Radar ETB original)
        xpath_mensaje = '/html/body/section[1]/div/article/p | //*[@id="ContentPlaceHolder1_lblErrorCorreo"] | //*[@id="form"]//p | //*[contains(@class, "alert")]'
        inicio_espera = time.time()
        estado_final = "warning"
        mensaje_final = "ETB: Tiempo agotado o respuesta desconocida."

        while time.time() - inicio_espera < 15:
            try:
                elementos = driver.find_elements(By.XPATH, xpath_mensaje)
                for elem in elementos:
                    if elem.is_displayed():
                        texto_resultado = elem.text.lower().strip()
                        if not texto_resultado:
                            continue
                        if "ya están registrados" in texto_resultado or "ya registrado" in texto_resultado:
                            estado_final = "error"
                            mensaje_final = "ETB: El IMEI y línea ya están registrados."
                            break
                        elif "con éxito" in texto_resultado or "éxito" in texto_resultado or "exitoso" in texto_resultado or "registrado" in texto_resultado:
                            estado_final = "success"
                            mensaje_final = "ETB: Registro guardado con éxito."
                            break
                if estado_final in ["success", "error"]:
                    break
            except Exception:
                pass
            time.sleep(0.5) # Escanea 2 veces por segundo

        if estado_final == "warning":
            body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
            if "con éxito" in body_text or "registrado" in body_text or "exitoso" in body_text:
                estado_final = "success"
                mensaje_final = "ETB: Registro guardado con éxito."

        # Esperar 1.0s adicional para que el mensaje/modal cargue por completo
        time.sleep(1.0)

        # Captura de pantalla si se solicitó (recortada al resultado)
        if ruta_pantallazo:
            try:
                os.makedirs(os.path.dirname(os.path.abspath(ruta_pantallazo)), exist_ok=True)
                resultado_capturado = False
                xpaths_resultado = [
                    '/html/body/section[1]/div/article',
                    '//section[contains(@class, "registro")]//article',
                    '//*[@id="form"]//article',
                    '//*[@id="ContentPlaceHolder1_lblErrorCorreo"]',
                    '//*[contains(@class, "alert")]',
                    '//*[@id="form"]'
                ]
                for xp in xpaths_resultado:
                    try:
                        elems = driver.find_elements(By.XPATH, xp)
                        for el in elems:
                            if el.is_displayed() and el.size['width'] > 50 and el.size['height'] > 50:
                                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", el)
                                time.sleep(0.3)
                                el.screenshot(ruta_pantallazo)
                                resultado_capturado = True
                                break
                        if resultado_capturado:
                            break
                    except Exception:
                        pass

                if not resultado_capturado:
                    driver.save_screenshot(ruta_pantallazo)
            except Exception as e_ss:
                print(f"⚠️ Error capturando pantalla ETB: {e_ss}", file=sys.stderr)

    except Exception as e:
        estado_final = "error"
        mensaje_final = f"ETB: Error en la página ({str(e)})"
        if ruta_pantallazo:
            try:
                os.makedirs(os.path.dirname(os.path.abspath(ruta_pantallazo)), exist_ok=True)
                if driver:
                    driver.save_screenshot(ruta_pantallazo)
            except Exception:
                pass

    finally:
        # Estilizar el pantallazo SIEMPRE antes de responder y cerrar el navegador
        if ruta_pantallazo and os.path.exists(ruta_pantallazo):
            try:
                base_dir = os.path.dirname(os.path.abspath(__file__))
                if base_dir not in sys.path:
                    sys.path.append(base_dir)
                from EstilizadorPantallazo import estilizar_pantallazo
                datos_estilo = {
                    "imei": imei,
                    "linea": linea_etb,
                    "operador": "ETB",
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
                estilitar_res = estilizar_pantallazo(ruta_pantallazo, datos_estilo)
            except Exception as e_est:
                print(f"⚠️ Error estilizando comprobante ETB: {e_est}", file=sys.stderr)

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