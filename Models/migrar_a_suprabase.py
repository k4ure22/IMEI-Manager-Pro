import sqlite3
from supabase import create_client

# Configuración
SUPABASE_URL = "https://oxylxjzubuwtrxvfxjfb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94eWx4anp1YnV3dHJ4dmZ4amZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MDEzNDQsImV4cCI6MjA5NTM3NzM0NH0.ST6kYcx3F4K1_qGRkz6VpUBPbraXAIC774YcQigoajE"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Ruta a tu base de datos SQLite antigua
DB_PATH = "imei_database.db"

def migrar():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # 1. Migrar Clientes
    print("Migrando clientes...")
    cursor.execute("SELECT * FROM clientes")
    for row in cursor.fetchall():
        cliente = dict(row)
        supabase.table("clientes").upsert(cliente).execute()
    
    # 2. Migrar Encargados
    print("Migrando encargados...")
    cursor.execute("SELECT * FROM encargados")
    for row in cursor.fetchall():
        encargado = dict(row)
        supabase.table("encargados").upsert(encargado).execute()

    # 3. Migrar Registros
    print("Migrando registros...")
    cursor.execute("SELECT * FROM registros")
    for row in cursor.fetchall():
        registro = dict(row)
        supabase.table("registros").upsert(registro).execute()

    # 4. Migrar Usuarios
    print("Migrando usuarios...")
    cursor.execute("SELECT * FROM usuarios")
    for row in cursor.fetchall():
        user = dict(row)
        supabase.table("usuarios").upsert(user).execute()

    print("¡Migración completada con éxito!")
    conn.close()

if __name__ == "__main__":
    migrar()