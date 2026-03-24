"""
AgriMind AI - Chat Service
RAG-based conversational AI with stronger rule-based fallback
"""

import os
from typing import Optional
from dotenv import load_dotenv
from services.translation_service import translate_text

load_dotenv()

AGRI_KNOWLEDGE_BASE = {
    "soil preparation": "Before planting, conduct soil testing to determine pH and nutrient levels. Most crops prefer a pH of 6.0-7.5. Add lime to raise pH or sulfur to lower it. Incorporate organic matter such as compost at 10-15 tonnes/ha to improve soil structure.",
    "irrigation management": "Irrigation scheduling depends on crop stage, soil type, and climate. Rice needs continuous flooding during tillering, while wheat requires irrigation at crown root initiation, jointing, and grain filling stages.",
    "fertilizer application": "NPK application should be based on soil test results. Apply phosphorus and potassium before sowing, and split nitrogen into basal and top-dressing doses.",
    "pest management": "Integrated Pest Management combines field monitoring, cultural control, biological control, and targeted spraying only when thresholds are reached.",
    "crop rotation": "Rotate cereals with legumes to reduce pest pressure and improve soil fertility.",
    "weather impact": "Temperature, rainfall, humidity, and wind directly affect crop growth. Heat stress, unseasonal rain, and waterlogging can reduce yield.",
    "market pricing": "Agricultural prices depend on arrivals, quality, local demand, MSP support, and transport access.",
    "organic farming": "Organic farming uses compost, biofertilizers, crop rotation, mulching, and biological pest management instead of synthetic inputs.",
}

SYSTEM_PROMPT = """You are AgriMind AI, a professional agricultural advisory assistant.
You provide accurate, actionable farming advice to Indian farmers.
Be concise, practical, and empathetic. Use simple language.
When uncertain, say so clearly and offer the safest next step.
Always mention safety precautions when discussing pesticides or chemicals."""

SUGGESTED_QUESTIONS = {
    "crop": [
        "What fertilizer dose is recommended for rice?",
        "How do I control weeds in wheat fields?",
        "When should I apply second irrigation to cotton?",
    ],
    "disease": [
        "How do I identify blast disease in rice?",
        "What is the treatment for powdery mildew?",
        "How to prevent early blight in tomatoes?",
    ],
    "soil": [
        "How do I improve soil organic carbon?",
        "What is the ideal soil pH for maize?",
        "How often should I do soil testing?",
    ],
    "weather": [
        "How does humidity affect crop disease?",
        "What should I do before heavy rain?",
        "How often should I irrigate in hot weather?",
    ],
    "general": [
        "What crops are suitable for black cotton soil?",
        "How do I apply drip irrigation for cotton?",
        "What government schemes are available for farmers?",
    ]
}


class ChatService:
    def __init__(self):
        self.ai_provider = os.environ.get("AI_PROVIDER", "gemini")
        self.gemini_key = os.environ.get("GEMINI_API_KEY", "")
        self.openai_key = os.environ.get("OPENAI_API_KEY", "")
        self._init_ai_client()

    def _init_ai_client(self):
        self.gemini_client = None
        self.openai_client = None

        if self.gemini_key and self.gemini_key != "your_gemini_api_key_here":
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.gemini_key)
                self.gemini_client = genai.GenerativeModel("gemini-pro")
            except Exception:
                pass

        if self.openai_key and self.openai_key != "your_openai_api_key_here":
            try:
                from openai import AsyncOpenAI
                self.openai_client = AsyncOpenAI(api_key=self.openai_key)
            except Exception:
                pass

    def _rag_retrieve(self, query: str) -> str:
        query_lower = query.lower()
        retrieved = []
        keywords = {
            "soil": ["soil preparation", "fertilizer application"],
            "fertilizer": ["fertilizer application"],
            "urea": ["fertilizer application"],
            "water": ["irrigation management"],
            "irrigat": ["irrigation management"],
            "pest": ["pest management"],
            "disease": ["pest management"],
            "weather": ["weather impact"],
            "rain": ["weather impact"],
            "temperature": ["weather impact"],
            "market": ["market pricing"],
            "price": ["market pricing"],
            "msp": ["market pricing"],
            "organic": ["organic farming"],
            "rotation": ["crop rotation"],
        }

        for keyword, topics in keywords.items():
            if keyword in query_lower:
                for topic in topics:
                    if topic in AGRI_KNOWLEDGE_BASE:
                        retrieved.append(AGRI_KNOWLEDGE_BASE[topic])

        if not retrieved:
            retrieved = [AGRI_KNOWLEDGE_BASE["soil preparation"]]

        return "\n\n".join(retrieved[:2])

    def _get_suggested_questions(self, response: str) -> list:
        response_lower = response.lower()
        if any(w in response_lower for w in ["weather", "rain", "humidity", "temperature"]):
            return SUGGESTED_QUESTIONS["weather"][:2]
        if any(w in response_lower for w in ["disease", "blight", "rust", "mildew"]):
            return SUGGESTED_QUESTIONS["disease"][:2]
        if any(w in response_lower for w in ["soil", "ph", "nutrient"]):
            return SUGGESTED_QUESTIONS["soil"][:2]
        if any(w in response_lower for w in ["crop", "wheat", "rice", "cotton"]):
            return SUGGESTED_QUESTIONS["crop"][:2]
        return SUGGESTED_QUESTIONS["general"][:2]

    def _fallback_response(self, message: str) -> str:
        msg_lower = message.lower()

        if any(w in msg_lower for w in ["hello", "hi", "namaste", "vanakkam"]):
            return (
                "Hello. I can help with crops, disease management, irrigation, soil health, weather risks, and market decisions. "
                "Tell me your crop and location if you want a more specific answer."
            )

        if any(w in msg_lower for w in ["weather", "temperature", "humidity", "rain", "forecast"]):
            return (
                "Weather affects irrigation, disease pressure, and fertilizer timing. "
                "If heavy rain is expected, avoid spraying pesticides immediately before rainfall, improve drainage, and delay top-dressing nitrogen. "
                "If you share your crop and district, I can suggest what action to take."
            )

        if "ph" in msg_lower or "soil" in msg_lower:
            return (
                f"{AGRI_KNOWLEDGE_BASE['soil preparation']} "
                "For the best recommendation, do a soil test through your nearest KVK or agriculture office."
            )

        if any(w in msg_lower for w in ["fertilizer", "npk", "urea", "nitrogen"]):
            return (
                f"{AGRI_KNOWLEDGE_BASE['fertilizer application']} "
                "For a precise dose, tell me the crop, growth stage, and whether you have a soil test report."
            )

        if any(w in msg_lower for w in ["pest", "insect", "disease", "spray"]):
            return (
                f"{AGRI_KNOWLEDGE_BASE['pest management']} "
                "Use chemicals only at recommended dose and wear gloves, mask, and eye protection during spraying."
            )

        if any(w in msg_lower for w in ["water", "irrigat"]):
            return AGRI_KNOWLEDGE_BASE["irrigation management"]

        if any(w in msg_lower for w in ["price", "market", "msp", "sell"]):
            return (
                f"{AGRI_KNOWLEDGE_BASE['market pricing']} "
                "For current local prices, compare your nearest mandi with e-NAM before selling."
            )

        return (
            "I can help, but I need a little more detail. Please tell me the crop name, growth stage, and your location or weather condition. "
            "That will let me give a practical farming recommendation instead of a generic answer."
        )

    async def _translate_suggestions(self, suggestions: list[str], language: str) -> list[str]:
        if language == "en":
            return suggestions
        return [await translate_text(item, language) for item in suggestions]

    async def respond(self, message: str, history: list, language: str, context: Optional[dict]) -> dict:
        rag_context = self._rag_retrieve(message)
        history_text = ""
        for msg in (history or [])[-6:]:
            role = "Farmer" if msg.role == "user" else "AgriMind"
            history_text += f"{role}: {msg.content}\n"

        lang_map = {"en": "English", "ta": "Tamil", "hi": "Hindi"}
        lang_name = lang_map.get(language, "English")
        lang_instruction = f" Please respond in {lang_name}." if language != "en" else ""
        full_prompt = (
            f"{SYSTEM_PROMPT}{lang_instruction}\n\n"
            f"Agricultural Knowledge:\n{rag_context}\n\n"
            f"{'Previous conversation:' + chr(10) + history_text if history_text else ''}"
            f"Farmer's question: {message}"
        )

        response_text = None
        sources = ["AgriMind Knowledge Base"]

        if self.gemini_client:
            try:
                response = self.gemini_client.generate_content(full_prompt)
                response_text = response.text
                sources.append("Gemini AI")
            except Exception:
                pass

        if not response_text and self.openai_client:
            try:
                completion = await self.openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT + lang_instruction},
                        {"role": "user", "content": f"Context: {rag_context}\n\nQuestion: {message}"}
                    ],
                    max_tokens=600
                )
                response_text = completion.choices[0].message.content
                sources.append("OpenAI GPT")
            except Exception:
                pass

        if not response_text:
            response_text = self._fallback_response(message)

        if language != "en":
            response_text = await translate_text(response_text, language)

        suggested = self._get_suggested_questions(response_text)
        suggested = await self._translate_suggestions(suggested, language)

        return {
            "response": response_text,
            "sources": sources,
            "suggested_questions": suggested,
            "language": language
        }
