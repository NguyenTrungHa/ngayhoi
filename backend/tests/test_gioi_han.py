import os
import sys
from pathlib import Path

import pytest

os.environ["DB_PATH"] = ":memory:"
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient

import main


@pytest.fixture(autouse=True)
def clear_dang_ky():
    main.db.execute("DELETE FROM dang_ky")
    main.db.commit()


@pytest.fixture
def client():
    return TestClient(main.app)


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
