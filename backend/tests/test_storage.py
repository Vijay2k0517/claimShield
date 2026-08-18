import io
import pytest
from httpx import AsyncClient, ASGITransport
from PIL import Image
from app.main import app


def create_test_image(format="JPEG", size=(200, 200), color=(255, 0, 0)) -> bytes:
    """Helper to generate in-memory dummy image bytes for upload tests."""
    buf = io.BytesIO()
    img = Image.new("RGB", size, color=color)
    img.save(buf, format=format)
    return buf.getvalue()


@pytest.mark.asyncio
async def test_upload_valid_jpeg_evidence():
    img_bytes = create_test_image(format="JPEG", size=(320, 240))
    files = {"file": ("damage_front.jpg", img_bytes, "image/jpeg")}

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/evidence/upload", files=files)

    assert response.status_code == 200
    data = response.json()
    assert data["filename"].endswith(".jpg")
    assert "/uploads/evidence/" in data["file_url"]
    assert data["image_width"] == 320
    assert data["image_height"] == 240
    assert data["size_bytes"] > 0


@pytest.mark.asyncio
async def test_upload_invalid_extension():
    files = {"file": ("script.py", b"print('hello')", "text/x-python")}

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/evidence/upload", files=files)

    assert response.status_code == 400
    assert "Unsupported file extension" in response.json()["detail"]


@pytest.mark.asyncio
async def test_upload_corrupted_image():
    files = {"file": ("fake_image.jpg", b"NOT_AN_IMAGE_DATA_12345", "image/jpeg")}

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/evidence/upload", files=files)

    assert response.status_code == 400
    assert "not a valid image" in response.json()["detail"]


@pytest.mark.asyncio
async def test_upload_batch_evidence():
    img1 = create_test_image(format="PNG", size=(100, 100))
    img2 = create_test_image(format="JPEG", size=(150, 150))
    files = [
        ("files", ("img1.png", img1, "image/png")),
        ("files", ("img2.jpg", img2, "image/jpeg"))
    ]

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/evidence/upload-batch", files=files)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["image_width"] == 100
    assert data[1]["image_width"] == 150
