from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
    max_age=0,
)

db = sqlite3.connect("ngayhoi.db", check_same_thread=False)
db.execute("""CREATE TABLE IF NOT EXISTS dang_ky(
  ma_sv TEXT, ma_phien TEXT, UNIQUE(ma_sv, ma_phien))""")

class DangKy(BaseModel):
    ma_sv: str
    ma_phien: str

@app.get("/api/con-cho")
def con_cho(ma_phien: str):
    count = db.execute(
        "SELECT COUNT(*) FROM dang_ky WHERE ma_phien = ?",
        (ma_phien,),
    ).fetchone()[0]

    return {"con_cho": max(0, 30 - count)}

@app.post("/api/dang-ky", status_code=201)
def dang_ky(d: DangKy):
    try:
        db.execute("INSERT INTO dang_ky VALUES (?, ?)", (d.ma_sv, d.ma_phien)); db.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(409, "DA_DANG_KY")
    return {"ok": True}
