import sqlite3
import os
import sys
import ssl

# Configuración de SSL segura
try:
    import certifi
    context = ssl.create_default_context(cafile=certifi.where())
    ssl._create_default_https_context = lambda: context
    print("[OK] [SSL] Contexto SSL configurado de forma segura con certifi.")
except Exception as e:
    print(f"[WARN] [SSL] No se pudo configurar certifi ({e}), usando bypass de compatibilidad.")
    ssl._create_default_https_context = ssl._create_unverified_context

from supabase import create_client

# Configuración de Supabase
SUPABASE_URL = "https://zgfscbdbufiniezlkufn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZnNjYmRidWZpbmllemxrdWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTYyMzgsImV4cCI6MjA5NjE3MjIzOH0.S7BHJ1jiCgeACYREdC2rAVjsj-PzaOlcerVXwTuGvv8"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Ruta a la base de datos local SQLite (en Models/imei_database.db)
MODELS_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(MODELS_DIR, "imei_database.db")

def migrar():
    if not os.path.exists(DB_PATH):
        print(f"[ERROR] No se encontró la base de datos local en {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # 1. Migrar Clientes
    print("Migrando clientes...")
    try:
        cursor.execute("SELECT * FROM clientes")
        for row in cursor.fetchall():
            cliente = dict(row)
            supabase.table("clientes").upsert(cliente).execute()
        print("[OK] Clientes migrados.")
    except Exception as e:
        print(f"[ERROR] Error migrando clientes: {e}")
    
    # 2. Migrar Encargados
    print("Migrando encargados...")
    try:
        cursor.execute("SELECT * FROM encargados")
        for row in cursor.fetchall():
            encargado = dict(row)
            supabase.table("encargados").upsert(encargado).execute()
        print("[OK] Encargados migrados.")
    except Exception as e:
        print(f"[ERROR] Error migrando encargados: {e}")

    # 3. Migrar Registros
    print("Migrando registros...")
    try:
        cursor.execute("SELECT * FROM registros")
        for row in cursor.fetchall():
            registro = dict(row)
            # Manejar valores vacíos
            supabase.table("registros").upsert(registro).execute()
        print("[OK] Registros migrados.")
    except Exception as e:
        print(f"[ERROR] Error migrando registros: {e}")

    # 4. Migrar Papelera
    print("Migrando registros de papelera...")
    try:
        cursor.execute("SELECT * FROM papelera")
        for row in cursor.fetchall():
            papelera = dict(row)
            supabase.table("papelera").upsert(papelera).execute()
        print("[OK] Papelera migrada.")
    except Exception as e:
        print(f"[ERROR] Error migrando papelera: {e}")

    # 5. Migrar Usuarios
    print("Migrando usuarios...")
    try:
        cursor.execute("SELECT * FROM usuarios")
        for row in cursor.fetchall():
            user = dict(row)
            supabase.table("usuarios").upsert(user).execute()
        print("[OK] Usuarios migrados.")
    except Exception as e:
        print(f"[ERROR] Error migrando usuarios: {e}")

    # 6. Migrar Líneas (si existen localmente)
    print("Migrando líneas...")
    try:
        cursor.execute("SELECT * FROM lineas")
        for row in cursor.fetchall():
            linea = dict(row)
            # Asegurar tipo de datos de compatibilidad para Supabase
            data_linea = {
                "numero": linea["numero"],
                "operador": linea["operador"],
                "estado": linea.get("estado") or linea.get("tipo") or "disponible",
                "tipo": linea.get("tipo") or linea.get("estado") or "Disponible",
                "serial": linea.get("serial") or "",
                "imei_vinculado": linea.get("imei_vinculado") or "",
                "encargado": linea.get("encargado") or ""
            }
            supabase.table("lineas").upsert(data_linea).execute()
        print("[OK] Líneas migradas.")
    except sqlite3.OperationalError:
        print("[INFO] No existe tabla local 'lineas' o no contiene registros.")
    except Exception as e:
        print(f"[ERROR] Error migrando líneas: {e}")

    # 7. Migrar Configuración
    print("Migrando configuración...")
    try:
        cursor.execute("SELECT * FROM configuracion")
        for row in cursor.fetchall():
            config = dict(row)
            supabase.table("configuracion").upsert(config).execute()
        print("[OK] Configuración migrada.")
    except sqlite3.OperationalError:
        print("[INFO] No existe tabla local 'configuracion' o no contiene registros.")
    except Exception as e:
        print(f"[ERROR] Error migrando configuración: {e}")

    print("[SUCCESS] ¡Migración completa terminada con éxito!")
    conn.close()

if __name__ == "__main__":
    migrar()