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
    """Obtiene fuentes TrueType de alta calidad del sistema (Windows, macOS, Linux)"""
    windir = os.environ.get('WINDIR', r'C:\Windows')
    possible_fonts = [
        # macOS
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf' if bold else '/System/Library/Fonts/Supplemental/Arial.ttf',
        '/Library/Fonts/Arial Bold.ttf' if bold else '/Library/Fonts/Arial.ttf',
        '/System/Library/Fonts/Helvetica.ttc',
        '/System/Library/Fonts/SFNSMono.ttf',
        # Windows
        os.path.join(windir, 'Fonts', 'segoeuib.ttf' if bold else 'segoeui.ttf'),
        os.path.join(windir, 'Fonts', 'arialbd.ttf' if bold else 'arial.ttf'),
        # Linux
        '/usr/share/fonts/truetype/msttcorefonts/Arial_Bold.ttf' if bold else '/usr/share/fonts/truetype/msttcorefonts/Arial.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
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

def draw_vector_icon(draw, icon_type, x, y, size=24, color=(255, 255, 255)):
    """Dibuja iconos vectoriales nítidos directamente con Pillow."""
    s = size
    if icon_type == "phone": # 📱 Teléfono
        draw.rounded_rectangle([x, y, x + s * 0.7, y + s], radius=s*0.15, outline=color, width=max(2, int(s*0.08)))
        draw.rectangle([x + s*0.1, y + s*0.2, x + s*0.6, y + s*0.78], fill=(*color[:3], 40))
        draw.line([x + s*0.28, y + s*0.1, x + s*0.42, y + s*0.1], fill=color, width=max(1, int(s*0.06)))
        draw.ellipse([x + s*0.3, y + s*0.86, x + s*0.4, y + s*0.94], fill=color)

    elif icon_type == "imei": # 🔢 Chip / Hash
        pad = s * 0.15
        draw.rounded_rectangle([x + pad, y + pad, x + s - pad, y + s - pad], radius=s*0.1, outline=color, width=max(2, int(s*0.08)))
        for i in [0.35, 0.65]:
            draw.line([x, y + s * i, x + pad, y + s * i], fill=color, width=max(2, int(s*0.08)))
            draw.line([x + s - pad, y + s * i, x + s, y + s * i], fill=color, width=max(2, int(s*0.08)))
            draw.line([x + s * i, y, x + s * i, y + pad], fill=color, width=max(2, int(s*0.08)))
            draw.line([x + s * i, y + s - pad, x + s * i, y + s], fill=color, width=max(2, int(s*0.08)))
        draw.ellipse([x + s*0.4, y + s*0.4, x + s*0.6, y + s*0.6], fill=color)

    elif icon_type == "shield_check": # 🛡️ Escudo check
        points = [
            (x + s*0.5, y + s*0.05),
            (x + s*0.9, y + s*0.22),
            (x + s*0.9, y + s*0.6),
            (x + s*0.5, y + s*0.96),
            (x + s*0.1, y + s*0.6),
            (x + s*0.1, y + s*0.22)
        ]
        draw.polygon(points, outline=color, fill=(*color[:3], 35))
        draw.line([(x + s*0.3, y + s*0.52), (x + s*0.46, y + s*0.68), (x + s*0.72, y + s*0.36)], fill=color, width=max(2, int(s*0.1)))

    elif icon_type == "shield_alert": # ⚠️ Escudo alerta
        points = [
            (x + s*0.5, y + s*0.05),
            (x + s*0.9, y + s*0.22),
            (x + s*0.9, y + s*0.6),
            (x + s*0.5, y + s*0.96),
            (x + s*0.1, y + s*0.6),
            (x + s*0.1, y + s*0.22)
        ]
        draw.polygon(points, outline=color, fill=(*color[:3], 35))
        draw.line([(x + s*0.5, y + s*0.32), (x + s*0.5, y + s*0.58)], fill=color, width=max(2, int(s*0.1)))
        draw.ellipse([x + s*0.44, y + s*0.68, x + s*0.56, y + s*0.80], fill=color)

    elif icon_type == "signal": # 📡 Señal / Operador
        draw.line([(x + s*0.5, y + s*0.3), (x + s*0.5, y + s*0.95)], fill=color, width=max(2, int(s*0.09)))
        draw.ellipse([x + s*0.4, y + s*0.2, x + s*0.6, y + s*0.4], fill=color)
        draw.line([(x + s*0.25, y + s*0.95), (x + s*0.75, y + s*0.95)], fill=color, width=max(2, int(s*0.08)))
        draw.arc([x + s*0.2, y + s*0.05, x + s*0.8, y + s*0.65], start=210, end=330, fill=color, width=max(2, int(s*0.08)))
        draw.arc([x + s*0.05, y - s*0.1, x + s*0.95, y + s*0.8], start=210, end=330, fill=color, width=max(2, int(s*0.08)))

    elif icon_type == "calendar": # 📅 Calendario
        draw.rounded_rectangle([x + s*0.1, y + s*0.15, x + s*0.9, y + s*0.92], radius=s*0.12, outline=color, width=max(2, int(s*0.08)))
        draw.line([x + s*0.1, y + s*0.38, x + s*0.9, y + s*0.38], fill=color, width=max(2, int(s*0.07)))
        draw.line([x + s*0.3, y + s*0.06, x + s*0.3, y + s*0.2], fill=color, width=max(2, int(s*0.08)))
        draw.line([x + s*0.7, y + s*0.06, x + s*0.7, y + s*0.2], fill=color, width=max(2, int(s*0.08)))
        for r in [0.55, 0.75]:
            for c in [0.3, 0.5, 0.7]:
                draw.ellipse([x + s*c - s*0.04, y + s*r - s*0.04, x + s*c + s*0.04, y + s*r + s*0.04], fill=color)

    elif icon_type == "user": # 👤 Usuario / Cliente
        draw.ellipse([x + s*0.3, y + s*0.1, x + s*0.7, y + s*0.5], outline=color, width=max(2, int(s*0.08)))
        draw.arc([x + s*0.12, y + s*0.55, x + s*0.88, y + s*1.15], start=180, end=0, fill=color, width=max(2, int(s*0.09)))

def crear_pantallazo_profesional(ruta_captura: str, datos: dict, ruta_salida: str = None) -> str:
    """
    Diseño refinado según especificaciones exactas:
    1. Foto del diálogo con esquinas redondeadas suaves y marco pulido.
    2. Sin nombre de titular/cliente.
    3. Sin iconos pequeños difíciles de ver.
    4. Modelo del equipo como TÍTULO principal prominente bajo la foto.
    5. Bajo el título: Badge de Estado destacado y Badge de Operador si aplica.
    """
    if not ruta_captura or not os.path.exists(ruta_captura):
        return ruta_captura

    if not ruta_salida:
        ruta_salida = ruta_captura

    try:
        with Image.open(ruta_captura) as _img:
            raw_rgba = _img.convert("RGBA")
    except Exception as e:
        print(f"[WARN] Error abriendo captura para estilizar: {e}")
        return ruta_captura

    # Autotrim de márgenes blancos/transparentes
    try:
        from PIL import ImageChops
        bg = Image.new("RGBA", raw_rgba.size, (255, 255, 255, 255))
        diff = ImageChops.difference(raw_rgba, bg)
        bbox = diff.getbbox()
        if bbox:
            pad = 6
            w, h = raw_rgba.size
            crop_box = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), min(h, bbox[3] + pad))
            if (crop_box[2] - crop_box[0]) < w * 0.98 or (crop_box[3] - crop_box[1]) < h * 0.98:
                raw_rgba = raw_rgba.crop(crop_box)
    except Exception:
        pass

    orig_w, orig_h = raw_rgba.size

    # Escala Retina 2X para máxima nitidez
    scale = 2
    target_dialog_w = 780 * scale
    scale_factor = target_dialog_w / orig_w if orig_w > 0 else 1.0
    target_dialog_h = int(orig_h * scale_factor)

    resized_dialog = raw_rgba.resize((target_dialog_w, target_dialog_h), Image.Resampling.LANCZOS)

    # ── 1. ESQUINAS REDONDEADAS EN LA FOTO ──
    corner_radius = 20 * scale
    mask = Image.new("L", (target_dialog_w, target_dialog_h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, target_dialog_w, target_dialog_h], radius=corner_radius, fill=255)

    dialog_rounded = Image.new("RGBA", (target_dialog_w, target_dialog_h), (0, 0, 0, 0))
    dialog_rounded.paste(resized_dialog, (0, 0), mask=mask)

    # Borde sutil del marco de la foto
    border_draw = ImageDraw.Draw(dialog_rounded)
    border_draw.rounded_rectangle([0, 0, target_dialog_w - 1, target_dialog_h - 1], radius=corner_radius, outline=(226, 232, 240, 160), width=max(2, 2 * scale))

    # Extracción y limpieza de datos
    imei = str(datos.get("imei") or "").strip()
    modelo = str(datos.get("modelo") or "").strip()
    estado = str(datos.get("estado") or "Libre").strip()
    operador = str(datos.get("operador") or "").strip()

    # Normalización del estado y paleta de color
    est_lower = estado.lower()
    es_libre = any(k in est_lower for k in ["libre", "sin reporte", "limpio", "no está en la base de datos", "desbloquead"])
    es_hurto = any(k in est_lower for k in ["robo", "hurto"])
    es_extravio = any(k in est_lower for k in ["extravi"])
    es_no_registro = any(k in est_lower for k in ["no registrado", "falta registro"])

    if es_libre:
        estado_label = "ESTADO: LIBRE / SIN REPORTE"
        estado_fg = (16, 185, 129, 255)  # Verde esmeralda
        estado_bg = (6, 78, 59, 240)
        estado_bd = (16, 185, 129, 255)
    elif es_hurto:
        estado_label = "ESTADO: REPORTADO POR ROBO / HURTO"
        estado_fg = (244, 63, 94, 255)  # Rojo carmín
        estado_bg = (76, 5, 25, 240)
        estado_bd = (244, 63, 94, 255)
    elif es_extravio:
        estado_label = "ESTADO: REPORTADO POR EXTRAVÍO"
        estado_fg = (251, 146, 60, 255) # Ámbar
        estado_bg = (67, 20, 7, 240)
        estado_bd = (251, 146, 60, 255)
    elif es_no_registro:
        estado_label = "ESTADO: BLOQUEADO (NO REGISTRADO)"
        estado_fg = (234, 179, 8, 255)  # Amarillo
        estado_bg = (66, 32, 6, 240)
        estado_bd = (234, 179, 8, 255)
    else:
        estado_label = f"ESTADO: {estado.upper()}"
        estado_fg = (14, 165, 233, 255)  # Cyan
        estado_bg = (12, 44, 75, 240)
        estado_bd = (14, 165, 233, 255)

    # Operador si aplica
    tiene_operador = bool(operador and operador.lower() not in ["", "sin información", "n/a", "sin reporte", "ninguno"])
    op_str = operador.upper() if tiene_operador else ""
    if "WOM" in op_str:
        op_fg = (244, 114, 182, 255)
        op_bg = (80, 7, 36, 240)
        op_bd = (236, 72, 153, 255)
    elif "ETB" in op_str:
        op_fg = (56, 189, 248, 255)
        op_bg = (8, 47, 73, 240)
        op_bd = (14, 165, 233, 255)
    elif "CLARO" in op_str:
        op_fg = (248, 113, 113, 255)
        op_bg = (69, 10, 10, 240)
        op_bd = (239, 68, 68, 255)
    elif "MOVISTAR" in op_str:
        op_fg = (74, 222, 128, 255)
        op_bg = (5, 46, 22, 240)
        op_bd = (34, 197, 94, 255)
    elif "TIGO" in op_str:
        op_fg = (96, 165, 250, 255)
        op_bg = (23, 37, 84, 240)
        op_bd = (59, 130, 246, 255)
    else:
        op_fg = (203, 213, 225, 255)
        op_bg = (30, 41, 59, 240)
        op_bd = (71, 85, 105, 255)

    # Dimensiones y espaciados
    padding_x = 32 * scale
    padding_top = 28 * scale
    dialog_spacing = 26 * scale

    font_modelo = get_font(22 * scale, bold=True)
    font_badge = get_font(13 * scale, bold=True)
    font_imei_sub = get_font(12 * scale, bold=False)

    modelo_text = modelo.upper() if modelo else "MODELO NO ESPECIFICADO"
    badge_h = 36 * scale
    footer_info_h = (32 * scale) + (14 * scale) + badge_h + (24 * scale)

    canvas_w = target_dialog_w + (padding_x * 2)
    canvas_h = padding_top + target_dialog_h + dialog_spacing + footer_info_h

    # Lienzo con degradado Deep Slate Glass
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (11, 15, 25, 255))
    draw = ImageDraw.Draw(canvas)

    for line_y in range(canvas_h):
        ratio = line_y / canvas_h
        r = int(11 + 6 * ratio)
        g = int(15 + 9 * ratio)
        b = int(25 + 18 * ratio)
        draw.line([(0, line_y), (canvas_w, line_y)], fill=(r, g, b, 255))

    # Borde exterior fino
    draw.rounded_rectangle([8 * scale, 8 * scale, canvas_w - 8 * scale, canvas_h - 8 * scale], radius=22 * scale, outline=(30, 41, 59, 255), width=2 * scale)

    # ── FOTO CON ESQUINAS REDONDEADAS ──
    dialog_x = padding_x
    dialog_y = padding_top

    shadow_pad = 6 * scale
    draw.rounded_rectangle([dialog_x - shadow_pad, dialog_y - shadow_pad, dialog_x + target_dialog_w + shadow_pad, dialog_y + target_dialog_h + shadow_pad], radius=corner_radius + shadow_pad, fill=(0, 0, 0, 75))
    canvas.paste(dialog_rounded, (dialog_x, dialog_y), mask=dialog_rounded)

    # ── TÍTULO DEL MODELO BAJO LA FOTO ──
    info_y = dialog_y + target_dialog_h + dialog_spacing

    modelo_clean = truncar_texto(draw, modelo_text, font_modelo, target_dialog_w)
    draw.text((dialog_x, info_y), modelo_clean, fill=(255, 255, 255, 255), font=font_modelo)

    # Si hay IMEI disponible, subtítulo a la derecha
    if imei:
        imei_txt = f"IMEI: {imei}"
        imei_w = draw.textlength(imei_txt, font=font_imei_sub)
        draw.text((canvas_w - padding_x - imei_w, info_y + 6 * scale), imei_txt, fill=(148, 163, 184, 255), font=font_imei_sub)

    # ── BADGES BAJO EL TÍTULO: ESTADO Y OPERADOR ──
    badges_y = info_y + (38 * scale)

    # 1. Badge Estado
    estado_txt_w = draw.textlength(estado_label, font=font_badge)
    b_estado_w = estado_txt_w + (28 * scale)
    draw.rounded_rectangle([dialog_x, badges_y, dialog_x + b_estado_w, badges_y + badge_h], radius=8 * scale, fill=estado_bg, outline=estado_bd, width=2 * scale)
    draw.text((dialog_x + (14 * scale), badges_y + (8 * scale)), estado_label, fill=estado_fg, font=font_badge)

    # 2. Badge Operador (si aplica)
    if tiene_operador:
        op_label = f"OPERADOR: {operador.upper()}"
        op_txt_w = draw.textlength(op_label, font=font_badge)
        b_op_w = op_txt_w + (28 * scale)
        b_op_x = dialog_x + b_estado_w + (14 * scale)
        draw.rounded_rectangle([b_op_x, badges_y, b_op_x + b_op_w, badges_y + badge_h], radius=8 * scale, fill=op_bg, outline=op_bd, width=2 * scale)
        draw.text((b_op_x + (14 * scale), badges_y + (8 * scale)), op_label, fill=op_fg, font=font_badge)

    # Redimensionar al tamaño final con LANCZOS
    final_w = int(canvas_w / scale)
    final_h = int(canvas_h / scale)
    final_img = canvas.resize((final_w, final_h), Image.Resampling.LANCZOS).convert("RGB")
    final_img.save(ruta_salida, "PNG", quality=98)
    return ruta_salida

def estilizar_pantallazo(screenshot_path: str, datos: dict) -> str:
    """
    Función compatible para trámites WOM/ETB con foto redondeada y tarjetas de datos HD.
    """
    if not screenshot_path or not os.path.exists(screenshot_path):
        return screenshot_path

    try:
        with Image.open(screenshot_path) as _opened_img:
            raw_img = _opened_img.convert("RGBA")
    except Exception as e:
        print(f"[WARN] Error abriendo imagen para estilizar: {e}")
        return screenshot_path

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

    base_target_w = 520 if "WOM" in operador else 680
    scale_factor = base_target_w / orig_w if orig_w > 0 else 1.0
    base_target_h = int(orig_h * scale_factor)

    hd_scale = 2
    target_w = base_target_w * hd_scale
    target_h = base_target_h * hd_scale

    raw_img_resized = raw_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Esquinas redondeadas en la foto
    photo_radius = 16 * hd_scale
    photo_mask = Image.new("L", (target_w, target_h), 0)
    photo_mask_draw = ImageDraw.Draw(photo_mask)
    photo_mask_draw.rounded_rectangle([0, 0, target_w, target_h], radius=photo_radius, fill=255)

    photo_rounded = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    photo_rounded.paste(raw_img_resized, (0, 0), mask=photo_mask)

    photo_border_draw = ImageDraw.Draw(photo_rounded)
    photo_border_draw.rounded_rectangle([0, 0, target_w - 1, target_h - 1], radius=photo_radius, outline=(203, 213, 225, 200), width=2 * hd_scale)

    margin_x = 40 * hd_scale
    header_h = 80 * hd_scale

    imei = str(datos.get("imei", "") or datos.get("IMEI", "") or "").strip()
    modelo = str(datos.get("modelo", "") or datos.get("MODELO", "") or "").strip()
    estado = str(datos.get("estado", "") or datos.get("ESTADO", "EXITOSO")).strip()
    propietario = str(datos.get("propietario", "") or datos.get("encargado", "") or datos.get("cliente", "") or "").strip()
    linea = str(datos.get("linea", "") or datos.get("linea_wom", "") or datos.get("linea_etb", "") or "").strip()
    fecha = datos.get("fecha", datetime.now().strftime("%Y-%m-%d %I:%M %p"))

    if "WOM" in operador:
        op_color = (225, 29, 72, 255)
        op_bg = (255, 241, 242, 255)
    elif "ETB" in operador:
        op_color = (2, 132, 199, 255)
        op_bg = (240, 249, 255, 255)
    else:
        op_color = (5, 150, 105, 255)
        op_bg = (236, 253, 245, 255)

    est_lower = estado.lower()
    if any(k in est_lower for k in ["éxito", "exitoso", "registrado", "success", "ok", "completado"]):
        status_text = "REGISTRADO EXITOSAMENTE"
        status_fg = (21, 128, 61, 255)
        status_bg = (220, 252, 231, 255)
    elif any(k in est_lower for k in ["error", "fallo", "blacklist", "bloqueado"]):
        status_text = "REGISTRO RECHAZADO"
        status_fg = (185, 28, 28, 255)
        status_bg = (254, 226, 226, 255)
    else:
        status_text = f"{estado.upper()}"
        status_fg = (30, 58, 138, 255)
        status_bg = (219, 234, 254, 255)

    def to_bool(val, default=True):
        if val is None: return default
        if isinstance(val, bool): return val
        if isinstance(val, (int, float)): return val != 0
        if isinstance(val, str):
            v = val.strip().lower()
            if v in ("false", "0", "no", "off", "none", "null"): return False
            if v in ("true", "1", "yes", "si", "sí", "on"): return True
        return bool(val)

    inc_operador = to_bool(datos.get("incluir_operador"), True)
    inc_imei = to_bool(datos.get("incluir_imei"), True)
    inc_modelo = to_bool(datos.get("incluir_modelo"), True)
    inc_linea = to_bool(datos.get("incluir_linea"), True)
    inc_propietario = to_bool(datos.get("incluir_propietario"), True)

    info_items = []
    if inc_imei:
        info_items.append(("imei", "IMEI del Equipo", imei if imei else "Sin información"))
    if inc_modelo:
        info_items.append(("phone", "Modelo", modelo if modelo else "Sin información"))
    if inc_propietario:
        info_items.append(("user", "Titular Registrado", propietario if propietario else "Sin información"))
    if inc_linea:
        info_items.append(("signal", "Línea Celular", linea if linea else "Sin información"))
    info_items.append(("calendar", "Fecha / Hora", str(fecha)))

    row_height = 48 * hd_scale
    footer_h = (len(info_items) * row_height) + (55 * hd_scale)

    card_w = target_w + (margin_x * 2)
    card_h = header_h + target_h + footer_h + (30 * hd_scale)

    canvas = Image.new("RGBA", (card_w, card_h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(canvas)

    card_box = [20 * hd_scale, 20 * hd_scale, card_w - (20 * hd_scale), card_h - (20 * hd_scale)]
    draw.rounded_rectangle(card_box, radius=18 * hd_scale, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=3 * hd_scale)

    font_badge = get_font(13 * hd_scale, bold=True)
    font_lbl = get_font(12 * hd_scale, bold=False)
    font_val = get_font(13 * hd_scale, bold=True)
    font_wm = get_font(11 * hd_scale, bold=False)

    badge_h = 32 * hd_scale
    if inc_operador:
        badge_w_op = 130 * hd_scale
        draw.rounded_rectangle([margin_x, 32 * hd_scale, margin_x + badge_w_op, 32 * hd_scale + badge_h], radius=8 * hd_scale, fill=op_bg, outline=op_color, width=2 * hd_scale)
        draw.text((margin_x + (15 * hd_scale), 37 * hd_scale), f"  {operador}  ", fill=op_color, font=font_badge)

    status_w = 260 * hd_scale
    status_x1 = card_w - margin_x - status_w
    draw.rounded_rectangle([status_x1, 32 * hd_scale, card_w - margin_x, 32 * hd_scale + badge_h], radius=8 * hd_scale, fill=status_bg, outline=status_fg, width=2 * hd_scale)
    draw.text((status_x1 + (14 * hd_scale), 37 * hd_scale), status_text, fill=status_fg, font=font_badge)

    # Pegar foto redondeada
    img_y = header_h + (10 * hd_scale)
    canvas.paste(photo_rounded, (margin_x, img_y), mask=photo_rounded)

    footer_y = img_y + target_h + (24 * hd_scale)
    draw.line([(margin_x, footer_y - (10 * hd_scale)), (card_w - margin_x, footer_y - (10 * hd_scale))], fill=(226, 232, 240, 255), width=2 * hd_scale)

    row_y = footer_y
    label_w_fixed = 170 * hd_scale

    for icon_name, label_str, val_str in info_items:
        row_box = [margin_x, row_y, card_w - margin_x, row_y + (40 * hd_scale)]
        draw.rounded_rectangle(row_box, radius=8 * hd_scale, fill=(248, 250, 252, 255), outline=(241, 245, 249, 255), width=1 * hd_scale)

        draw_vector_icon(draw, icon_name, margin_x + 10 * hd_scale, row_y + 10 * hd_scale, size=20 * hd_scale, color=(100, 116, 139))
        draw.text((margin_x + (38 * hd_scale), row_y + (9 * hd_scale)), label_str + ":", fill=(100, 116, 139, 255), font=font_lbl)

        val_max_w = (card_w - margin_x) - (margin_x + label_w_fixed + (20 * hd_scale))
        val_clean = truncar_texto(draw, val_str, font_val, val_max_w)
        draw.text((margin_x + label_w_fixed, row_y + (8 * hd_scale)), val_clean, fill=(15, 23, 42, 255), font=font_val)

        row_y += row_height

    wm_y = row_y + (10 * hd_scale)
    draw.text((margin_x + (10 * hd_scale), wm_y), "IMEI Manager Pro • Comprobante Oficial de Verificación", fill=(148, 163, 184, 255), font=font_wm)

    final_w = int(card_w / hd_scale)
    final_h = int(card_h / hd_scale)
    final_img = canvas.resize((final_w, final_h), Image.Resampling.LANCZOS).convert("RGB")
    final_img.save(screenshot_path, "PNG", quality=98)
    return screenshot_path
