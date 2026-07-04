import logging

logger = logging.getLogger(__name__)


def call_anthropic(
    system_prompt: str,
    user_text: str,
    model: str = "llama-3.3-70b-versatile",
    max_tokens: int = 4096,
) -> str:
    """Call Groq API, return raw response text.

    Returns empty string when GROQ_API_KEY is not configured or on any error,
    so callers can implement their own fallback.
    """
    try:
        from groq import Groq
        from django.conf import settings

        api_key = getattr(settings, 'GROQ_API_KEY', None)
        if not api_key:
            return ''

        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model=model,
            max_tokens=max_tokens,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_text[:12000]},
            ],
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error("Groq API call failed: %s", e)
        return ''
