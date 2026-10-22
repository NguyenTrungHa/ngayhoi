import os
import sqlite3
from contextlib import closing
from pathlib import Path
import time

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


SUC_CHUA = 30
DATABASE_PATH = os.getenv("DB_PATH", str(Path(__file__).with_name("dangky.db")))


class DangKy(BaseModel):
    ma_sv: str = Field(min_length=1)
    ma_phien: str = Field(min_length=1)


class KetQua(BaseModel):
    ok: bool


app = FastAPI(title="API Đăng ký")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def khoi_tao_co_so_du_lieu():
    with closing(sqlite3.connect(DATABASE_PATH)) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS dang_ky (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ma_sv TEXT NOT NULL,
                ma_phien TEXT NOT NULL,
                UNIQUE(ma_sv, ma_phien)
            )
            """
        )
        connection.commit()


@app.on_event("startup")
def khoi_dong():
    khoi_tao_co_so_du_lieu()


@app.post("/api/dang-ky", status_code=status.HTTP_201_CREATED, response_model=KetQua, responses={409: {"description": "Đã đăng ký"}})
def dang_ky(thong_tin: DangKy):
    try:
        with closing(sqlite3.connect(DATABASE_PATH, timeout=30)) as connection:
            ma_sv, ma_phien = thong_tin.ma_sv.strip(), thong_tin.ma_phien.strip()
            if connection.execute("SELECT 1 FROM dang_ky WHERE ma_sv = ? AND ma_phien = ?", (ma_sv, ma_phien)).fetchone():
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="DA_DANG_KY")
            # Đếm và ghi trong MỘT câu lệnh: SQLite thực thi nguyên tử, không có khe hở để chen vào.
            
            con_cho = connection.execute(
                """
                INSERT INTO dang_ky (ma_sv, ma_phien)
                SELECT ?, ?
                WHERE (SELECT COUNT(*) FROM dang_ky WHERE ma_phien = ?) < ?
                """,
                (ma_sv, ma_phien, ma_phien, SUC_CHUA),
            ).rowcount
            if con_cho == 0:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="HET_CHO")
            connection.commit()
    except sqlite3.IntegrityError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="DA_DANG_KY") from error
    return {"ok": True}
