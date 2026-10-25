"""
blacklist.py — Consulta GSMA Blacklist en iunlocker.com/es/check_imei.php
Uso CLI: python blacklist.py <imei> [--screenshot] [--visible] [--estado] [--validar-web]
Salida:  JSON en stdout. Logs a stderr.
"""

from __future__ import annotations
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
import json
import argparse
import random
import re
from datetime import datetime, timedelta

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# ─── ESTADO LOCAL (límite diario) ────────────────────────────────────────────
ARCHIVO_ESTADO = os.path.join(
    os.path.expanduser("~"), "IMEIManagerData", "estado_blacklist.json"
)
LIMITE_CONSULTAS = 5
HORAS_RESET = 24


def _log(msg: str):
    print(f"[blacklist] {msg}", file=sys.stderr, flush=True)


def _output(data: dict):
    print(json.dumps(data, ensure_ascii=False), flush=True)


# ─── GESTIÓN DE ESTADO (límite diario) ───────────────────────────────────────

def _asegurar_dir():
    os.makedirs(os.path.dirname(ARCHIVO_ESTADO), exist_ok=True)


def leer_estado() -> dict:
    _asegurar_dir()
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
        "ultimo_reset": datetime.now().isoformat(),
    }


def guardar_estado(estado: dict) -> None:
    _asegurar_dir()
    with open(ARCHIVO_ESTADO, "w", encoding="utf-8") as f:
        json.dump(estado, f, indent=2)


def verificar_y_resetear_si_necesario(estado: dict) -> dict:
    ahora = datetime.now()

    # Reset por tiempo (24h desde último reset) si no hay bloqueo web futuro activo
    if estado.get("ultimo_reset") and not estado.get("bloqueado_hasta"):
        try:
            ultimo_reset = datetime.fromisoformat(estado["ultimo_reset"])
            if ahora >= ultimo_reset + timedelta(hours=HORAS_RESET):
                estado["consultas_restantes"] = LIMITE_CONSULTAS
                estado["ultimo_reset"] = ahora.isoformat()
                estado["bloqueado_hasta"] = None
        except Exception:
            pass

    # Limpiar bloqueo web si ya expiró
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
    
    # 1. Si hay un bloqueo web activo, calcular hasta ese desbloqueo exacto
    if estado.get("bloqueado_hasta"):
        try:
            bloqueado_hasta = datetime.fromisoformat(estado["bloqueado_hasta"])
            if ahora < bloqueado_hasta:
                diferencia = bloqueado_hasta - ahora
                horas, resto = divmod(int(diferencia.total_seconds()), 3600)
                return {"horas": horas, "minutos": resto // 60}
        except Exception:
            pass

    # 2. Si no, calcular hasta el próximo reset automático
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


# ─── DRIVER Y UTILIDADES ─────────────────────────────────────────────────────

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
        _log("Validando disponibilidad en página de Blacklist...")
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
                "mensaje": f"Límite diario alcanzado en iunlocker.com. Disponible en {t['horas']}h {t['minutos']}m",
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
                "mensaje": "Página Blacklist habilitada para consultas",
                "horas": 0,
                "minutos": 0,
                "consultas_restantes": LIMITE_CONSULTAS
            }

    except Exception as e:
        t = calcular_tiempo_restante(estado)
        return {
            "habil": False,
            "status": "error_validacion",
            "mensaje": f"No se pudo verificar el sitio de Blacklist: {e}",
            "horas": t["horas"],
            "minutos": t["minutos"],
            "consultas_restantes": estado.get("consultas_restantes", 0)
        }
    finally:
        if driver:
            try: driver.quit()
            except Exception: pass


def obtener_estado_cupos() -> dict:
    """Devuelve el estado actual de cupos de Blacklist sin realizar consulta."""
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


# ─── CONSULTA PRINCIPAL ───────────────────────────────────────────────────────

def consultar_blacklist(imei: str, con_pantallazo: bool = False, headless: bool = True) -> None:
    _log(f"Iniciando consulta Blacklist GSMA para IMEI: {imei}")

    # Verificar si estamos bloqueados por límite diario
    estado = leer_estado()
    estado = verificar_y_resetear_si_necesario(estado)

    esta_bloqueado = False
    if estado.get("bloqueado_hasta"):
        try:
            hasta = datetime.fromisoformat(estado["bloqueado_hasta"])
            if datetime.now() < hasta:
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
        timeout = 80
        end_time = time.time() + timeout

        if str(imei).strip().upper() in ("ALTERADA", "TEST_ALTERADA", "TEST"):
            _output({
                "status": "pagina_alterada",
                "pagina": "iUnlocker (Blacklist GSMA)",
                "mensaje": "El estado de la página iUnlocker Blacklist ha cambiado, por favor solicite soporte a Martin.",
                "detalle": "Simulación de prueba: no se encontró el campo IMEI en iunlocker.com.",
                "screenshot_path": None,
                "consultas_restantes": estado.get("consultas_restantes", LIMITE_CONSULTAS)
            })
            return

        _log("Cargando página https://iunlocker.com/es/check_imei.php...")
        driver.get("https://iunlocker.com/es/check_imei.php")
        time.sleep(1)
        cerrar_anuncio_si_aparece(driver)

        # ── 1. Scrollear hasta encontrar //*[@id="imeiForm"]/div[2] ─
        input_container = None
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
                "pagina": "iUnlocker (Blacklist GSMA)",
                "mensaje": "El estado de la página iUnlocker Blacklist ha cambiado, por favor solicite soporte a Martin.",
                "detalle": "No se encontró el contenedor del campo IMEI (//*[@id='imeiForm']/div[2]) en iunlocker.com.",
                "screenshot_path": None,
                "consultas_restantes": estado.get("consultas_restantes", LIMITE_CONSULTAS)
            })
            return

        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", input_container)
        time.sleep(0.4)

        # Encontrar campo input
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
                "pagina": "iUnlocker (Blacklist GSMA)",
                "mensaje": "El estado de la página iUnlocker Blacklist ha cambiado, por favor solicite soporte a Martin.",
                "detalle": "No se encontró el campo input de IMEI dentro de //*[@id='imeiForm']/div[2] en iunlocker.com.",
                "screenshot_path": None,
                "consultas_restantes": estado.get("consultas_restantes", LIMITE_CONSULTAS)
            })
            return

        imei_field.clear()
        imei_field.send_keys(str(imei).strip())
        _log(f"IMEI escrito: {imei}")
        time.sleep(0.4)

        # ── 2. Scrollear y presionar //*[@id="timer1"]/a ────────────
        btn_elements = driver.find_elements(By.XPATH, '//*[@id="timer1"]/a')
        if not btn_elements:
            _output({
                "status": "pagina_alterada",
                "pagina": "iUnlocker (Blacklist GSMA)",
                "mensaje": "El estado de la página iUnlocker Blacklist ha cambiado, por favor solicite soporte a Martin.",
                "detalle": "No se encontró el botón de consulta (//*[@id='timer1']/a) en iunlocker.com.",
                "screenshot_path": None,
                "consultas_restantes": estado.get("consultas_restantes", LIMITE_CONSULTAS)
            })
            return

        btn = btn_elements[0]
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", btn)
        time.sleep(0.4)
        try:
            btn.click()
        except Exception:
            driver.execute_script("arguments[0].click();", btn)

        _log("Botón clickeado. Esperando resultado...")
        time.sleep(1)
        cerrar_anuncio_si_aparece(driver)

        # Si se abre una nueva ventana/pestaña, cambiar a ella
        if len(driver.window_handles) > 1:
            driver.switch_to.window(driver.window_handles[-1])

        # ── 3. Esperar que cargue la ventana y scrollear hasta //*[@id="scr_save"] ─
        resultado_estado = None
        result_element = None
        html_completo = ""

        while time.time() < end_time:
            cerrar_anuncio_si_aparece(driver)
            if len(driver.window_handles) > 1 and driver.current_window_handle != driver.window_handles[-1]:
                driver.switch_to.window(driver.window_handles[-1])

            try:
                html_completo = driver.page_source
                html_lower = html_completo.lower()

                # Detectar límite del sitio
                if (
                    "reached the limit" in html_lower or
                    "alcanzado el límite" in html_lower or
                    "daily limit" in html_lower or
                    "límite" in html_lower or
                    "too many requests" in html_lower
                ):
                    resultado_estado = "LIMITE_WEB"
                    break

                # Detectar resultado exitoso
                divs = driver.find_elements(By.XPATH, '//*[@id="scr_save"]')
                if divs and divs[0].is_displayed():
                    result_element = divs[0]
                    resultado_estado = "EXITO"
                    break

            except Exception as poll_err:
                _log(f"Poll error (ignorado): {poll_err}")

            time.sleep(1)

        # ── 4. Procesar resultado ──────────────────────────────────
        if resultado_estado == "EXITO":
            estado["consultas_restantes"] = max(0, estado["consultas_restantes"] - 1)

            # Scrollear hasta el resultado
            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", result_element)
            time.sleep(0.5)

            resultado_texto = ""
            try:
                # 1. Buscar fila de Blacklist o GSMA
                filas = result_element.find_elements(By.CLASS_NAME, "iuResCard_row")
                for f in filas:
                    t = f.text
                    if "blacklist" in t.lower() or "gsma" in t.lower() or "lista negra" in t.lower():
                        val = f.find_elements(By.CLASS_NAME, "iuResCard_value")
                        if val:
                            resultado_texto = val[0].text.strip()
                            break
                # 2. Fallback a etiquetas destacadas
                if not resultado_texto:
                    font_els = result_element.find_elements(By.XPATH, './/font | .//b | .//strong')
                    for fe in font_els:
                        ft = fe.text.strip()
                        if any(k in ft.lower() for k in ["clean", "limpio", "blacklist", "reported", "blocked"]):
                            resultado_texto = ft
                            break
                # 3. Fallback a texto completo
                if not resultado_texto:
                    resultado_texto = result_element.text.strip()
            except Exception:
                resultado_texto = result_element.text.strip() if result_element else ""

            _log(f"Resultado texto Blacklist: '{resultado_texto}'")
            res_lower = resultado_texto.lower()
            en_blacklist = (
                ("blacklist" in res_lower and "clean" not in res_lower and "not" not in res_lower) or
                "reported" in res_lower or
                "blocked" in res_lower or
                "bloqueado" in res_lower or
                "robado" in res_lower or
                "hurto" in res_lower
            )
            if "clean" in res_lower or "limpio" in res_lower or "no reportado" in res_lower or "not blacklisted" in res_lower:
                en_blacklist = False

            valor_bd = "Blacklist" if en_blacklist else "clean"
            mensaje = (
                f"IMEI reportado en Blacklist GSMA: {resultado_texto}"
                if en_blacklist
                else "IMEI limpio — no está en la lista negra GSMA"
            )

            # Pantallazo
            screenshot_path = None
            if con_pantallazo and result_element:
                base_dir = os.path.dirname(os.path.abspath(__file__))
                temp_dir = os.path.join(base_dir, "temp_screenshots")
                os.makedirs(temp_dir, exist_ok=True)
                screenshot_path = os.path.join(temp_dir, f"blacklist_{imei}.png")
                try:
                    result_element.screenshot(screenshot_path)
                    _log(f"Pantallazo guardado: {screenshot_path}")
                except Exception as e:
                    _log(f"Pantallazo de elemento falló ({e}), intentando página completa.")
                    try:
                        driver.save_screenshot(screenshot_path)
                    except Exception:
                        screenshot_path = None

            guardar_estado(estado)
            _output({
                "status": "success",
                "en_blacklist": en_blacklist,
                "valor_bd": valor_bd,
                "mensaje": mensaje,
                "resultado_texto": resultado_texto,
                "fuente": "GSMA Blacklist — iunlocker.com",
                "screenshot_path": screenshot_path,
                "consultas_restantes": estado["consultas_restantes"]
            })

        elif resultado_estado == "LIMITE_WEB":
            match = re.search(
                r'(\d+)\s*hour(?:s)?\s*(\d+)\s*minute(?:s)?',
                html_completo, re.IGNORECASE
            )
            horas_bloqueo = int(match.group(1)) if match else HORAS_RESET
            mins_bloqueo = int(match.group(2)) if match else 0

            ahora = datetime.now()
            hasta_dt = ahora + timedelta(hours=horas_bloqueo, minutes=mins_bloqueo)
            estado["bloqueado_hasta"] = hasta_dt.isoformat()
            estado["hora_error"] = ahora.isoformat()
            estado["consultas_restantes"] = 0
            estado["ultimo_reset"] = ahora.isoformat()
            guardar_estado(estado)
            _log(f"Límite detectado. Bloqueado hasta {hasta_dt.isoformat()}")

            _output({
                "status": "limite_web",
                "mensaje": f"Límite diario alcanzado en iunlocker.com. Disponible en {horas_bloqueo}h {mins_bloqueo}m",
                "horas": horas_bloqueo,
                "minutos": mins_bloqueo,
                "screenshot_path": None,
                "consultas_restantes": 0
            })

        else:
            _output({
                "status": "error",
                "mensaje": "Tiempo de espera agotado. El sitio no respondió.",
                "screenshot_path": None,
                "consultas_restantes": estado["consultas_restantes"]
            })

    except Exception as e:
        _log(f"Error general: {e}")
        _output({
            "status": "error",
            "mensaje": f"Error durante la consulta: {str(e)}",
            "screenshot_path": None,
            "consultas_restantes": estado.get("consultas_restantes", LIMITE_CONSULTAS)
        })
    finally:
        try:
            driver.quit()
        except Exception:
            pass


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Consultar Blacklist GSMA en iunlocker.com")
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
        consultar_blacklist(args.imei, con_pantallazo=args.screenshot, headless=not args.visible)
    else:
        parser.print_help()
        sys.exit(1)