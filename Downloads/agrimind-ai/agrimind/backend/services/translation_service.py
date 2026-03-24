"""
AgriMind AI - Translation Service
Multilingual response support (English, Tamil, Hindi)
"""

from deep_translator import GoogleTranslator

SUPPORTED_LANGUAGES = {"en": "English", "ta": "Tamil", "hi": "Hindi"}


async def translate_text(text: str, target_language: str) -> str:
    """Translate a text string to target language"""
    if target_language == "en" or target_language not in SUPPORTED_LANGUAGES:
        return text
    try:
        translator = GoogleTranslator(source="en", target=target_language)
        return translator.translate(text)
    except Exception:
        return text  # Return original on failure


async def translate_response(response_dict: dict, target_language: str) -> dict:
    """Translate key text fields in a response dictionary"""
    if target_language == "en":
        return response_dict

    translatable_keys = ["explanation", "recommendation_summary", "reason", "description"]

    for key in translatable_keys:
        if key in response_dict and isinstance(response_dict[key], str):
            response_dict[key] = await translate_text(response_dict[key], target_language)

    if "top_crops" in response_dict:
        for crop in response_dict["top_crops"]:
            if "reason" in crop:
                crop["reason"] = await translate_text(crop["reason"], target_language)

    return response_dict
