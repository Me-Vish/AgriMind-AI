"""
AgriMind AI - Backend Entry Point
FastAPI application with ML models, RAG, and multilingual support
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

from routes import crop, disease, chat, voice, dashboard, irrigation

app = FastAPI(
    title="AgriMind AI API",
    description="Intelligent Farming Assistant - Production API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(crop.router, prefix="/api", tags=["Crop Prediction"])
app.include_router(irrigation.router, prefix="/api", tags=["Irrigation Planner"])
app.include_router(disease.router, prefix="/api", tags=["Disease Detection"])
app.include_router(chat.router, prefix="/api", tags=["Chat Assistant"])
app.include_router(voice.router, prefix="/api", tags=["Voice"])

# Static files for uploads
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "AgriMind AI", "version": "1.0.0"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
