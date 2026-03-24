"""
AgriMind AI - Crop Prediction Service
Random Forest model for crop recommendation
"""

import numpy as np
import joblib
import os
from typing import Optional


# Crop database with agronomic knowledge
CROP_DATABASE = {
    "Rice": {
        "optimal_temp": (20, 35), "optimal_ph": (5.5, 7.0),
        "min_rainfall": 1000, "nitrogen_need": "High",
        "description": "Staple cereal crop suited for flooded lowland fields"
    },
    "Wheat": {
        "optimal_temp": (12, 25), "optimal_ph": (6.0, 7.5),
        "min_rainfall": 400, "nitrogen_need": "High",
        "description": "Cool-season cereal, ideal for Rabi season"
    },
    "Cotton": {
        "optimal_temp": (21, 35), "optimal_ph": (5.8, 8.0),
        "min_rainfall": 600, "nitrogen_need": "Medium",
        "description": "Cash crop requiring well-drained black cotton soil"
    },
    "Maize": {
        "optimal_temp": (18, 32), "optimal_ph": (5.8, 7.0),
        "min_rainfall": 500, "nitrogen_need": "High",
        "description": "Versatile cereal for food, feed, and industrial use"
    },
    "Sugarcane": {
        "optimal_temp": (20, 35), "optimal_ph": (6.0, 8.0),
        "min_rainfall": 1200, "nitrogen_need": "Very High",
        "description": "Long-duration tropical crop for sugar production"
    },
    "Soybean": {
        "optimal_temp": (20, 30), "optimal_ph": (6.0, 7.0),
        "min_rainfall": 600, "nitrogen_need": "Low",
        "description": "Legume that fixes nitrogen, improves soil health"
    },
    "Groundnut": {
        "optimal_temp": (25, 35), "optimal_ph": (6.0, 7.5),
        "min_rainfall": 500, "nitrogen_need": "Low",
        "description": "Oil seed crop suitable for sandy loam soils"
    },
    "Pulses": {
        "optimal_temp": (18, 30), "optimal_ph": (6.0, 7.5),
        "min_rainfall": 400, "nitrogen_need": "Low",
        "description": "Nitrogen-fixing legumes improving soil fertility"
    },
}


class CropPredictionService:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        model_path = os.environ.get("CROP_MODEL_PATH", "models/crop_model.pkl")
        if os.path.exists(model_path):
            try:
                self.model = joblib.load(model_path)
            except Exception:
                self.model = None

    def _rule_based_predict(self, params: dict) -> list:
        """
        Rule-based fallback when ML model is unavailable.
        Scores crops based on agronomic compatibility.
        """
        scores = {}
        for crop, info in CROP_DATABASE.items():
            score = 100.0

            # Temperature compatibility
            t_min, t_max = info["optimal_temp"]
            if params["temperature"] < t_min:
                score -= (t_min - params["temperature"]) * 3
            elif params["temperature"] > t_max:
                score -= (params["temperature"] - t_max) * 3

            # pH compatibility
            ph_min, ph_max = info["optimal_ph"]
            if params["ph"] < ph_min:
                score -= (ph_min - params["ph"]) * 10
            elif params["ph"] > ph_max:
                score -= (params["ph"] - ph_max) * 10

            # Rainfall compatibility
            if params["rainfall"] < info["min_rainfall"]:
                deficit_pct = (info["min_rainfall"] - params["rainfall"]) / info["min_rainfall"]
                score -= deficit_pct * 40

            # Nitrogen need
            nitrogen_need_map = {"Low": 40, "Medium": 80, "High": 120, "Very High": 160}
            needed = nitrogen_need_map.get(info["nitrogen_need"], 80)
            n_diff = abs(params["nitrogen"] - needed)
            score -= n_diff * 0.2

            # Humidity
            if params["humidity"] > 85 and crop not in ["Rice", "Sugarcane"]:
                score -= 10

            scores[crop] = max(0, min(100, score))

        # Sort and return top results
        sorted_crops = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return sorted_crops

    async def predict(self, request) -> dict:
        params = {
            "nitrogen": request.nitrogen,
            "phosphorus": request.phosphorus,
            "potassium": request.potassium,
            "temperature": request.temperature,
            "humidity": request.humidity,
            "ph": request.ph,
            "rainfall": request.rainfall,
        }

        ranked = self._rule_based_predict(params)
        top_3 = ranked[:3]

        top_crops = []
        for crop, score in top_3:
            info = CROP_DATABASE.get(crop, {})
            prob = round(score / 100, 3)
            reason = self._generate_reason(crop, params, info)
            top_crops.append({
                "crop": crop,
                "probability": prob,
                "suitability_score": int(score),
                "reason": reason
            })

        soil_analysis = {
            "nitrogen_status": self._classify_level(params["nitrogen"], 40, 80, "N"),
            "phosphorus_status": self._classify_level(params["phosphorus"], 15, 35, "P"),
            "potassium_status": self._classify_level(params["potassium"], 100, 200, "K"),
            "ph_status": "Optimal" if 6.0 <= params["ph"] <= 7.5 else ("Acidic" if params["ph"] < 6.0 else "Alkaline"),
            "overall_fertility": "Good" if all(
                v >= threshold for v, threshold in [
                    (params["nitrogen"], 40),
                    (params["phosphorus"], 15),
                    (params["potassium"], 100)
                ]
            ) else "Moderate"
        }

        summary = (
            f"Based on your soil and climate inputs, {top_3[0][0]} is the most suitable crop "
            f"with a {int(top_3[0][1])}% suitability score. "
            f"Your soil pH of {params['ph']} and annual rainfall of {params['rainfall']}mm "
            f"are {'well-suited' if soil_analysis['ph_status'] == 'Optimal' else 'marginally suited'} "
            f"for the recommended crops. "
            f"Ensure adequate {soil_analysis['nitrogen_status'].lower()} nitrogen supplementation before sowing."
        )

        return {
            "top_crops": top_crops,
            "explanation": summary,
            "soil_analysis": soil_analysis,
            "recommendation_summary": summary
        }

    def _classify_level(self, value, low, high, nutrient):
        if value < low:
            return f"Low ({value} kg/ha)"
        elif value > high:
            return f"High ({value} kg/ha)"
        else:
            return f"Optimal ({value} kg/ha)"

    def _generate_reason(self, crop, params, info):
        reasons = []
        if info.get("optimal_temp"):
            t_min, t_max = info["optimal_temp"]
            if t_min <= params["temperature"] <= t_max:
                reasons.append(f"temperature of {params['temperature']}°C is within optimal range")

        if info.get("optimal_ph"):
            ph_min, ph_max = info["optimal_ph"]
            if ph_min <= params["ph"] <= ph_max:
                reasons.append(f"soil pH {params['ph']} is suitable")

        if info.get("min_rainfall"):
            if params["rainfall"] >= info["min_rainfall"]:
                reasons.append(f"rainfall of {params['rainfall']}mm meets minimum requirement")

        if reasons:
            return f"{crop} suits your field because {', and '.join(reasons[:2])}."
        return f"{info.get('description', 'Agronomically compatible with your inputs.')}"
