"""AgriMind AI - Weather Service stub"""


async def get_weather_data(location: str = "Coimbatore"):
    return {
        "location": location,
        "temperature": 29,
        "humidity": 71,
        "condition": "Partly Cloudy",
    }
