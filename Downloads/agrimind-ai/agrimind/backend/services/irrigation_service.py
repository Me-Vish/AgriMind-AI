class IrrigationService:
    async def plan(self, data: dict) -> dict:
        crop = data["crop"]
        soil_type = data["soil_type"]
        growth_stage = data["growth_stage"]
        farm_size = float(data["farm_size"])
        temperature = float(data["temperature"])
        humidity = float(data["humidity"])
        rainfall_7d = float(data["rainfall_7d"])

        crop_factor = {
            "rice": 1.25,
            "sugarcane": 1.2,
            "banana": 1.15,
            "maize": 0.95,
            "cotton": 0.9,
            "wheat": 0.85,
            "groundnut": 0.8,
        }.get(crop.lower(), 1.0)

        stage_factor = {
            "sowing": 0.8,
            "vegetative": 1.0,
            "flowering": 1.2,
            "harvest": 0.7,
        }[growth_stage]

        soil_factor = {
            "sandy": 1.2,
            "red": 1.05,
            "alluvial": 1.0,
            "loam": 0.95,
            "black": 0.85,
        }.get(soil_type.lower(), 1.0)

        heat_score = max(0.0, (temperature - 22) * 1.8)
        dryness_score = max(0.0, 70 - humidity) * 0.7
        rain_relief = min(rainfall_7d, 60) * 1.5
        demand_index = max(18.0, (42 + heat_score + dryness_score - rain_relief) * crop_factor * stage_factor * soil_factor)

        water_mm = round(min(90.0, max(18.0, demand_index)), 1)
        total_litres = round(water_mm * farm_size * 4046.86, -1)

        if rainfall_7d >= 45:
            irrigation_need = "Low"
            next_irrigation = "After 4 to 5 days"
            risk_level = "Overwatering risk"
        elif rainfall_7d >= 20:
            irrigation_need = "Moderate"
            next_irrigation = "Within 2 to 3 days"
            risk_level = "Balanced moisture"
        else:
            irrigation_need = "High"
            next_irrigation = "Within 24 hours"
            risk_level = "Moisture stress"

        water_amount = f"{water_mm} mm water depth (~{int(total_litres):,} litres total)"
        recommendation_summary = (
            f"{crop.title()} in the {growth_stage} stage on {soil_type} soil currently needs "
            f"{irrigation_need.lower()} irrigation support based on temperature, humidity, and recent rainfall."
        )

        notes = [
            f"Target a uniform application across {farm_size:g} acres and avoid runoff in low areas.",
            "Prefer early morning or late evening irrigation to reduce evaporation loss.",
            f"Recent 7-day rainfall is {rainfall_7d:g} mm, so monitor root-zone moisture before the next cycle.",
        ]

        return {
            "irrigation_need": irrigation_need,
            "next_irrigation": next_irrigation,
            "water_amount": water_amount,
            "risk_level": risk_level,
            "recommendation_summary": recommendation_summary,
            "notes": notes,
        }
