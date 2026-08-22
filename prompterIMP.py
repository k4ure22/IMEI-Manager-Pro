import os
import re

# 1. Configuración de rutas (Ajustada a tu estructura MVC)
base_path = os.path.expanduser("~/Desktop/IMEI")
files_to_read = [
    "Views/Html/Dashboard.html",
    "Views/js/dashboard.js",
    "Views/js/RegistroRapido.js",
    "Views/css/RegistroRapido.css",
    "Controllers/main.py",
    "Controllers/RegistroRapido.py",
    "Controllers/GeneradorPDF.py"
]

# 2. Tu prompt preestablecido
custom_prompt = """
"""

output_file = os.path.join(base_path, "prompt_para_ia.txt")

def compress_code(code, extension):
    """
    Minimiza el código ligeramente eliminando líneas en blanco excesivas 
    para ahorrar 'tokens' al enviarlo a la IA, sin perder legibilidad.
    """
    # Eliminar múltiples saltos de línea consecutivos
    code = re.sub(r'\n\s*\n', '\n', code)
    return code

with open(output_file, "w", encoding="utf-8") as out_f:
    # Escribir el prompt inicial
    out_f.write(custom_prompt + "\n\n")

    for file_path in files_to_read:
        full_path = os.path.join(base_path, file_path)
        
        # Determinar el lenguaje para el bloque Markdown
        ext = file_path.split('.')[-1].lower()
        lang_map = {'py': 'python', 'js': 'javascript', 'html': 'html', 'css': 'css'}
        lang = lang_map.get(ext, '')

        try:
            with open(full_path, "r", encoding="utf-8") as in_f:
                content = in_f.read()
                compressed_content = compress_code(content, ext)
                
                # Interfaz de separación clara para la IA
                out_f.write(f"### Archivo: {file_path} ###\n")
                out_f.write(f"```{lang}\n")
                out_f.write(compressed_content)
                out_f.write(f"\n```\n\n")
                
        except FileNotFoundError:
            print(f"Advertencia: No se encontró -> {full_path}")

print(f"¡Listo! El consolidado se ha guardado en: {output_file}")