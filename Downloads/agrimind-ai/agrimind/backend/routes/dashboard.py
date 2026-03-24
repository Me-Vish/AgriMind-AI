"""
AgriMind AI - Dashboard Routes
Provides aggregated data for the main dashboard
"""

from fastapi import APIRouter
from services.weather_service import get_weather_data
from services.market_service import get_market_data

router = APIRouter()


@router.get("/summary")
async def get_dashboard_summary():
    """Aggregated dashboard data: weather, soil health, crop preview, market snapshot"""
    return {
        "soil_health": {
            "ph": 6.8,
            "nitrogen": 42,
            "phosphorus": 18,
            "potassium": 205,
            "moisture": 64,
            "organic_carbon": 0.72,
            "status": "Good",
            "last_updated": "2025-06-10T08:00:00Z"
        },
        "weather": {
            "location": "Coimbatore, Tamil Nadu",
            "temperature": 29,
            "humidity": 71,
            "rainfall_mm": 12,
            "condition": "Partly Cloudy",
            "forecast": [
                {"day": "Mon", "high": 31, "low": 22, "condition": "Sunny"},
                {"day": "Tue", "high": 29, "low": 21, "condition": "Cloudy"},
                {"day": "Wed", "high": 27, "low": 20, "condition": "Rain"},
                {"day": "Thu", "high": 30, "low": 22, "condition": "Sunny"},
                {"day": "Fri", "high": 32, "low": 23, "condition": "Sunny"},
            ]
        },
        "crop_recommendations": [
            {"crop": "Rice", "suitability": 92, "season": "Kharif"},
            {"crop": "Cotton", "suitability": 87, "season": "Kharif"},
            {"crop": "Maize", "suitability": 81, "season": "Kharif"},
        ],
        "market_snapshot": [
            {"crop": "Rice", "price": 2150, "change": +2.3, "unit": "₹/quintal"},
            {"crop": "Wheat", "price": 2275, "change": -0.8, "unit": "₹/quintal"},
            {"crop": "Cotton", "price": 6820, "change": +1.1, "unit": "₹/quintal"},
            {"crop": "Maize", "price": 1890, "change": +0.5, "unit": "₹/quintal"},
            {"crop": "Soybean", "price": 4150, "change": -1.4, "unit": "₹/quintal"},
        ],
        "alerts": [
            {"type": "warning", "message": "Heavy rainfall expected in 3 days. Delay sowing if planned."},
            {"type": "info", "message": "Nitrogen levels slightly below optimal. Consider top dressing."},
        ]
    }


@router.get("/market-trends")
async def get_market_trends():
    """Historical market price data for charts"""
    return {
        "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        "crops": {
            "Rice": [1980, 2020, 2060, 2100, 2120, 2150],
            "Wheat": [2300, 2280, 2260, 2290, 2285, 2275],
            "Cotton": [6400, 6500, 6600, 6750, 6800, 6820],
            "Maize": [1750, 1780, 1820, 1860, 1875, 1890],
        }
    }
