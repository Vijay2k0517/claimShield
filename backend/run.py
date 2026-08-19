import uvicorn
import os

if __name__ == "__main__":
    print("🚀 Starting ClaimShield AI Backend (Restricted Watch Mode: app/ only)...")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["app"],
        reload_excludes=["uploads/*", "data/*", "venv/*", "*.png", "*.jpg", "*.jpeg"]
    )
