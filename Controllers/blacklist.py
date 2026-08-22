"""
blacklist.py — Consulta GSMA Blacklist en iunlocker.com/es/gsma_blacklist_check.php
Uso CLI: python blacklist.py <imei> [--screenshot]
Salida:  JSON en stdout. Logs a stderr.
Patrón idéntico a ConsultarModeloPro.py (polling de page_source).
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
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

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
            with open(ARCHIVO_ESTADO, "r") as f:
                estado = json.load(f)
                if "consultas_restantes" not in estado:
                    estado["consultas_restantes"] = LIMITE_CONSULTAS
                if "ultimo_reset" not in estado:
                    estado["ultimo_reset"] = datetime.now().isoformat()
                return estado
        except Exception:
            pass
    return {
        "consultas_restantes": LIMITE_CONSULTAS,
        "bloqueado_hasta": None,
        "ultimo_reset": datetime.now().isoformat()
    }


def guardar_estado(estado: dict):
    _asegurar_dir()
    with open(ARCHIVO_ESTADO, "w") as f:
        json.dump(estado, f, indent=2)


def verificar_y_resetear_si_necesario(estado: dict) -> dict:
    ahora = datetime.now()

    # Reset por tiempo (24h desde último reset)
    if estado.get("ultimo_reset"):
        ultimo_reset = datetime.fromisoformat(estado["ultimo_reset"])
        if ahora >= ultimo_reset + timedelta(hours=HORAS_RESET):
            estado["consultas_restantes"] = LIMITE_CONSULTAS
            estado["ultimo_reset"] = ahora.isoformat()
            estado["bloqueado_hasta"] = None

    # Limpiar bloqueo web si expiró
    if estado.get("bloqueado_hasta"):
        bloqueado_hasta = datetime.fromisoformat(estado["bloqueado_hasta"])
        if ahora >= bloqueado_hasta:
            estado["bloqueado_hasta"] = None

    return estado


def calcular_tiempo_restante(estado: dict) -> dict:
    ahora = datetime.now()
    
    # Si hay un bloqueo web activo, calcular hasta ese desbloqueo
    if estado.get("bloqueado_hasta"):
        bloqueado_hasta = datetime.fromisoformat(estado["bloqueado_hasta"])
        if ahora < bloqueado_hasta:
            diferencia = bloqueado_hasta - ahora
            horas, resto = divmod(int(diferencia.total_seconds()), 3600)
            return {"horas": horas, "minutos": resto // 60}

    # Si no, calcular hasta el próximo reset automático
    ultimo_reset = datetime.fromisoformat(estado.get("ultimo_reset", ahora.isoformat()))
    proximo_reset = ultimo_reset + timedelta(hours=HORAS_RESET)
    diferencia = proximo_reset - ahora
    if diferencia.total_seconds() <= 0:
        return {"horas": 0, "minutos": 0}
    horas, resto = divmod(int(diferencia.total_seconds()), 3600)
    minutos = resto // 60
    return {"horas": horas, "minutos": minutos}


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


# ─── DRIVER ──────────────────────────────────────────────────────────────────

def _init_driver() -> webdriver.Chrome:
    """Mismo patrón que ConsultarModeloPro.py."""
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--log-level=3")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    prefs = {
        "profile.managed_default_content_settings.images": 2,
        "profile.managed_default_content_settings.stylesheet": 2,
    }
    chrome_options.add_experimental_option("prefs", prefs)
    return webdriver.Chrome(options=chrome_options)


# ─── CONSULTA PRINCIPAL ───────────────────────────────────────────────────────

def consultar_blacklist(imei: str, con_pantallazo: bool = False) -> None:
    _log(f"Iniciando consulta Blacklist GSMA para IMEI: {imei}")

    # Verificar si estamos bloqueados por límite diario
    estado = leer_estado()
    estado = verificar_y_resetear_si_necesario(estado)

    # 1. Verificar bloqueo web activo
    if estado.get("bloqueado_hasta"):
        hasta = datetime.fromisoformat(estado["bloqueado_hasta"])
        if datetime.now() < hasta:
            t = calcular_tiempo_restante(estado)
            guardar_estado(estado)
            _log(f"Bloqueado por límite diario del sitio. Disponible en {t['horas']}h {t['minutos']}m")
            _output({
                "status": "limite_web",
                "mensaje": f"Límite diario alcanzado en iunlocker.com. Disponible en {t['horas']}h {t['minutos']}m",
                "horas": t["horas"],
                "minutos": t["minutos"],
                "consultas_restantes": estado["consultas_restantes"]
            })
            return

    # 2. Verificar cupos propios
    if estado["consultas_restantes"] <= 0:
        t = calcular_tiempo_restante(estado)
        guardar_estado(estado)
        _log(f"Sin consultas de Blacklist disponibles. Reinicio en {t['horas']}h {t['minutos']}m")
        _output({
            "status": "sin_cupos",
            "mensaje": f"Sin consultas de Blacklist disponibles. Reinicio en {t['horas']}h {t['minutos']}m",
            "horas": t["horas"],
            "minutos": t["minutos"],
            "consultas_restantes": 0
        })
        return

    driver = _init_driver()
    try:
        timeout = 25
        end_time = time.time() + timeout

        _log("Cargando página...")
        driver.get("https://iunlocker.com/es/gsma_blacklist_check.php")
        time.sleep(random.uniform(0.8, 1.4))

        # ── 1. Campo IMEI ──────────────────────────────────────────
        input_xpath = "/html/body/div[2]/section[1]/div/div/form/div[2]/input[1]"
        imei_field = None
        while time.time() < end_time:
            els = driver.find_elements(By.XPATH, input_xpath)
            if els:
                imei_field = els[0]
                break
            time.sleep(0.3)

        if not imei_field:
            _output({"status": "error", "mensaje": "No se encontró el campo IMEI.", "screenshot_path": None})
            return

        imei_field.send_keys(imei)   # Escritura rápida
        _log(f"IMEI escrito: {imei}")
        time.sleep(random.uniform(0.3, 0.6))

        # ── 2. Botón ───────────────────────────────────────────────
        button_xpath = '//*[@id="timer1"]/button'
        btn = None
        while time.time() < end_time:
            els = driver.find_elements(By.XPATH, button_xpath)
            if els:
                btn = els[0]
                break
            time.sleep(0.3)

        if not btn:
            _output({"status": "error", "mensaje": "No se encontró el botón de consulta.", "screenshot_path": None})
            return

        btn.click()
        _log("Botón clickeado. Esperando resultado...")

        # ── 3. Polling del resultado (igual que ConsultarModeloPro) ─
        resultado_estado = None
        result_element = None
        html_completo = ""

        while time.time() < end_time:
            try:
                html_completo = driver.page_source
                html_lower = html_completo.lower()

                # Detectar límite del sitio
                if (
                    "reached the limit" in html_lower or
                    "you have reached" in html_lower or
                    "daily limit" in html_lower or
                    "too many requests" in html_lower or
                    "please try again" in html_lower
                ):
                    resultado_estado = "LIMITE_WEB"
                    break

                # Detectar resultado exitoso
                divs = driver.find_elements(By.XPATH, '//*[@id="scr_save"]')
                if divs:
                    result_element = divs[0]
                    resultado_estado = "EXITO"
                    break

            except Exception as poll_err:
                _log(f"Poll error (ignorado): {poll_err}")

            time.sleep(0.5)

        # ── 4. Procesar resultado ──────────────────────────────────
        if resultado_estado == "EXITO":
            # Descontar cupo
            estado["consultas_restantes"] = max(0, estado["consultas_restantes"] - 1)

            resultado_texto = ""
            try:
                status_xpath = '//*[@id="scr_save"]/div[2]/div[2]/div/div[2]/div[2]/font'
                font_els = driver.find_elements(By.XPATH, status_xpath)
                if font_els:
                    resultado_texto = font_els[0].text.strip()
                else:
                    resultado_texto = result_element.text.strip()
            except Exception:
                resultado_texto = result_element.text.strip() if result_element else ""

            _log(f"Resultado: '{resultado_texto}'")
            en_blacklist = (
                "blacklist" in resultado_texto.lower() or
                "reported" in resultado_texto.lower() or
                "blocked" in resultado_texto.lower()
            )
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
                    driver.execute_script(
                        "arguments[0].scrollIntoView({block: 'center'});", result_element
                    )
                    time.sleep(0.4)
                    result_element.screenshot(screenshot_path)
                    _log(f"Pantallazo guardado: {screenshot_path}")
                except Exception as e:
                    _log(f"Pantallazo de elemento falló ({e}), página completa.")
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
            # Intentar extraer el tiempo de espera del HTML
            match = re.search(
                r'(\d+)\s*hour(?:s)?\s*(\d+)\s*minute(?:s)?',
                html_completo, re.IGNORECASE
            )
            horas_bloqueo = int(match.group(1)) if match else HORAS_RESET
            mins_bloqueo = int(match.group(2)) if match else 0

            # Guardar bloqueo
            hasta_dt = datetime.now() + timedelta(hours=horas_bloqueo, minutes=mins_bloqueo)
            estado["bloqueado_hasta"] = hasta_dt.isoformat()
            # Sincronizar cupos propios con el sitio web
            estado["consultas_restantes"] = 0
            estado["ultimo_reset"] = hasta_dt.isoformat()
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

    args = parser.parse_args()

    if args.estado:
        _output(obtener_estado_cupos())
    elif args.imei:
        consultar_blacklist(args.imei, con_pantallazo=args.screenshot)
    else:
        parser.print_help()
        sys.exit(1)