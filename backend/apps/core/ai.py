import logging

logger = logging.getLogger(__name__)


def call_anthropic(
    system_prompt: str,
    user_text: str,
    model: str = "gemini-2.0-flash",
    max_tokens: int = 4096,
) -> str:
    """Call Gemini API, return raw response text.

    Returns empty string when GEMINI_API_KEY is not configured or on any error,
    so callers can implement their own fallback.
    """
    try:
        from google import genai
        from google.genai import types
        from django.conf import settings

        api_key = getattr(settings, 'GEMINI_API_KEY', None)
        if not api_key:
            return ''

        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=model,
            config=types.GenerateContentConfig(system_instruction=system_prompt),
            contents=user_text[:12000],
        )
        return response.text.strip()
    except Exception as e:
        logger.error("Gemini API call failed: %s", e)
        return ''
