sequenceDiagram
    participant SV as Sinh viên
    participant UI as Giao diện
    participant API as FastAPI
    participant DB as SQLite
    SV->>UI: Bấm "Đăng ký" phiên đã chọn
    UI->>API: POST /api/dang-ky
    API->>DB: INSERT (ma_sv, ma_phien)
    API->>DB: COMMIT
    API-->>UI: 201 hoặc 409