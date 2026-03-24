"""
AgriMind AI - Utility Helpers
"""

import re
from typing import Union


def sanitize_filename(name: str) -> str:
    """Remove unsafe characters from filenames"""
    return re.sub(r"[^\w\-.]", "_", name)


def clamp(value: float, min_val: float, max_val: float) -> float:
    """Clamp a value between min and max"""
    return max(min_val, min(max_val, value))


def format_currency_inr(amount: float) -> str:
    """Format number as Indian Rupees"""
    return f"₹{amount:,.0f}"


def truncate_text(text: str, max_length: int = 200, suffix: str = "...") -> str:
    """Truncate text to max_length characters"""
    if len(text) <= max_length:
        return text
    return text[:max_length - len(suffix)].rstrip() + suffix


def normalize_language_code(lang: str) -> str:
    """Normalize language codes to supported set"""
    supported = {"en", "ta", "hi"}
    lang = lang.lower().strip()
    if lang in supported:
        return lang
    # Handle variants like "en-IN", "ta-IN"
    base = lang.split("-")[0]
    return base if base in supported else "en"
