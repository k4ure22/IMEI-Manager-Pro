import sqlite3
import os

db_path = '/Users/martin/Desktop/IMEI/Models/imei_database.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Clean tables
cursor.execute("DELETE FROM registros")
cursor.execute("DELETE FROM papelera")
cursor.execute("DELETE FROM encargados")
cursor.execute("DELETE FROM clientes")

conn.commit()
conn.close()

print("Database cleaned successfully!")
