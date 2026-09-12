import sys
import types

# Runtime hook for PyInstaller:
# Stubs pyiceberg so storage3 can import RestCatalog without requiring pyiceberg or pyarrow
if 'pyiceberg' not in sys.modules:
    pyiceberg = types.ModuleType('pyiceberg')
    catalog = types.ModuleType('pyiceberg.catalog')
    rest = types.ModuleType('pyiceberg.catalog.rest')

    class RestCatalog:
        def __init__(self, *args, **kwargs):
            pass

    rest.RestCatalog = RestCatalog
    catalog.rest = rest
    pyiceberg.catalog = catalog

    sys.modules['pyiceberg'] = pyiceberg
    sys.modules['pyiceberg.catalog'] = catalog
    sys.modules['pyiceberg.catalog.rest'] = rest
