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
            with open(ARCHIVO_ESTADO, "r") as f:
                estado = json.load(f)
                # Asegurar que tiene todas las claves necesarias
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
    with open(ARCHIVO_ESTADO, "w") as f:
        json.dump(estado, f, indent=2)

def verificar_y_resetear_si_necesario(estado: dict) -> dict:
    """
    Revisa si el período de 24h ya cumplió y limpia bloqueo si ya expiró.
    """
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
    """Calcula horas/minutos exactos hasta el fin del bloqueo o próximo reset."""
    ahora = datetime.now()

    # 1. Si hay un bloqueo web activo en el futuro, calcular hasta ese momento exacto
    if estado.get("bloqueado_hasta"):
        try:
            bloqueado_hasta = datetime.fromisoformat(estado["bloqueado_hasta"])
            if ahora < bloqueado_hasta:
                diferencia = bloqueado_hasta - ahora
                horas, resto = divmod(int(diferencia.total_seconds()), 3600)
                return {"horas": horas, "minutos": resto // 60}
        except Exception:
            pass

    # 2. Si los cupos están agotados, calcular 24h desde ultimo_reset
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

def validar_estado_pagina_web() -> dict:
    """
    Abre iunlocker.com en modo headless y valida si ya es hábil para consultas.
    Si la página sigue reportando límite alcanzado:
      - NO reinicia el conteo (mantiene 0 cupos).
      - Extrae el tiempo restante que reporte el sitio o mantiene el bloqueo previo.
      - Retorna {"habil": False, "status": "limite_web", ...}
    Si la página está lista y sin mensaje de bloqueo:
      - Reinicia el conteo a 5 cupos y limpia bloqueado_hasta.
      - Retorna {"habil": True, "status": "success", ...}
    """
    estado = leer_estado()
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
        "profile.managed_default_content_settings.stylesheet": 2
    }
    chrome_options.add_experimental_option("prefs", prefs)

    driver = None
    try:
        driver = webdriver.Chrome(options=chrome_options)
        driver.get("https://iunlocker.com/es/check_imei.php")

        timeout = 15
        end_time = time.time() + timeout
        limite_detectado = False
        html_completo = ""

        while time.time() < end_time:
            html_completo = driver.page_source
            html_lower = html_completo.lower()

            if "reached the limit" in html_lower or "límite" in html_lower:
                limite_detectado = True
                break

            elementos = driver.find_elements(By.XPATH, '//*[@id="imei"]')
            if elementos and elementos[0].is_displayed():
                # Formulario disponible y listo
                break
            time.sleep(0.4)

        ahora = datetime.now()
        if limite_detectado:
            # Sigue bloqueado: no reinicia conteo, actualiza tiempo si el sitio lo provee
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
            # Sitio disponible: reinicia conteo y limpia bloqueo
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
        # En caso de error de conexión al validar, volver a donde estaba
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
    match = re.search(r'(?i)(iphone\s+.*?)(?=\s+\d+\s*(?:GB|TB)|\s*$)', texto_crudo)
    if match:
        return match.group(1).strip().title()
    return texto_crudo

def _output(data: dict):
    """Imprime el resultado JSON a stdout y termina."""
    print(json.dumps(data, ensure_ascii=False))

def consultar_modelo_pro(imei: str, con_pantallazo: bool = False, headless: bool = True):
    """
    Consulta el modelo del IMEI en iunlocker.com.
    Gestiona el conteo propio de 5 consultas/24h y valida disponibilidad web.
    Emite JSON a stdout.
    """
    estado = leer_estado()
    estado = verificar_y_resetear_si_necesario(estado)

    # ── Si el estado local marca bloqueo o 0 cupos, validar la página en vivo al presionar ──
    esta_bloqueado = False
    if estado.get("bloqueado_hasta"):
        try:
            bloqueado_hasta = datetime.fromisoformat(estado["bloqueado_hasta"])
            if datetime.now() < bloqueado_hasta:
                esta_bloqueado = True
        except Exception:
            pass

    if esta_bloqueado or estado["consultas_restantes"] <= 0:
        # Validar en vivo si la página ya es hábil
        val_res = validar_estado_pagina_web()
        if not val_res.get("habil"):
            _output(val_res)
            return
        # Si fue hábil, recargar estado con cupos restaurados
        estado = leer_estado()

    # ── Lanzar Selenium ──
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
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    prefs = {
        "profile.managed_default_content_settings.images": 2,
        "profile.managed_default_content_settings.stylesheet": 2
    }
    chrome_options.add_experimental_option("prefs", prefs)

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

        timeout = 20
        end_time = time.time() + timeout
        imei_field = None

        while time.time() < end_time:
            elementos = driver.find_elements(By.XPATH, '//*[@id="imei"]')
            if elementos:
                imei_field = elementos[0]
                break
            time.sleep(0.3)

        if not imei_field:
            _output({
                "status": "error",
                "mensaje": "No se pudo cargar el campo IMEI en el sitio",
                "consultas_restantes": estado["consultas_restantes"]
            })
            return

        imei_field.send_keys(imei)
        driver.find_element(By.XPATH, '//*[@id="timer1"]/a').click()

        resultado_estado = None
        html_completo = ""
        resultado_div_element = None

        while time.time() < end_time:
            html_completo = driver.page_source
            html_lower = html_completo.lower()

            if "reached the limit" in html_lower or "límite" in html_lower:
                resultado_estado = "LIMITE_WEB"
                break

            resultado_div = driver.find_elements(By.XPATH, '//*[@id="scr_save"]')
            if resultado_div:
                resultado_estado = "EXITO"
                resultado_div_element = resultado_div[0]
                break

            time.sleep(0.5)

        if resultado_estado == "EXITO":
            # ── Descuenta una consulta del conteo propio ──
            estado["consultas_restantes"] = max(0, estado["consultas_restantes"] - 1)

            texto_crudo = driver.find_element(
                By.XPATH, '//*[@id="scr_save"]/div/div[1]'
            ).text
            modelo_limpio = extraer_modelo_iphone(texto_crudo)

            screenshot_path = None
            if con_pantallazo and resultado_div_element:
                base_dir = os.path.dirname(os.path.abspath(__file__))
                temp_dir = os.path.join(base_dir, 'temp_screenshots')
                os.makedirs(temp_dir, exist_ok=True)
                screenshot_path = os.path.join(temp_dir, f"modelo_{imei}.png")
                resultado_div_element.screenshot(screenshot_path)

            guardar_estado(estado)
            _output({
                "status": "success",
                "modelo": modelo_limpio,
                "imei": imei,
                "screenshot_path": screenshot_path,
                "consultas_restantes": estado["consultas_restantes"]
            })

        elif resultado_estado == "LIMITE_WEB":
            # Detectó límite del sitio — guardar bloqueo web
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
        driver.quit()


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