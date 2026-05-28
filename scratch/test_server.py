import requests
import sys

port = sys.argv[1]
base_url = f"http://127.0.0.1:{port}"

paths = [
    "/Views/html/Dashboard.html",
    "/Views/js/dashboard.js",
    "/Views/css/dashboard.css"
]

for path in paths:
    url = base_url + path
    try:
        r = requests.get(url, timeout=2)
        print(f"{path}: {r.status_code} ({len(r.content)} bytes)")
    except Exception as e:
        print(f"{path}: Error {e}")
