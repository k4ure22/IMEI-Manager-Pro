import os
import sys

# Add project root to path
sys.path.append('/Users/martin/Desktop/IMEI')

from Controllers.main import Api

api = Api()
result = api.exportar_excel()
print(result)
