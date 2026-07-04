import logging

logger = logging.getLogger(__name__)


def call_anthropic(
    system_prompt: str,
    user_text: str,
    model: str = "gemini-1.5-flash",
    max_tokens: int = 4096,
) -> str:
    """Call Gemini API, return raw response text.

    Returns empty string when GEMINI_API_KEY is not configured or on any error,
    so callers can implement their own fallback.
    """
    try:
        import google.generativeai as genai
        from django.conf import settings

        api_key = getattr(settings, 'GEMINI_API_KEY', None)
        if not api_key:
            return ''

        genai.configure(api_key=api_key)
        gemini_model = genai.GenerativeModel(
            model_name=model,
            system_instruction=system_prompt,
        )
        response = gemini_model.generate_content(user_text[:12000])
        return response.text.strip()
    except Exception as e:
        logger.error("Gemini API call failed: %s", e)
        return ''
