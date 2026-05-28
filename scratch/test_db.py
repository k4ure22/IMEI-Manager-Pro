import os
import sys
import sqlite3

# Simular el entorno de Controllers/main.py
CONTROLLERS_DIR = "/Users/martin/Desktop/IMEI/Controllers"
PROJECT_ROOT = "/Users/martin/Desktop/IMEI"
MODELS_DIR = os.path.join(PROJECT_ROOT, "Models")
db_path = os.path.join(MODELS_DIR, "imei_database.db")

print(f"Checking DB at: {db_path}")

try:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM registros LIMIT 5')
    rows = cursor.fetchall()
    print(f"Found {len(rows)} rows")
    for row in rows:
        print(dict(row))
    conn.close()
except Exception as e:
    print(f"Error: {e}")
