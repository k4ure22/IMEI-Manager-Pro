"""
NotificadorAlteracion.py
─────────────────────────
Gestiona la alerta por correo electrónico cuando una página web externa
(como IMEI Colombia u otras) sufre cambios en sus selectores, captcha o estructura.

Envía el correo desde imeimanagerpro@gmail.com hacia martinmh0722@gmail.com
con un diseño HTML estilizado al estándar visual de IMEI Manager Pro.
Permite consultar y persistir la contraseña de aplicación de Gmail en la base de datos.
"""

import os
import sys
import json
import smtplib
import ssl
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

CORREO_EMISOR_IMP = "imeimanagerpro@gmail.com"
CORREO_DESTINO_SOPORTE = "martinmh0722@gmail.com"
CLAVE_CONFIG_DB = "app_password_imp"
LOCAL_CACHE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".imp_credentials.json")


def _guardar_local(app_password: str):
    """Guarda copia local de respaldo."""
    try:
        data = {}
        if os.path.exists(LOCAL_CACHE_FILE):
            try:
                with open(LOCAL_CACHE_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
            except Exception:
                data = {}
        data[CLAVE_CONFIG_DB] = app_password.strip()
        with open(LOCAL_CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f)
    except Exception as e:
        print(f"[WARN] Error guardando respaldo local de contraseña: {e}")


def _obtener_local() -> str:
    """Lee copia local de respaldo si existe."""
    try:
        if os.path.exists(LOCAL_CACHE_FILE):
            with open(LOCAL_CACHE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get(CLAVE_CONFIG_DB, "").strip()
    except Exception:
        pass
    return ""


def guardar_app_password_imp(app_password: str, supabase_client=None) -> dict:
    """
    Persiste la contraseña de aplicación en la base de datos Supabase
    y en caché local seguro.
    """
    pwd = (app_password or "").strip()
    if not pwd:
        return {"status": "error", "mensaje": "La contraseña de aplicación no puede estar vacía."}

    _guardar_local(pwd)

    if supabase_client:
        try:
            supabase_client.table('configuracion').upsert({
                'clave': CLAVE_CONFIG_DB,
                'valor': pwd
            }).execute()
        except Exception as e:
            print(f"[WARN] Advertencia guardando en BD Supabase: {e}")
            # Si falla la BD remota, el respaldo local ya está guardado
            return {"status": "success", "mensaje": "Guardado en respaldo local (aviso en BD remota)."}

    return {"status": "success", "mensaje": "Contraseña de aplicación guardada correctamente en la base de datos."}


def obtener_app_password_imp(supabase_client=None) -> str:
    """
    Recupera la contraseña de aplicación desde Supabase o desde el caché local.
    """
    if supabase_client:
        try:
            res = supabase_client.table('configuracion').select('valor').eq('clave', CLAVE_CONFIG_DB).limit(1).execute()
            if res.data and len(res.data) > 0 and res.data[0].get('valor'):
                pwd = res.data[0]['valor'].strip()
                if pwd:
                    _guardar_local(pwd)
                    return pwd
        except Exception as e:
            print(f"[WARN] No se pudo leer contraseña de Supabase: {e}")

    return _obtener_local()


def construir_html_correo(pagina: str, detalle: str, nombre_remitente: str) -> str:
    """
    Genera una plantilla HTML de correo con estética liquid dark / cyberpunk
    conforme al diseño de IMEI Manager Pro.
    """
    fecha_actual = datetime.now().strftime("%d/%m/%Y %I:%M %p")
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Alerta de Modificación de Página</title>
<style>
  body {{
    margin: 0;
    padding: 0;
    background-color: #0b0f19;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #e2e8f0;
  }}
  .container {{
    max-width: 620px;
    margin: 32px auto;
    background: #111827;
    border-radius: 20px;
    border: 1px solid rgba(239, 68, 68, 0.35);
    overflow: hidden;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(239, 68, 68, 0.15);
  }}
  .header {{
    background: linear-gradient(135deg, #1e1b4b 0%, #31102f 50%, #450a0a 100%);
    padding: 32px 28px 24px 28px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    text-align: center;
  }}
  .badge-app {{
    display: inline-block;
    padding: 5px 14px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #fca5a5;
    text-transform: uppercase;
    margin-bottom: 14px;
  }}
  .header h1 {{
    margin: 0;
    font-size: 23px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
    line-height: 1.3;
  }}
  .body-content {{
    padding: 32px 28px;
  }}
  .alert-box {{
    background: rgba(239, 68, 68, 0.08);
    border-left: 4px solid #ef4444;
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 24px;
  }}
  .alert-box p {{
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: #fecaca;
  }}
  .detail-card {{
    background: #1a2234;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 20px;
    margin-bottom: 24px;
  }}
  .detail-row {{
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 13px;
  }}
  .detail-row:last-child {{
    border-bottom: none;
  }}
  .detail-label {{
    color: #94a3b8;
    font-weight: 500;
  }}
  .detail-value {{
    color: #f1f5f9;
    font-weight: 600;
    text-align: right;
  }}
  .log-box {{
    background: #090d16;
    border-radius: 10px;
    padding: 14px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    color: #cbd5e1;
    line-height: 1.5;
    border: 1px solid rgba(255, 255, 255, 0.04);
    word-break: break-word;
    margin-top: 14px;
  }}
  .action-note {{
    font-size: 13px;
    color: #cbd5e1;
    line-height: 1.6;
    margin-bottom: 28px;
  }}
  .footer {{
    background: #0d121f;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding: 22px 28px;
    text-align: center;
  }}
  .footer-sender {{
    font-size: 13px;
    font-weight: 600;
    color: #a78bfa;
    margin-bottom: 6px;
  }}
  .footer-sub {{
    font-size: 11px;
    color: #64748b;
  }}
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge-app">🚨 Alerta de Integridad · IMP</div>
      <h1>La página {pagina} ha sido modificada</h1>
    </div>
    <div class="body-content">
      <div class="alert-box">
        <p><strong>Atención Martin:</strong> El sistema de consultas automáticas de IMEI Manager Pro detectó que la estructura interna, selectores o captcha de la página <strong>{pagina}</strong> cambiaron o no se encuentran disponibles.</p>
      </div>

      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Página Afectada</span>
          <span class="detail-value">{pagina}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Fecha y Hora</span>
          <span class="detail-value">{fecha_actual}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Emisor del Reporte</span>
          <span class="detail-value">{CORREO_EMISOR_IMP}</span>
        </div>
      </div>

      <div class="action-note">
        <strong>Detalle técnico del cambio detectado:</strong>
        <div class="log-box">{detalle or "No se pudo localizar uno o más selectores clave en el DOM de la página."}</div>
      </div>

      <p class="action-note">
        Se requiere su intervención técnica para inspeccionar la nueva estructura de la página y actualizar los selectores o el flujo de consulta en el código fuente.
      </p>
    </div>

    <div class="footer">
      <div class="footer-sender">Enviado por {nombre_remitente}</div>
      <div class="footer-sub">IMEI Manager Pro · Notificaciones de Seguridad y Monitoreo</div>
    </div>
  </div>
</body>
</html>"""


def enviar_correo_alteracion(
    *,
    pagina: str,
    detalle: str,
    nombre_remitente: str,
    app_password: str | None = None,
    supabase_client=None
) -> dict:
    """
    Envía el correo de alerta de modificación de página a Martin.
    """
    try:
        pagina = pagina or "Página de Consulta"
        detalle = detalle or "Uno de los selectores o elementos esperados no fue localizado."
        nombre_remitente = nombre_remitente or "Usuario de IMP"

        # Resolver contraseña de aplicación
        pwd = (app_password or "").strip()
        if not pwd:
            pwd = obtener_app_password_imp(supabase_client)

        if not pwd:
            return {
                "status": "error",
                "falta_password": True,
                "mensaje": "No se ha configurado la contraseña de aplicación de Gmail para imeimanagerpro@gmail.com. Por favor ingrésela para enviar el reporte."
            }

        # Guardar en caso de que haya sido suministrada manualmente
        if app_password:
            guardar_app_password_imp(pwd, supabase_client)

        # Construir mensaje MIME
        asunto = f"🚨 ALERTA: La página {pagina} ha sido modificada - IMEI Manager Pro"
        html_cuerpo = construir_html_correo(pagina, detalle, nombre_remitente)

        msg = MIMEMultipart("alternative")
        msg["From"] = f"IMEI Manager Pro <{CORREO_EMISOR_IMP}>"
        msg["To"] = CORREO_DESTINO_SOPORTE
        msg["Subject"] = asunto

        # Versión texto plano de respaldo
        texto_plano = (
            f"ALERTA: La página {pagina} ha sido modificada.\n\n"
            f"El estado de la página {pagina} ha cambiado, por favor solicite soporte a Martin.\n\n"
            f"Detalle técnico:\n{detalle}\n\n"
            f"Fecha: {datetime.now().strftime('%d/%m/%Y %I:%M %p')}\n\n"
            f"Enviado por {nombre_remitente}\n"
            f"Desde {CORREO_EMISOR_IMP}"
        )

        msg.attach(MIMEText(texto_plano, "plain", "utf-8"))
        msg.attach(MIMEText(html_cuerpo, "html", "utf-8"))

        # Conectar por SSL y enviar
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context, timeout=20) as server:
            server.login(CORREO_EMISOR_IMP, pwd.replace(" ", ""))
            server.sendmail(CORREO_EMISOR_IMP, CORREO_DESTINO_SOPORTE, msg.as_string())

        return {
            "status": "success",
            "mensaje": f"Notificación enviada exitosamente a Martin ({CORREO_DESTINO_SOPORTE})."
        }

    except smtplib.SMTPAuthenticationError:
        return {
            "status": "error",
            "falta_password": True,
            "mensaje": "Autenticación fallida con imeimanagerpro@gmail.com. Verifique que la contraseña de aplicación de 16 caracteres sea correcta."
        }
    except smtplib.SMTPException as e:
        return {"status": "error", "mensaje": f"Error SMTP al enviar correo: {str(e)}"}
    except Exception as e:
        return {"status": "error", "mensaje": f"Error inesperado al enviar notificación: {str(e)}"}
