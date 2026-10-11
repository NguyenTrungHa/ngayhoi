import os
import sqlite3
import sys
from contextlib import closing
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

os.environ["DB_PATH"] = ":memory:"
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import main


_SQLITE_CONNECT = sqlite3.connect
_TEST_DB_URI = "file:test_gioi_han?mode=memory&cache=shared"
_DB_ANCHOR = _SQLITE_CONNECT(_TEST_DB_URI, uri=True)


def _connect_shared_memory(_database, *args, **kwargs):
    return _SQLITE_CONNECT(_TEST_DB_URI, *args, uri=True, **kwargs)


@pytest.fixture
def client(monkeypatch):
    # The app opens a new connection per request; shared cache keeps its in-memory DB alive.
    monkeypatch.setattr(main, "DATABASE_PATH", _TEST_DB_URI)
    monkeypatch.setattr(main.sqlite3, "connect", _connect_shared_memory)

    with TestClient(main.app) as test_client:
        with closing(_SQLITE_CONNECT(_TEST_DB_URI, uri=True)) as connection:
            connection.execute("DELETE FROM dang_ky")
            connection.commit()
        yield test_client


def dang_ky(client, ma_sv, ma_phien):
    return client.post(
        "/api/dang-ky",
        json={"ma_sv": ma_sv, "ma_phien": ma_phien},
    )


def test_phien_trong_dang_ky_thanh_cong(client):
    response = dang_ky(client, "SV001", "P01")

    assert response.status_code == 201


def test_phien_con_29_cho_dang_ky_thanh_cong(client):
    for i in range(29):
        response = dang_ky(client, f"SV{i:03}", "P01")
        assert response.status_code == 201

    response = dang_ky(client, "SV029", "P01")

    assert response.status_code == 201


def test_phien_du_30_cho_tu_choi_sinh_vien_moi(client):
    for i in range(30):
        response = dang_ky(client, f"SV{i:03}", "P01")
        assert response.status_code == 201

    response = dang_ky(client, "SV030", "P01")

    assert response.status_code == 409
    assert response.json()["detail"] == "HET_CHO"


def test_sinh_vien_dang_ky_lai_nhan_loi_da_dang_ky(client):
    for i in range(30):
        response = dang_ky(client, f"SV{i:03}", "P01")
        assert response.status_code == 201

    response = dang_ky(client, "SV000", "P01")

    assert response.status_code == 409
    assert response.json()["detail"] == "DA_DANG_KY"


def test_gioi_han_duoc_dem_rieng_theo_phien(client):
    for i in range(30):
        response = dang_ky(client, f"SV{i:03}", "P01")
        assert response.status_code == 201

    response = dang_ky(client, "SV031", "P02")

    assert response.status_code == 201
