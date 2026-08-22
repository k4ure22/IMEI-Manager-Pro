import os
import sys

if sys.platform == "win32":
    if hasattr(sys.stdout, 'reconfigure'):
        try: sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        except Exception: pass
    if hasattr(sys.stderr, 'reconfigure'):
        try: sys.stderr.reconfigure(encoding='utf-8', errors='replace')
        except Exception: pass

from datetime import datetime
from PIL import Image, ImageDraw, ImageFont

def get_font(size=24, bold=False):
    """Obtiene fuentes TrueType de alta calidad del sistema"""
    possible_fonts = [
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf' if bold else '/System/Library/Fonts/Supplemental/Arial.ttf',
        '/System/Library/Fonts/Supplemental/Verdana.ttf',
        '/System/Library/Fonts/Helvetica.ttc',
        r'C:\Windows\Fonts\arialbd.ttf' if bold else r'C:\Windows\Fonts\arial.ttf'
    ]
    for font_path in possible_fonts:
        if os.path.exists(font_path):
            try:
                return ImageFont.truetype(font_path, size)
            except Exception:
                pass
    return ImageFont.load_default()

def truncar_texto(draw, text, font, max_width):
    """Trunca el texto con '...' si excede el ancho máximo disponible para evitar desbordamientos"""
    if draw.textlength(text, font=font) <= max_width:
        return text
    
    for i in range(len(text) - 1, 0, -1):
        truncated = text[:i] + "..."
        if draw.textlength(truncated, font=font) <= max_width:
            return truncated
    return text

def estilizar_pantallazo(screenshot_path: str, datos: dict) -> str:
    """
    Genera un comprobante visual estilizado en Alta Definición (2x Canvas HD) en fondo claro,
    con tarjetas de datos estructuradas sin desbordamiento de texto y fuentes de alta resolución.
    """
    if not screenshot_path or not os.path.exists(screenshot_path):
        return screenshot_path

    try:
        raw_img = Image.open(screenshot_path).convert("RGBA")
    except Exception as e:
        print(f"⚠️ Error abriendo imagen para estilizar: {e}")
        return screenshot_path

    # Autotrim de márgenes transparentes/blancos excesivos
    try:
        from PIL import ImageChops
        bg = Image.new("RGBA", raw_img.size, (255, 255, 255, 255))
        diff = ImageChops.difference(raw_img, bg)
        bbox = diff.getbbox()
        if bbox:
            w, h = raw_img.size
            pad = 8
            crop_box = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), min(h, bbox[3] + pad))
            if (crop_box[2] - crop_box[0]) < w * 0.95 or (crop_box[3] - crop_box[1]) < h * 0.95:
                raw_img = raw_img.crop(crop_box)
        else:
            bbox_alpha = raw_img.getbbox()
            if bbox_alpha:
                raw_img = raw_img.crop(bbox_alpha)
    except Exception:
        pass

    orig_w, orig_h = raw_img.size
    operador = str(datos.get("operador", "") or datos.get("OPERADOR", "") or "OFICIAL").upper().strip()

    # ── ESCALA 2X RETINA HD ──
    # WOM compacto (ancho base 540px -> 1080px HD), ETB/Otros (650px -> 1300px HD)
    base_target_w = 520 if "WOM" in operador else 680
    scale_factor = base_target_w / orig_w if orig_w > 0 else 1.0
    base_target_h = int(orig_h * scale_factor)

    # Multiplicador Retina HD para nitidez superior
    hd_scale = 2
    target_w = base_target_w * hd_scale
    target_h = base_target_h * hd_scale

    raw_img_resized = raw_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

    margin_x = 40 * hd_scale
    header_h = 80 * hd_scale

    # Extraer variables
    imei = str(datos.get("imei", "") or datos.get("IMEI", "") or "").strip()
    modelo = str(datos.get("modelo", "") or datos.get("MODELO", "") or "").strip()
    estado = str(datos.get("estado", "") or datos.get("ESTADO", "EXITOSO")).strip()
    propietario = str(datos.get("propietario", "") or datos.get("encargado", "") or datos.get("cliente", "") or "").strip()
    linea = str(datos.get("linea", "") or datos.get("linea_wom", "") or datos.get("linea_etb", "") or "").strip()
    fecha = datos.get("fecha", datetime.now().strftime("%Y-%m-%d %I:%M %p"))

    # Esquema de colores por operador
    if "WOM" in operador:
        op_color = (225, 29, 72, 255)    # Rosa WOM
        op_bg = (255, 241, 242, 255)
    elif "ETB" in operador:
        op_color = (2, 132, 199, 255)    # Cyan ETB
        op_bg = (240, 249, 255, 255)
    else:
        op_color = (5, 150, 105, 255)    # Verde Colombia
        op_bg = (236, 253, 245, 255)

    # Estado Badge
    est_lower = estado.lower()
    if any(k in est_lower for k in ["éxito", "exitoso", "registrado", "success", "ok", "completado"]):
        status_text = "✓ REGISTRADO EXITOSAMENTE"
        status_fg = (21, 128, 61, 255)
        status_bg = (220, 252, 231, 255)
    elif any(k in est_lower for k in ["error", "fallo", "blacklist", "bloqueado"]):
        status_text = "❌ REGISTRO RECHAZADO"
        status_fg = (185, 28, 28, 255)
        status_bg = (254, 226, 226, 255)
    else:
        status_text = f"ℹ️ {estado.upper()}"
        status_fg = (30, 58, 138, 255)
        status_bg = (219, 234, 254, 255)

    # Helper para conversión de booleanos seguro (soporta "false"/"true" en texto)
    def to_bool(val, default=True):
        if val is None:
            return default
        if isinstance(val, bool):
            return val
        if isinstance(val, (int, float)):
            return val != 0
        if isinstance(val, str):
            v = val.strip().lower()
            if v in ("false", "0", "no", "off", "none", "null"):
                return False
            if v in ("true", "1", "yes", "si", "sí", "on"):
                return True
        return bool(val)

    # Flags de inclusión
    inc_operador = to_bool(datos.get("incluir_operador"), True)
    inc_imei = to_bool(datos.get("incluir_imei"), True)
    inc_modelo = to_bool(datos.get("incluir_modelo"), True)
    inc_linea = to_bool(datos.get("incluir_linea"), True)
    inc_propietario = to_bool(datos.get("incluir_propietario"), True)

    info_items = []
    if inc_imei:
        info_items.append(("IMEI del Equipo", imei if imei else "Sin información"))
    if inc_modelo:
        info_items.append(("Modelo", modelo if modelo else "Sin información"))
    if inc_propietario:
        info_items.append(("Titular Registrado", propietario if propietario else "Sin información"))
    if inc_linea:
        info_items.append(("Línea Celular", linea if linea else "Sin información"))
    info_items.append(("Fecha / Hora", fecha))

    # Filas de datos estructuradas en 1 columna limpia
    row_height = 48 * hd_scale
    footer_h = (len(info_items) * row_height) + (55 * hd_scale)

    card_w = target_w + (margin_x * 2)
    card_h = header_h + target_h + footer_h + (30 * hd_scale)

    # Crear lienzo en resolución Retina HD
    canvas = Image.new("RGBA", (card_w, card_h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(canvas)

    # Tarjeta blanca principal con bordes pulidos
    card_box = [20 * hd_scale, 20 * hd_scale, card_w - (20 * hd_scale), card_h - (20 * hd_scale)]
    draw.rounded_rectangle(card_box, radius=18 * hd_scale, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=3 * hd_scale)

    # Fuentes ajustadas a escala Retina
    font_badge = get_font(13 * hd_scale, bold=True)
    font_lbl = get_font(12 * hd_scale, bold=False)
    font_val = get_font(13 * hd_scale, bold=True)
    font_wm = get_font(11 * hd_scale, bold=False)

    # ── HEADER ──
    badge_h = 32 * hd_scale

    # Operador Badge (Solo si inc_operador es True)
    if inc_operador:
        badge_w_op = 130 * hd_scale
        draw.rounded_rectangle([margin_x, 32 * hd_scale, margin_x + badge_w_op, 32 * hd_scale + badge_h], radius=8 * hd_scale, fill=op_bg, outline=op_color, width=2 * hd_scale)
        draw.text((margin_x + (15 * hd_scale), 37 * hd_scale), f"  {operador}  ", fill=op_color, font=font_badge)

    # Status Badge (Derecha)
    status_w = 260 * hd_scale
    status_x1 = card_w - margin_x - status_w
    draw.rounded_rectangle([status_x1, 32 * hd_scale, card_w - margin_x, 32 * hd_scale + badge_h], radius=8 * hd_scale, fill=status_bg, outline=status_fg, width=2 * hd_scale)
    draw.text((status_x1 + (14 * hd_scale), 37 * hd_scale), status_text, fill=status_fg, font=font_badge)

    # ── CAPTURA DE PANTALLA (CENTRO) ──
    img_y = header_h + (10 * hd_scale)
    draw.rectangle([margin_x - (2 * hd_scale), img_y - (2 * hd_scale), margin_x + target_w + (2 * hd_scale), img_y + target_h + (2 * hd_scale)], fill=(241, 245, 249, 255), outline=(203, 213, 225, 255), width=2 * hd_scale)
    canvas.paste(raw_img_resized, (margin_x, img_y), raw_img_resized if raw_img_resized.mode == 'RGBA' else None)

    # ── FOOTER ORGANIZADO FILA POR FILA (0% OVERFLOW) ──
    footer_y = img_y + target_h + (24 * hd_scale)
    draw.line([(margin_x, footer_y - (10 * hd_scale)), (card_w - margin_x, footer_y - (10 * hd_scale))], fill=(226, 232, 240, 255), width=2 * hd_scale)

    row_y = footer_y
    label_w_fixed = 170 * hd_scale

    for label_str, val_str in info_items:
        # Fondo sutil para cada fila de dato
        row_box = [margin_x, row_y, card_w - margin_x, row_y + (40 * hd_scale)]
        draw.rounded_rectangle(row_box, radius=8 * hd_scale, fill=(248, 250, 252, 255), outline=(241, 245, 249, 255), width=1 * hd_scale)

        # Etiqueta
        draw.text((margin_x + (14 * hd_scale), row_y + (9 * hd_scale)), label_str + ":", fill=(100, 116, 139, 255), font=font_lbl)

        # Valor formateado y truncado dinámicamente si excede el ancho libre
        val_max_w = (card_w - margin_x) - (margin_x + label_w_fixed + (20 * hd_scale))
        val_clean = truncar_texto(draw, val_str, font_val, val_max_w)
        draw.text((margin_x + label_w_fixed, row_y + (8 * hd_scale)), val_clean, fill=(15, 23, 42, 255), font=font_val)

        row_y += row_height

    # Marca de agua final
    wm_y = row_y + (10 * hd_scale)
    draw.text((margin_x + (10 * hd_scale), wm_y), "IMEI Manager Pro • Comprobante Oficial de Verificación", fill=(148, 163, 184, 255), font=font_wm)

    # Redimensionar al tamaño óptimo final con suavizado Lanczos
    final_w = int(card_w / hd_scale)
    final_h = int(card_h / hd_scale)
    final_img = canvas.resize((final_w, final_h), Image.Resampling.LANCZOS).convert("RGB")
    final_img.save(screenshot_path, "PNG", quality=98)
    return screenshot_path
