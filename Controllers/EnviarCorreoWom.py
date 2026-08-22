"""
EnviarCorreoWom.py
──────────────────
Envía el correo de solicitud de desbloqueo de IMEI por WOM
desde el correo del encargado hacia el destinatario WOM.

Uso (desde main.py via threading):
    from EnviarCorreoWom import enviar_correo_desbloqueo
    resultado = enviar_correo_desbloqueo(datos)
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

import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders


# Destinatario oficial de solicitudes de desbloqueo WOM
DESTINATARIO_WOM = "roboperdida@movilpt.co"


def enviar_correo_desbloqueo(
    *,
    correo_encargado: str,
    app_password: str,
    nombre_encargado: str,
    lineas_wom: str,           # ej: "3001234567, 3007654321, 3009999999"
    imei: str,
    pin_desbloqueo: str,       # puede venir vacío → se indica como "PENDIENTE"
    identificacion: str,
    modelo: str = "",
    ruta_foto_dispositivo: str | None = None,
    ruta_declaracion_wom: str | None = None,
    ruta_foto_cc: str | None = None,
) -> dict:
    """
    Construye y envía el correo de desbloqueo WOM.

    Returns:
        {"status": "success", "mensaje": "..."}  o
        {"status": "error",   "mensaje": "..."}
    """
    try:
        # ── Validaciones básicas ──────────────────────────────────────
        if modelo:
            mod_l = modelo.strip().lower()
            if not mod_l or mod_l in ['error', 'error pro'] or mod_l.startswith('error'):
                return {"status": "error", "mensaje": "El modelo del dispositivo es obligatorio y no puede ser 'Error' o 'Error Pro'."}
        if not correo_encargado or "@" not in correo_encargado:
            return {"status": "error", "mensaje": "Correo del encargado inválido."}
        if not app_password:
            return {"status": "error", "mensaje": "Contraseña de aplicación no configurada."}
        if not nombre_encargado:
            return {"status": "error", "mensaje": "Falta el nombre del encargado."}
        if not lineas_wom:
            return {"status": "error", "mensaje": "Faltan las líneas WOM del encargado."}
        if not imei:
            return {"status": "error", "mensaje": "Falta el IMEI."}
        if not identificacion:
            return {"status": "error", "mensaje": "Falta el número de identificación (CC)."}

        pin_texto = pin_desbloqueo.strip() if pin_desbloqueo and pin_desbloqueo.strip() else "PENDIENTE"

        # ── Asunto ───────────────────────────────────────────────────
        asunto = f"solicitud de desbloqueo imei {imei}"

        # ── Cuerpo del correo ─────────────────────────────────────────
        # Formatear líneas WOM en líneas separadas
        lineas_lista = [l.strip() for l in lineas_wom.split(",") if l.strip()]
        lineas_formateadas = "\n".join(lineas_lista)

        cuerpo = (
            f"{nombre_encargado},\n\n"
            f"{lineas_formateadas}\n\n"
            f"{imei}\n\n"
            f"Pin de desbloqueo: {pin_texto}\n\n"
            f"# de identificación CC: {identificacion}\n\n"
            f"Adjunto foto del dispositivo a desbloquear.\n\n"
            f"Adjunto declaración WOM generada y fotocopia de CC."
        )

        # ── Armar mensaje MIME ────────────────────────────────────────
        msg = MIMEMultipart()
        msg["From"]    = correo_encargado
        msg["To"]      = DESTINATARIO_WOM
        msg["Subject"] = asunto
        msg.attach(MIMEText(cuerpo, "plain", "utf-8"))

        # ── Adjuntar foto del dispositivo ─────────────────────────────
        if ruta_foto_dispositivo and os.path.isfile(ruta_foto_dispositivo):
            nombre_foto = os.path.basename(ruta_foto_dispositivo)
            with open(ruta_foto_dispositivo, "rb") as f:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header("Content-Disposition", f'attachment; filename="{nombre_foto}"')
            msg.attach(part)

        # ── Adjuntar declaración WOM ──────────────────────────────────
        if ruta_declaracion_wom and os.path.isfile(ruta_declaracion_wom):
            nombre_decl = os.path.basename(ruta_declaracion_wom)
            with open(ruta_declaracion_wom, "rb") as f:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header("Content-Disposition", f'attachment; filename="{nombre_decl}"')
            msg.attach(part)

        # ── Adjuntar fotocopia CC ─────────────────────────────────────
        if ruta_foto_cc and os.path.isfile(ruta_foto_cc):
            nombre_cc = os.path.basename(ruta_foto_cc)
            with open(ruta_foto_cc, "rb") as f:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header("Content-Disposition", f'attachment; filename="{nombre_cc}"')
            msg.attach(part)

        # ── Enviar por SMTP SSL (Gmail) ───────────────────────────────
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(correo_encargado, app_password)
            server.sendmail(correo_encargado, DESTINATARIO_WOM, msg.as_string())

        return {
            "status": "success",
            "mensaje": f"Correo de desbloqueo enviado a {DESTINATARIO_WOM}"
        }

    except smtplib.SMTPAuthenticationError:
        return {
            "status": "error",
            "mensaje": "Autenticación fallida. Verifica el correo y la contraseña de aplicación."
        }
    except smtplib.SMTPException as e:
        return {"status": "error", "mensaje": f"Error SMTP: {str(e)}"}
    except Exception as e:
        return {"status": "error", "mensaje": f"Error inesperado: {str(e)}"}
