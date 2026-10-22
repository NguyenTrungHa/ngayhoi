from uuid import uuid4

from fastapi.testclient import TestClient

import main


def test_con_cho_counts_only_registrations_for_requested_session():
    client = TestClient(main.app)
    ma_phien = f"TEST_{uuid4().hex}"
    ma_phien_khac = f"TEST_{uuid4().hex}"
    ma_svs = [f"TEST_{uuid4().hex}" for _ in range(3)]

    try:
        main.db.executemany(
            "INSERT INTO dang_ky VALUES (?, ?)",
            [
                (ma_svs[0], ma_phien),
                (ma_svs[1], ma_phien),
                (ma_svs[2], ma_phien_khac),
            ],
        )
        main.db.commit()

        response = client.get("/api/con-cho", params={"ma_phien": ma_phien})

        assert response.status_code == 200
        assert response.json() == {"con_cho": 28}
    finally:
        main.db.execute("DELETE FROM dang_ky WHERE ma_phien IN (?, ?)", (ma_phien, ma_phien_khac))
        main.db.commit()
