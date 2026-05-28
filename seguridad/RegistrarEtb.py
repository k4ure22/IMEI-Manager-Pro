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
    """Escritura rápida pero simulando evento de teclado humano"""
    element.clear()
    for char in str(text):
        element.send_keys(char)
        time.sleep(random.uniform(0.01, 0.04))

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"status": "error", "mensaje": "Argumentos insuficientes. Se requiere IMEI y Línea."}))
        return

    imei = sys.argv[1]
    linea_etb = sys.argv[2]

    options = Options()
    options.add_experimental_option("detach", True) # Permite mantener el navegador abierto al final
    # options.add_argument('--headless') # Descomenta para modo oculto (sin ventana)
    
    driver = webdriver.Chrome(options=options)
    
    try:
        driver.get("https://etb.com/registroImei.aspx")
        wait = WebDriverWait(driver, 10)

        # 1. Ingresar Número de Línea
        input_linea = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="ContentPlaceHolder1_txtNMEtb"]')))
        human_type(input_linea, linea_etb)

        # 2. Ingresar IMEI
        input_imei = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="ContentPlaceHolder1_txtImei"]')))
        human_type(input_imei, imei)

        # 3. Marcar Checkbox
        chk_certi = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="ContentPlaceHolder1_chkCerti"]')))
        chk_certi.click()
        time.sleep(0.3)

        # 4. Enviar
        btn_enviar = driver.find_element(By.XPATH, '//*[@id="ContentPlaceHolder1_btnEnviar"]')
        btn_enviar.click()

        # 5. ESCANEO RÁPIDO DE RESPUESTA (Radar ETB)
        xpath_mensaje = '/html/body/section[1]/div/article/p'
        inicio_espera = time.time()
        estado_final = "warning"
        mensaje_final = "ETB: Tiempo agotado o respuesta desconocida."

        while time.time() - inicio_espera < 15:
            try:
                elementos = driver.find_elements(By.XPATH, xpath_mensaje)
                if elementos:
                    texto_resultado = elementos[0].text.lower()
                    if "ya están registrados" in texto_resultado:
                        estado_final = "error"
                        mensaje_final = "ETB: El IMEI y línea ya están registrados."
                        break
                    elif "con éxito" in texto_resultado:
                        estado_final = "success"
                        mensaje_final = "ETB: Registro guardado con éxito."
                        break
            except:
                pass
            time.sleep(0.5) # Escanea 2 veces por segundo

        print(json.dumps({"status": estado_final, "mensaje": mensaje_final}))
        time.sleep(6) # Pausa para que el Jefe vea la confirmación visual

    except Exception as e:
        print(json.dumps({"status": "error", "mensaje": "ETB Error en la página."}))
        time.sleep(10)
    finally:
        driver.quit()

if __name__ == "__main__":
    main()