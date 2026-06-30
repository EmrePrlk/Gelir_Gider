import logging

logger = logging.getLogger(__name__)


def call_anthropic(
    system_prompt: str,
    user_text: str,
    model: str = "claude-3-5-haiku-20241022",
    max_tokens: int = 4096,
) -> str:
    """Call Anthropic API, return raw response text.

    Returns empty string when ANTHROPIC_API_KEY is not configured or on any error,
    so callers can implement their own fallback.
    """
    try:
        import anthropic
        from django.conf import settings

        api_key = getattr(settings, 'ANTHROPIC_API_KEY', None)
        if not api_key:
            return ''

        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model=model,
            max_tokens=max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": user_text[:12000]}],
        )
        return message.content[0].text.strip()
    except Exception as e:
        logger.error("Anthropic API call failed: %s", e)
        return ''
