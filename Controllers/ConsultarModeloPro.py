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
    Revisa si el período de 24h ya cumplió y reinicia el conteo.
    También limpia el bloqueo web si ya expiró.
    """
    ahora = datetime.now()

    # Reset por tiempo del contador propio (24h desde último reset)
    if estado.get("ultimo_reset"):
        ultimo_reset = datetime.fromisoformat(estado["ultimo_reset"])
        if ahora >= ultimo_reset + timedelta(hours=HORAS_RESET):
            estado["consultas_restantes"] = LIMITE_CONSULTAS
            estado["ultimo_reset"] = ahora.isoformat()
            estado["bloqueado_hasta"] = None

    # Limpiar bloqueo web expirado
    if estado.get("bloqueado_hasta"):
        bloqueado_hasta = datetime.fromisoformat(estado["bloqueado_hasta"])
        if ahora >= bloqueado_hasta:
            estado["bloqueado_hasta"] = None

    return estado

def calcular_tiempo_restante(estado: dict) -> dict:
    """Calcula horas/minutos hasta el próximo reset."""
    ahora = datetime.now()
    ultimo_reset = datetime.fromisoformat(estado.get("ultimo_reset", ahora.isoformat()))
    proximo_reset = ultimo_reset + timedelta(hours=HORAS_RESET)
    diferencia = proximo_reset - ahora
    if diferencia.total_seconds() <= 0:
        return {"horas": 0, "minutos": 0}
    horas, resto = divmod(int(diferencia.total_seconds()), 3600)
    minutos = resto // 60
    return {"horas": horas, "minutos": minutos}

def extraer_modelo_iphone(texto_crudo: str) -> str:
    match = re.search(r'(?i)(iphone\s+.*?)(?=\s+\d+\s*(?:GB|TB)|\s*$)', texto_crudo)
    if match:
        return match.group(1).strip().title()
    return texto_crudo

def _output(data: dict):
    """Imprime el resultado JSON a stdout y termina."""
    print(json.dumps(data, ensure_ascii=False))

def consultar_modelo_pro(imei: str, con_pantallazo: bool = False):
    """
    Consulta el modelo del IMEI en iunlocker.com.
    Gestiona el conteo propio de 5 consultas/24h.
    Emite JSON a stdout.
    """
    estado = leer_estado()
    estado = verificar_y_resetear_si_necesario(estado)

    # ── Verificar bloqueo web activo ──
    if estado.get("bloqueado_hasta"):
        bloqueado_hasta = datetime.fromisoformat(estado["bloqueado_hasta"])
        if datetime.now() < bloqueado_hasta:
            t = calcular_tiempo_restante(estado)
            guardar_estado(estado)
            _output({
                "status": "limite_web",
                "mensaje": "Límite del sitio web activo",
                "horas": t["horas"],
                "minutos": t["minutos"],
                "consultas_restantes": estado["consultas_restantes"]
            })
            return

    # ── Verificar cupos propios ──
    if estado["consultas_restantes"] <= 0:
        t = calcular_tiempo_restante(estado)
        guardar_estado(estado)
        _output({
            "status": "sin_cupos",
            "mensaje": f"Sin consultas disponibles. Reinicio en {t['horas']}h {t['minutos']}m",
            "horas": t["horas"],
            "minutos": t["minutos"],
            "consultas_restantes": 0
        })
        return

    # ── Lanzar Selenium ──
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

    driver = webdriver.Chrome(options=chrome_options)

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

            hora_desbloqueo = datetime.now() + timedelta(
                hours=horas_bloqueo, minutes=minutos_bloqueo
            )
            estado["bloqueado_hasta"] = hora_desbloqueo.isoformat()
            # Resetear el conteo propio también (sincronizar con el sitio)
            estado["consultas_restantes"] = 0
            estado["ultimo_reset"] = hora_desbloqueo.isoformat()
            guardar_estado(estado)

            _output({
                "status": "limite_web",
                "mensaje": "Límite diario alcanzado en el sitio",
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

    args = parser.parse_args()

    if args.estado:
        _output(obtener_estado_cupos())
    elif args.imei:
        consultar_modelo_pro(args.imei, con_pantallazo=args.screenshot)
    else:
        parser.print_help()
        sys.exit(1)