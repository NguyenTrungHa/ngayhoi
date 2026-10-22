import os, sys, httpx
from concurrent.futures import ThreadPoolExecutor

URL = f"http://localhost:{os.getenv('PORT', '8000')}/api/dang-ky"
PHIEN = sys.argv[1]           

def gui(i):
    r = httpx.post(URL, json={"ma_sv": f"TN{i:03}", "ma_phien": PHIEN}, timeout=60)
    return r.status_code

with ThreadPoolExecutor(max_workers=40) as ex:
    ma = list(ex.map(gui, range(40)))
print("201:", ma.count(201), "· 409:", ma.count(409))
