"""AgriMind AI - Market Service stub"""


async def get_market_data():
    return {
        "prices": [
            {"crop": "Rice", "price": 2150, "change": 2.3},
            {"crop": "Wheat", "price": 2275, "change": -0.8},
        ]
    }
