import os
import re

# 1. Configuración de rutas
base_path = os.path.expanduser("~/Desktop/IMEI")
# Este es el archivo donde debes pegar la respuesta que te da la IA
input_file = os.path.join(base_path, "prompt_para_ia.txt")

def parse_ia_response(filepath):
    """
    Lee el archivo de respuesta y extrae los bloques de código y sus rutas.
    Retorna un diccionario {ruta_relativa: contenido_del_codigo}
    """
    files_data = {}
    current_file = None
    in_code_block = False
    current_code = []

    if not os.path.exists(filepath):
        print(f"Error: No se encontró el archivo de entrada en {filepath}")
        return files_data

    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            # Buscar el encabezado del archivo
            match_file = re.search(r"### Archivo:\s*(.*?)\s*###", line)
            if match_file:
                current_file = match_file.group(1).strip()
                current_code = []
                in_code_block = False
                continue
            
            # Detectar inicio o fin de bloque de código (```)
            if current_file and line.strip().startswith("```"):
                if not in_code_block:
                    in_code_block = True  # Empezamos a guardar código
                else:
                    # Fin del bloque de código
                    files_data[current_file] = "".join(current_code)
                    current_file = None
                    in_code_block = False
                continue

            # Guardar el código línea por línea si estamos dentro del bloque
            if in_code_block:
                current_code.append(line)

    return files_data

def main():
    files_to_update = parse_ia_response(input_file)
    
    if not files_to_update:
        print("No se encontraron archivos válidos para actualizar en el documento.")
        return

    backups = {}
    
    print("\n--- INICIANDO ACTUALIZACIÓN ---")
    # 2. Respaldar y Sobreescribir
    for rel_path, new_content in files_to_update.items():
        full_path = os.path.join(base_path, rel_path)
        
        # Guardar respaldo del original si existe
        if os.path.exists(full_path):
            with open(full_path, 'r', encoding='utf-8') as f:
                backups[rel_path] = f.read()
        else:
            backups[rel_path] = None # El archivo no existía previamente
            
        # Asegurar que las carpetas existan
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        # Escribir el nuevo código
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"[OK] Actualizado: {rel_path}")

    print("-------------------------------\n")

    # 3. Opción de Revertir
    while True:
        resp = input("¿El código funciona correctamente? ¿Deseas REVERTIR los cambios? (s/n): ").strip().lower()
        if resp in ['s', 'n']:
            break
        print("Por favor, responde 's' para revertir o 'n' para mantener los cambios.")

    if resp == 's':
        print("\n--- REVIRTIENDO CAMBIOS ---")
        for rel_path, old_content in backups.items():
            full_path = os.path.join(base_path, rel_path)
            
            if old_content is None:
                # Si no existía, lo eliminamos
                if os.path.exists(full_path):
                    os.remove(full_path)
                print(f"[TRASH] Eliminado (nuevo archivo descartado): {rel_path}")
            else:
                # Restaurar el código anterior
                with open(full_path, 'w', encoding='utf-8') as f:
                    f.write(old_content)
                print(f"[RESTORE] Restaurado: {rel_path}")
        print("¡Todos los cambios han sido deshechos!")
    else:
        print("¡Cambios conservados exitosamente!")

if __name__ == "__main__":
    main()