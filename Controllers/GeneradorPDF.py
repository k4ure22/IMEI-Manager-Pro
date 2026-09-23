# Archivo: Controllers/GeneradorPDF.py
import sys
import os

if sys.platform == "win32":
    if hasattr(sys.stdout, 'reconfigure'):
        try: sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        except Exception: pass
    if hasattr(sys.stderr, 'reconfigure'):
        try: sys.stderr.reconfigure(encoding='utf-8', errors='replace')
        except Exception: pass

import json
from datetime import datetime

try:
    from fpdf import FPDF
    HAS_FPDF = True
except ImportError:
    HAS_FPDF = False

def get_arial_ttf_path():
    """Busca Arial.ttf en rutas estándar de Windows, macOS y Linux."""
    candidates = [
        r'C:\Windows\Fonts\arial.ttf',
        r'C:\Windows\Fonts\Arial.ttf',
        '/Library/Fonts/Arial.ttf',
        '/System/Library/Fonts/Supplemental/Arial.ttf',
        '/System/Library/Fonts/Arial.ttf',
        '/usr/share/fonts/truetype/msttcorefonts/Arial.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
    ]
    # Buscar también junto al ejecutable o script (en caso de distribución con fuentes bundleadas)
    if hasattr(sys, '_MEIPASS'):
        base = sys._MEIPASS
    else:
        base = os.path.dirname(os.path.abspath(__file__))
    for rel in ['fonts/Arial.ttf', '../Views/Files/fonts/Arial.ttf', '../fonts/Arial.ttf']:
        p = os.path.normpath(os.path.join(base, rel))
        if os.path.exists(p):
            return p
    for p in candidates:
        if os.path.exists(p):
            return p
    return None

def load_best_font(font_name, size):
    try:
        from PIL import ImageFont
        paths = [
            f"/System/Library/Fonts/Supplemental/{font_name}.ttf",
            f"/System/Library/Fonts/{font_name}.ttf",
            f"/Library/Fonts/{font_name}.ttf",
            f"C:\\Windows\\Fonts\\{font_name}.ttf",
            f"/usr/share/fonts/truetype/dejavu/{font_name}.ttf"
        ]
        for p in paths:
            if os.path.exists(p):
                try:
                    return ImageFont.truetype(p, size)
                except Exception:
                    pass
        try:
            return ImageFont.truetype(font_name, size)
        except Exception:
            pass
        return ImageFont.load_default()
    except Exception:
        return None

def get_text_width(draw, text, font):
    try:
        bbox = draw.textbbox((0, 0), text, font=font)
        return bbox[2] - bbox[0]
    except AttributeError:
        try:
            return draw.textsize(text, font=font)[0]
        except Exception:
            return len(text) * (font.size * 0.6 if font and hasattr(font, 'size') else 8)

def generar_imagen_estandar(datos):
    try:
        from PIL import Image, ImageDraw
        
        width = 800
        height = 800
        
        # Crear imagen con fondo oscuro premium (#0f172a)
        img = Image.new("RGB", (width, height), "#0f172a")
        draw = ImageDraw.Draw(img)
        
        # Buscar logo IMP (logo.png)
        if hasattr(sys, '_MEIPASS'):
            logo_path = os.path.join(sys._MEIPASS, "Views", "icons", "logo.png")
            if not os.path.exists(logo_path):
                logo_path = os.path.abspath(os.path.join(sys._MEIPASS, "..", "Resources", "Views", "icons", "logo.png"))
        else:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            logo_path = os.path.abspath(os.path.join(base_dir, "..", "Views", "icons", "logo.png"))
            
        # Pegar logo si existe
        if os.path.exists(logo_path):
            try:
                logo = Image.open(logo_path).convert("RGBA")
                # Redimensionar logo a 100x100
                logo = logo.resize((100, 100), Image.Resampling.LANCZOS)
                # Centrar
                logo_x = (width - 100) // 2
                logo_y = 50
                img.paste(logo, (logo_x, logo_y), logo)
            except Exception as le:
                print(f"Error cargando logo: {le}")
                
        # Cargar fuentes
        font_title = load_best_font("Arial", 24)
        font_subtitle = load_best_font("Arial", 18)
        font_body = load_best_font("Arial", 14)
        font_footer = load_best_font("Arial", 12)
        
        # Nombre de la app
        app_name = "IMEI Manager Pro"
        w_app = get_text_width(draw, app_name, font_subtitle)
        draw.text(((width - w_app) // 2, 170), app_name, font=font_subtitle, fill="#94a3b8")
        
        # Título
        title1 = "CONSTANCIA DE REGISTRO DE IMEI"
        w_t1 = get_text_width(draw, title1, font_title)
        draw.text(((width - w_t1) // 2, 215), title1, font=font_title, fill="#f8fafc")
        
        title2 = "DECLARACIÓN SIMPLIFICADA"
        w_t2 = get_text_width(draw, title2, font_subtitle)
        draw.text(((width - w_t2) // 2, 255), title2, font=font_subtitle, fill="#38bdf8")
        
        # Mensaje de éxito
        imei = datos.get('imei', '')
        success_msg = f"El IMEI {imei} ha sido registrado de manera exitosa."
        w_sm = get_text_width(draw, success_msg, font_body)
        draw.text(((width - w_sm) // 2, 305), success_msg, font=font_body, fill="#10b981")
        
        # Dibujar contenedor de datos (tarjeta)
        card_x1, card_y1 = 100, 350
        card_x2, card_y2 = 700, 710
        try:
            draw.rounded_rectangle([card_x1, card_y1, card_x2, card_y2], radius=15, fill="#1e293b", outline="#334155", width=2)
        except AttributeError:
            draw.rectangle([card_x1, card_y1, card_x2, card_y2], fill="#1e293b", outline="#334155", width=2)
            
        # Datos del propietario y registro
        nombre = datos.get('nombre', '').upper()
        tipo_doc = datos.get('tipo_doc', 'C.C.')
        num_doc = datos.get('num_doc', '')
        linea_usuario = datos.get('linea_usuario', '')
        lugar_exp = datos.get('lugar_exp', '').upper()
        modelo = datos.get('modelo', '').upper()
        
        lines = []
        if nombre and nombre.strip() not in ['ANONIMO', 'ANÓNIMO']:
            lines.append(("PROPIETARIO", nombre))
        if num_doc:
            lines.append(("DOCUMENTO", f"{tipo_doc} {num_doc}"))
        if linea_usuario:
            lines.append(("LÍNEA DEL USUARIO", linea_usuario))
        if lugar_exp:
            lines.append(("CIUDAD EXPEDICIÓN", lugar_exp))
        if modelo:
            lines.append(("MODELO DISPOSITIVO", modelo))
        lines.append(("IMEI REGISTRADO", imei))
        
        # Dibujar líneas dentro de la tarjeta
        card_height = card_y2 - card_y1
        start_y = card_y1 + (card_height - (len(lines) * 45)) // 2
        
        for i, (label, val) in enumerate(lines):
            y = start_y + i * 45
            
            # Etiqueta
            w_lbl = get_text_width(draw, label, font_footer)
            draw.text(((width - w_lbl) // 2, y), label, font=font_footer, fill="#64748b")
            
            # Valor
            w_val = get_text_width(draw, val, font_body)
            draw.text(((width - w_val) // 2, y + 18), val, font=font_body, fill="#f8fafc")
            
        # Fecha de emisión
        fecha_actual = datetime.now().strftime("%d/%m/%Y")
        footer_text = f"Fecha de emisión: {fecha_actual}  |  Soporte digital oficial"
        w_ft = get_text_width(draw, footer_text, font_footer)
        draw.text(((width - w_ft) // 2, 745), footer_text, font=font_footer, fill="#475569")
        
        salida_dir = datos.get('salida_dir')
        if salida_dir:
            os.makedirs(salida_dir, exist_ok=True)
            directorio_destino = salida_dir
        else:
            directorio_destino = os.path.join(os.path.expanduser('~'), 'Downloads')
        nombre_archivo = f"Constancia_IMEI_{imei}.png"
        ruta_completa = os.path.join(directorio_destino, nombre_archivo)
        
        img.save(ruta_completa, "PNG")
        return {"status": "success", "ruta": ruta_completa}
    except Exception as e:
        return {"status": "error", "mensaje": str(e)}

def generar_pdf(datos):
    modo = datos.get('modo', 'detallada')
    if modo == 'estandar':
        return generar_imagen_estandar(datos)
        
    if not HAS_FPDF:
        return {"status": "error", "mensaje": "La librería fpdf no está instalada."}
    try:
        pdf = FPDF(orientation='L', unit='mm', format='A4')
        pdf.add_page()

        # Registrar Arial con TTF para soporte correcto de tildes en Windows/macOS
        _arial_ttf = get_arial_ttf_path()
        _font_name = 'Helvetica'  # fallback seguro universal
        if _arial_ttf:
            try:
                pdf.add_font('Arial', '', _arial_ttf, uni=True)
                pdf.add_font('Arial', 'B', _arial_ttf, uni=True)
                pdf.add_font('Arial', 'I', _arial_ttf, uni=True)
                _font_name = 'Arial'
            except Exception:
                _font_name = 'Helvetica'
        
        operador = datos.get('operador', '').lower()
        if operador:
            if hasattr(sys, '_MEIPASS'):
                logo_path = os.path.join(sys._MEIPASS, "Views", "icons", f"{operador}.png")
                # Fallback macOS bundle
                if not os.path.exists(logo_path):
                    logo_path = os.path.abspath(os.path.join(sys._MEIPASS, "..", "Resources", "Views", "icons", f"{operador}.png"))
            else:
                base_dir = os.path.dirname(os.path.abspath(__file__))
                logo_path = os.path.normpath(os.path.join(base_dir, "..", "Views", "icons", f"{operador}.png"))

            if os.path.exists(logo_path):
                try:
                    from PIL import Image
                    import tempfile
                    
                    # 1. Crear marca de agua semitransparente
                    img = Image.open(logo_path).convert("RGBA")
                    bg = Image.new("RGB", img.size, (255, 255, 255))
                    alpha = img.split()[3]
                    alpha = alpha.point(lambda p: p * 0.08) # 8% opacidad
                    img.putalpha(alpha)
                    bg.paste(img, (0, 0), img)
                    
                    wm_path = os.path.join(tempfile.gettempdir(), f"wm_{operador}.jpg")
                    bg.save(wm_path, "JPEG")
                    
                    # Insertar marca de agua gigante en la parte inferior para que se asome
                    # Ancho 260, centrado (x=18.5), cortado hacia abajo (y=120)
                    pdf.image(wm_path, x=18.5, y=120, w=260)
                except Exception:
                    pass
                
                # 2. Logo superior derecho
                pdf.image(logo_path, x=235, y=10, w=50)
        
        modo = datos.get('modo', 'detallada')
        fecha_actual = datetime.now().strftime("%d/%m/%Y")
        
        nombre = datos.get('nombre', '').upper()
        tipo_doc = datos.get('tipo_doc', 'C.C.')
        num_doc = datos.get('num_doc', '')
        lugar_exp = datos.get('lugar_exp', '').title()
        modelo = datos.get('modelo', '').upper()
        imei = datos.get('imei', '')
        linea_usuario = datos.get('linea_usuario', '')

        if modo == 'estandar':
            pdf.set_font(_font_name, 'B', 22)
            pdf.ln(5)
            pdf.cell(0, 10, "CONSTANCIA DE REGISTRO DE IMEI", ln=True, align='L')
            pdf.cell(0, 10, "DECLARACION SIMPLIFICADA", ln=True, align='L')
            
            pdf.set_y(65)
            pdf.set_font(_font_name, '', 14)
            pdf.cell(0, 10, f"El IMEI {imei} ha sido registrado de manera exitosa.", ln=True, align='L')
            pdf.ln(5)
            
            pdf.set_font(_font_name, 'B', 12)
            pdf.cell(0, 8, "Datos ingresados:", ln=True, align='L')
            pdf.set_font(_font_name, '', 12)
            
            if nombre and nombre.strip() != 'ANONIMO' and nombre.strip() != 'ANÓNIMO':
                pdf.cell(0, 8, f"- Propietario: {nombre}", ln=True, align='L')
            if num_doc:
                pdf.cell(0, 8, f"- Documento: {tipo_doc} {num_doc}", ln=True, align='L')
            if linea_usuario:
                pdf.cell(0, 8, f"- Linea del Usuario: {linea_usuario}", ln=True, align='L')
            if lugar_exp:
                pdf.cell(0, 8, f"- Ciudad de Expedicion: {lugar_exp}", ln=True, align='L')
            if modelo:
                pdf.cell(0, 8, f"- Modelo: {modelo}", ln=True, align='L')
            if operador:
                pdf.cell(0, 8, f"- Operador: {operador.upper()}", ln=True, align='L')
            
            pdf.ln(10)
            pdf.set_font(_font_name, 'I', 11)
            pdf.cell(0, 10, f"Fecha de emision: {fecha_actual}", ln=True, align='L')
        else:
            pdf.set_font(_font_name, 'B', 22)
            pdf.ln(5)
            pdf.cell(0, 10, "DECLARACION DE PROPIEDAD DE EQUIPO", ln=True, align='L')
            pdf.cell(0, 10, "TERMINAL MOVIL", ln=True, align='L')
            
            texto_declaracion = (
                f"Por medio del presente documento, yo, {nombre}, mayor de edad, "
                f"identificado(a) con {tipo_doc} numero {num_doc} expedida en la ciudad de {lugar_exp}, "
                f"obrando en mi propio nombre y representacion, declaro de manera libre, voluntaria y "
                f"bajo la gravedad de juramento que soy el unico y legitimo propietario del equipo "
                f"terminal movil con las siguientes caracteristicas: marca y modelo {modelo}, identificado "
                f"con el numero de serie IMEI {imei}, el cual se encuentra actualmente asociado a la "
                f"linea telefonica {linea_usuario}.\n\n"
                f"Asimismo, manifiesto y garantizo que dicho equipo terminal movil fue adquirido de "
                f"forma licita, a traves de canales autorizados y con recursos de procedencia legal. "
                f"Por consiguiente, asumo cualquier tipo de responsabilidad legal, civil, administrativa "
                f"o penal que pudiera derivarse frente a las autoridades competentes, operadores de "
                f"telecomunicaciones o terceros, en caso de presentarse alguna anomalia, reclamacion o "
                f"inconsistencia sobre el origen, la tenencia o la propiedad del mencionado dispositivo."
                f" Este documento es un soporte de la declaracion de propiedad del equipo terminal movil"
                f" y no se reconoce como el registro oficial con el operador, para ello, se debe continuar con el proceso"
                f" de registro de equipo terminal movil descargando Mi {operador.upper()} en la tienda de aplicaciones."
                f" Su obtencion y uso son responsabilidad del usuario."
            )
            
            # Bajar el inicio del texto para que no se superponga con el logo superior derecho
            pdf.set_y(65)
            pdf.set_font(_font_name, '', 11)
            pdf.multi_cell(0, 7, texto_declaracion, align='J')
            
            pdf.ln(10)
            pdf.set_font(_font_name, 'I', 10)
            pdf.cell(0, 10, f"Fecha de emision de la declaracion: {fecha_actual}", ln=True, align='R')
        
        salida_dir = datos.get('salida_dir')
        if salida_dir:
            os.makedirs(salida_dir, exist_ok=True)
            directorio_destino = salida_dir
        else:
            directorio_destino = os.path.join(os.path.expanduser('~'), 'Downloads')
        nombre_archivo = f"Declaracion_IMEI_{imei}.pdf"
        ruta_completa = os.path.join(directorio_destino, nombre_archivo)
        
        pdf.output(ruta_completa)
        return {"status": "success", "ruta": ruta_completa}
    except Exception as e:
        return {"status": "error", "mensaje": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "mensaje": "Faltan datos JSON."}))
        sys.exit(1)
    try:
        datos = json.loads(sys.argv[1])
        resultado = generar_pdf(datos)
        print(json.dumps(resultado))
    except Exception as e:
        print(json.dumps({"status": "error", "mensaje": "JSON inválido."}))