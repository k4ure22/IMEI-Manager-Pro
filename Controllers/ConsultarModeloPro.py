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
import re
import json
import argparse
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# ─── ESTADO LOCAL DE CUPOS ────────────────────────────────────────
# Guarda: {"consultas_restantes": N, "bloqueado_hasta": ISO|null, "ultimo_reset": ISO}
ARCHIVO_ESTADO = os.path.join(os.path.expanduser("~"), "IMEIManagerData", "estado_modelo_pro.json")
LIMITE_CONSULTAS = 5
HORAS_RESET = 24

def _asegurar_directorio():
    os.makedirs(os.path.dirname(ARCHIVO_ESTADO), exist_ok=True)

def leer_estado() -> dict:
    _asegurar_directorio()
    if os.path.exists(ARCHIVO_ESTADO):
        try:
            with open(ARCHIVO_ESTADO, "r", encoding="utf-8") as f:
                estado = json.load(f)
                if "consultas_restantes" not in estado:
                    estado["consultas_restantes"] = LIMITE_CONSULTAS
                if "ultimo_reset" not in estado:
                    estado["ultimo_reset"] = datetime.now().isoformat()
                return estado
        except (json.JSONDecodeError, KeyError):
            pass
    return {
        "consultas_restantes": LIMITE_CONSULTAS,
        "bloqueado_hasta": None,
        "ultimo_reset": datetime.now().isoformat()
    }

def guardar_estado(estado: dict):
    _asegurar_directorio()
    with open(ARCHIVO_ESTADO, "w", encoding="utf-8") as f:
        json.dump(estado, f, indent=2)

def verificar_y_resetear_si_necesario(estado: dict) -> dict:
    ahora = datetime.now()

    # Reset por tiempo del contador propio (24h desde último reset) si no hay bloqueo web futuro activo
    if estado.get("ultimo_reset") and not estado.get("bloqueado_hasta"):
        try:
            ultimo_reset = datetime.fromisoformat(estado["ultimo_reset"])
            if ahora >= ultimo_reset + timedelta(hours=HORAS_RESET):
                estado["consultas_restantes"] = LIMITE_CONSULTAS
                estado["ultimo_reset"] = ahora.isoformat()
                estado["bloqueado_hasta"] = None
        except Exception:
            pass

    # Limpiar bloqueo web si ya expiró en tiempo
    if estado.get("bloqueado_hasta"):
        try:
            bloqueado_hasta = datetime.fromisoformat(estado["bloqueado_hasta"])
            if ahora >= bloqueado_hasta:
                estado["bloqueado_hasta"] = None
        except Exception:
            estado["bloqueado_hasta"] = None

    return estado

def calcular_tiempo_restante(estado: dict) -> dict:
    ahora = datetime.now()

    if estado.get("bloqueado_hasta"):
        try:
            bloqueado_hasta = datetime.fromisoformat(estado["bloqueado_hasta"])
            if ahora < bloqueado_hasta:
                diferencia = bloqueado_hasta - ahora
                horas, resto = divmod(int(diferencia.total_seconds()), 3600)
                return {"horas": horas, "minutos": resto // 60}
        except Exception:
            pass

    if estado.get("consultas_restantes", LIMITE_CONSULTAS) <= 0:
        try:
            ultimo_reset = datetime.fromisoformat(estado.get("ultimo_reset", ahora.isoformat()))
            proximo_reset = ultimo_reset + timedelta(hours=HORAS_RESET)
            diferencia = proximo_reset - ahora
            if diferencia.total_seconds() > 0:
                horas, resto = divmod(int(diferencia.total_seconds()), 3600)
                return {"horas": horas, "minutos": resto // 60}
        except Exception:
            pass

    return {"horas": 0, "minutos": 0}

def _crear_chrome_options(headless: bool = True) -> Options:
    chrome_options = Options()
    if headless:
        chrome_options.add_argument("--headless=new")
    else:
        chrome_options.add_argument("--start-maximized")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--log-level=3")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option("useAutomationExtension", False)
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    prefs = {
        "profile.default_content_setting_values.notifications": 2,
    }
    chrome_options.add_experimental_option("prefs", prefs)
    return chrome_options

def cerrar_anuncio_si_aparece(driver) -> bool:
    """
    Detecta y cierra anuncios intersticiales (Google Vignette, popups, overlays de publicidad).
    """
    cerrado = False
    selectores_dismiss = [
        '//*[@id="dismiss-button"]',
        '//div[@id="dismiss-button"]',
        '//button[@id="dismiss-button"]',
        '//*[@aria-label="Close ad"]',
        '//*[@aria-label="Cerrar anuncio"]',
        '//*[@aria-label="Close"]',
        '//*[@aria-label="Cerrar"]',
        '//div[contains(@class, "close-button")]',
        '//div[contains(@class, "btn-close")]',
        '//span[contains(@class, "close-icon")]',
        '//div[contains(@id, "close")]'
    ]
    for sel in selectores_dismiss:
        try:
            btns = driver.find_elements(By.XPATH, sel)
            for b in btns:
                if b.is_displayed():
                    driver.execute_script("arguments[0].click();", b)
                    cerrado = True
                    time.sleep(0.3)
                    break
        except Exception:
            pass

    try:
        iframes = driver.find_elements(By.XPATH, '//iframe[contains(@id, "aswift") or contains(@name, "aswift") or contains(@id, "google_ads")]')
        for iframe in iframes:
            try:
                driver.switch_to.frame(iframe)
                sub_iframes = driver.find_elements(By.XPATH, '//iframe[@id="ad_iframe" or @name="ad_iframe"]')
                if sub_iframes:
                    driver.switch_to.frame(sub_iframes[0])
                for sel in selectores_dismiss:
                    btns = driver.find_elements(By.XPATH, sel)
                    if btns and btns[0].is_displayed():
                        driver.execute_script("arguments[0].click();", btns[0])
                        cerrado = True
                        time.sleep(0.3)
                        break
                driver.switch_to.default_content()
                if cerrado:
                    break
            except Exception:
                driver.switch_to.default_content()
    except Exception:
        try:
            driver.switch_to.default_content()
        except Exception:
            pass

    try:
        driver.execute_script("""
            let vignettes = document.querySelectorAll('ins.adsbygoogle[data-vignette-loaded="true"], div[id^="aswift_"][style*="position: fixed"], iframe[id^="aswift_"][style*="position: fixed"]');
            vignettes.forEach(v => v.remove());
            if (window.location.hash.includes('google_vignette')) {
                history.replaceState(null, null, ' ');
            }
        """)
    except Exception:
        pass

    return cerrado

def validar_estado_pagina_web() -> dict:
    """
    Abre iunlocker.com en modo headless y valida si ya es hábil para consultas.
    """
    estado = leer_estado()
    driver = None
    try:
        chrome_options = _crear_chrome_options(headless=True)
        driver = webdriver.Chrome(options=chrome_options)
        driver.get("https://iunlocker.com/es/check_imei.php")
        cerrar_anuncio_si_aparece(driver)

        timeout = 15
        end_time = time.time() + timeout
        limite_detectado = False
        html_completo = ""

        while time.time() < end_time:
            cerrar_anuncio_si_aparece(driver)
            html_completo = driver.page_source
            html_lower = html_completo.lower()

            if "reached the limit" in html_lower or "alcanzado el límite" in html_lower or "límite" in html_lower:
                limite_detectado = True
                break

            elementos = driver.find_elements(By.XPATH, '//*[@id="imeiForm"]/div[2]')
            if elementos and elementos[0].is_displayed():
                break
            time.sleep(0.4)

        ahora = datetime.now()
        if limite_detectado:
            match = re.search(r'(\d+)\s*hour(?:s)?\s*(\d+)\s*minute(?:s)?', html_completo, re.IGNORECASE)
            if match:
                h_bloq = int(match.group(1))
                m_bloq = int(match.group(2))
                hasta_dt = ahora + timedelta(hours=h_bloq, minutes=m_bloq)
                estado["bloqueado_hasta"] = hasta_dt.isoformat()
            else:
                if not estado.get("bloqueado_hasta"):
                    estado["bloqueado_hasta"] = (ahora + timedelta(hours=HORAS_RESET)).isoformat()

            estado["consultas_restantes"] = 0
            guardar_estado(estado)
            t = calcular_tiempo_restante(estado)
            return {
                "habil": False,
                "status": "limite_web",
                "mensaje": f"Límite diario alcanzado en el sitio. Disponible en {t['horas']}h {t['minutos']}m",
                "horas": t["horas"],
                "minutos": t["minutos"],
                "consultas_restantes": 0
            }
        else:
            estado["consultas_restantes"] = LIMITE_CONSULTAS
            estado["bloqueado_hasta"] = None
            estado["ultimo_reset"] = ahora.isoformat()
            guardar_estado(estado)
            return {
                "habil": True,
                "status": "success",
                "mensaje": "Sitio web habilitado para consultas",
                "horas": 0,
                "minutos": 0,
                "consultas_restantes": LIMITE_CONSULTAS
            }

    except Exception as e:
        t = calcular_tiempo_restante(estado)
        return {
            "habil": False,
            "status": "error_validacion",
            "mensaje": f"No se pudo conectar para verificar el sitio: {e}",
            "horas": t["horas"],
            "minutos": t["minutos"],
            "consultas_restantes": estado.get("consultas_restantes", 0)
        }
    finally:
        if driver:
            try: driver.quit()
            except Exception: pass

def extraer_modelo_iphone(texto_crudo: str) -> str:
    if not texto_crudo:
        return ""
    m = re.search(r'(?i)(?:model(?: description)?|dispositivo|device)?\s*:?\s*(iphone\s+[^\n\r]+)', texto_crudo)
    if m:
        candidato = m.group(1).strip()
        m_gb = re.search(r'(?i)(iphone\s+.*?)(?=\s+\d+\s*(?:GB|TB)|\s*$)', candidato)
        if m_gb:
            return m_gb.group(1).strip().title()
        return candidato.title()
    lineas = [l.strip() for l in texto_crudo.splitlines() if l.strip()]
    if lineas:
        return lineas[0]
    return texto_crudo

def _output(data: dict):
    """Imprime el resultado JSON a stdout y termina."""
    print(json.dumps(data, ensure_ascii=False), flush=True)

def consultar_modelo_pro(imei: str, con_pantallazo: bool = False, headless: bool = True):
    """
    Consulta el modelo del IMEI en iunlocker.com/es/check_imei.php.
    Scrollea a //*[@id="imeiForm"]/div[2], ingresa el IMEI, presiona //*[@id="timer1"]/a,
    cierra anuncios si aparecen, scrollea y captura pantallazo de //*[@id="scr_save"].
    """
    estado = leer_estado()
    estado = verificar_y_resetear_si_necesario(estado)

    esta_bloqueado = False
    if estado.get("bloqueado_hasta"):
        try:
            bloqueado_hasta = datetime.fromisoformat(estado["bloqueado_hasta"])
            if datetime.now() < bloqueado_hasta:
                esta_bloqueado = True
        except Exception:
            pass

    if esta_bloqueado or estado["consultas_restantes"] <= 0:
        val_res = validar_estado_pagina_web()
        if not val_res.get("habil"):
            _output(val_res)
            return
        estado = leer_estado()

    chrome_options = _crear_chrome_options(headless=headless)
    driver = webdriver.Chrome(options=chrome_options)
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

    try:
        driver.get("https://iunlocker.com/es/check_imei.php")
        time.sleep(1)
        cerrar_anuncio_si_aparece(driver)

        if str(imei).strip().upper() in ("ALTERADA", "TEST_ALTERADA", "TEST"):
            _output({
                "status": "pagina_alterada",
                "pagina": "iUnlocker (Modelo Pro)",
                "mensaje": "El estado de la página iUnlocker ha cambiado, por favor solicite soporte a Martin.",
                "detalle": "Simulación de prueba: no se encontró el campo IMEI (//*[@id='imeiForm']/div[2]) en iunlocker.com.",
                "consultas_restantes": estado.get("consultas_restantes", LIMITE_CONSULTAS)
            })
            return

        timeout = 80
        end_time = time.time() + timeout
        input_container = None

        # 1. Scrollear hasta encontrar //*[@id="imeiForm"]/div[2]
        while time.time() < end_time:
            cerrar_anuncio_si_aparece(driver)
            cont = driver.find_elements(By.XPATH, '//*[@id="imeiForm"]/div[2]')
            if cont and cont[0].is_displayed():
                input_container = cont[0]
                break
            time.sleep(0.3)

        if not input_container:
            _output({
                "status": "pagina_alterada",
                "pagina": "iUnlocker (Modelo Pro)",
                "mensaje": "El estado de la página iUnlocker ha cambiado, por favor solicite soporte a Martin.",
                "detalle": "No se encontró el campo IMEI (//*[@id='imeiForm']/div[2]) en iunlocker.com.",
                "consultas_restantes": estado["consultas_restantes"]
            })
            return

        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", input_container)
        time.sleep(0.4)

        imei_field = None
        inputs = input_container.find_elements(By.TAG_NAME, "input")
        if inputs:
            imei_field = inputs[0]
        else:
            by_id = driver.find_elements(By.ID, "imei")
            if by_id:
                imei_field = by_id[0]

        if not imei_field:
            _output({
                "status": "pagina_alterada",
                "pagina": "iUnlocker (Modelo Pro)",
                "mensaje": "El estado de la página iUnlocker ha cambiado, por favor solicite soporte a Martin.",
                "detalle": "No se encontró el input dentro de //*[@id='imeiForm']/div[2] en iunlocker.com.",
                "consultas_restantes": estado["consultas_restantes"]
            })
            return

        imei_field.clear()
        imei_field.send_keys(str(imei).strip())
        time.sleep(0.4)

        # 2. Scrollear y presionar //*[@id="timer1"]/a
        btn_elements = driver.find_elements(By.XPATH, '//*[@id="timer1"]/a')
        if not btn_elements:
            _output({
                "status": "pagina_alterada",
                "pagina": "iUnlocker (Modelo Pro)",
                "mensaje": "El estado de la página iUnlocker ha cambiado, por favor solicite soporte a Martin.",
                "detalle": "No se encontró el botón de consulta (//*[@id='timer1']/a) en iunlocker.com.",
                "consultas_restantes": estado["consultas_restantes"]
            })
            return

        btn = btn_elements[0]
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", btn)
        time.sleep(0.4)
        try:
            btn.click()
        except Exception:
            driver.execute_script("arguments[0].click();", btn)

        time.sleep(1)
        cerrar_anuncio_si_aparece(driver)

        # Si se abre una nueva ventana, cambiar a ella
        if len(driver.window_handles) > 1:
            driver.switch_to.window(driver.window_handles[-1])

        # 3. Esperar que cargue la ventana y scrollear hasta encontrar //*[@id="scr_save"]
        resultado_estado = None
        html_completo = ""
        resultado_div_element = None

        while time.time() < end_time:
            cerrar_anuncio_si_aparece(driver)
            if len(driver.window_handles) > 1 and driver.current_window_handle != driver.window_handles[-1]:
                driver.switch_to.window(driver.window_handles[-1])

            try:
                html_completo = driver.page_source
                html_lower = html_completo.lower()

                if (
                    "reached the limit" in html_lower or
                    "alcanzado el límite" in html_lower or
                    "límite" in html_lower or
                    "too many requests" in html_lower
                ):
                    resultado_estado = "LIMITE_WEB"
                    break

                resultado_div = driver.find_elements(By.XPATH, '//*[@id="scr_save"]')
                if resultado_div and resultado_div[0].is_displayed():
                    resultado_estado = "EXITO"
                    resultado_div_element = resultado_div[0]
                    break
            except Exception:
                pass

            time.sleep(1)

        if resultado_estado == "EXITO":
            estado["consultas_restantes"] = max(0, estado["consultas_restantes"] - 1)

            # Scrollear hasta el resultado
            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", resultado_div_element)
            time.sleep(0.5)

            texto_crudo = ""
            try:
                filas = resultado_div_element.find_elements(By.CLASS_NAME, "iuResCard_row")
                for f in filas:
                    t = f.text
                    if any(k in t.lower() for k in ["model", "modelo", "device", "dispositivo"]):
                        val = f.find_elements(By.CLASS_NAME, "iuResCard_value")
                        if val:
                            texto_crudo = val[0].text.strip()
                            break
                if not texto_crudo:
                    sub_divs = resultado_div_element.find_elements(By.XPATH, './/div/div[1] | .//div[contains(@class, "title")]')
                    if sub_divs:
                        texto_crudo = sub_divs[0].text.strip()
                if not texto_crudo:
                    texto_crudo = resultado_div_element.text.strip()
            except Exception:
                texto_crudo = resultado_div_element.text.strip() if resultado_div_element else ""

            modelo_limpio = extraer_modelo_iphone(texto_crudo)
            if not modelo_limpio or len(modelo_limpio) < 3:
                todo_texto = resultado_div_element.text if resultado_div_element else ""
                modelo_limpio = extraer_modelo_iphone(todo_texto)

            screenshot_path = None
            if con_pantallazo and resultado_div_element:
                base_dir = os.path.dirname(os.path.abspath(__file__))
                temp_dir = os.path.join(base_dir, 'temp_screenshots')
                os.makedirs(temp_dir, exist_ok=True)
                screenshot_path = os.path.join(temp_dir, f"modelo_{imei}.png")
                try:
                    resultado_div_element.screenshot(screenshot_path)
                except Exception:
                    try:
                        driver.save_screenshot(screenshot_path)
                    except Exception:
                        screenshot_path = None

            guardar_estado(estado)
            _output({
                "status": "success",
                "modelo": modelo_limpio,
                "imei": imei,
                "screenshot_path": screenshot_path,
                "consultas_restantes": estado["consultas_restantes"]
            })

        elif resultado_estado == "LIMITE_WEB":
            match = re.search(
                r'(\d+)\s*hour(?:s)?\s*(\d+)\s*minute(?:s)?',
                html_completo, re.IGNORECASE
            )
            if match:
                horas_bloqueo = int(match.group(1))
                minutos_bloqueo = int(match.group(2))
            else:
                horas_bloqueo, minutos_bloqueo = HORAS_RESET, 0

            ahora = datetime.now()
            hora_desbloqueo = ahora + timedelta(
                hours=horas_bloqueo, minutes=minutos_bloqueo
            )
            estado["bloqueado_hasta"] = hora_desbloqueo.isoformat()
            estado["hora_error"] = ahora.isoformat()
            estado["consultas_restantes"] = 0
            estado["ultimo_reset"] = ahora.isoformat()
            guardar_estado(estado)

            _output({
                "status": "limite_web",
                "mensaje": f"Límite diario alcanzado en el sitio. Disponible en {horas_bloqueo}h {minutos_bloqueo}m",
                "horas": horas_bloqueo,
                "minutos": minutos_bloqueo,
                "consultas_restantes": 0
            })

        else:
            _output({
                "status": "error",
                "mensaje": "Tiempo de espera agotado. El sitio no respondió.",
                "consultas_restantes": estado["consultas_restantes"]
            })

    except Exception as e:
        _output({
            "status": "error",
            "mensaje": f"Error técnico: {str(e)}",
            "consultas_restantes": estado.get("consultas_restantes", LIMITE_CONSULTAS)
        })
    finally:
        try:
            driver.quit()
        except Exception:
            pass


def obtener_estado_cupos() -> dict:
    """Devuelve el estado actual de cupos sin realizar consulta."""
    estado = leer_estado()
    estado = verificar_y_resetear_si_necesario(estado)
    guardar_estado(estado)

    t = calcular_tiempo_restante(estado)
    bloqueado = estado.get("bloqueado_hasta") is not None
    sin_cupos = estado["consultas_restantes"] <= 0

    return {
        "status": "success",
        "consultas_restantes": estado["consultas_restantes"],
        "limite": LIMITE_CONSULTAS,
        "bloqueado": bloqueado or sin_cupos,
        "horas": t["horas"],
        "minutos": t["minutos"],
        "bloqueado_hasta": estado.get("bloqueado_hasta")
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Consultar modelo de IMEI en iunlocker.com")
    parser.add_argument("imei", nargs="?", help="IMEI a consultar (15 dígitos)")
    parser.add_argument("--screenshot", action="store_true", help="Guardar pantallazo del resultado")
    parser.add_argument("--estado", action="store_true", help="Solo mostrar estado de cupos")
    parser.add_argument("--validar-web", action="store_true", help="Validar en vivo si la página web ya es hábil")
    parser.add_argument("--visible", action="store_true", help="Mostrar ventana de Chrome (no headless)")

    args = parser.parse_args()

    if args.estado:
        _output(obtener_estado_cupos())
    elif args.validar_web:
        _output(validar_estado_pagina_web())
    elif args.imei:
        consultar_modelo_pro(args.imei, con_pantallazo=args.screenshot, headless=not args.visible)
    else:
        parser.print_help()
        sys.exit(1)