"""
Sprint 7 prerequisite tests.

Run with: python manage.py test tests.test_sprint7
"""
from datetime import date, timedelta
from unittest.mock import patch, MagicMock

from django.test import TestCase, override_settings

from apps.habits.serializers import (
    calculate_current_streak,
    calculate_longest_streak,
    is_scheduled,
)


# ─── Helpers ────────────────────────────────────────────────────────────────

def _daily_habit():
    h = MagicMock()
    h.frequency = 'daily'
    h.custom_days = []
    return h


def _weekday_habit():
    h = MagicMock()
    h.frequency = 'weekdays'
    h.custom_days = []
    return h


# ─── Streak tests ────────────────────────────────────────────────────────────

class StreakCalculationTests(TestCase):

    def test_no_logs_streak_is_zero(self):
        h = _daily_habit()
        self.assertEqual(calculate_current_streak(h, set(), date.today()), 0)

    def test_streak_counts_consecutive_days(self):
        h = _daily_habit()
        today = date.today()
        logs = {today - timedelta(days=i) for i in range(5)}  # today + 4 prev days
        self.assertEqual(calculate_current_streak(h, logs, today), 5)

    def test_gap_resets_streak(self):
        h = _daily_habit()
        today = date.today()
        # Complete yesterday and 3 days ago, but NOT 2 days ago
        logs = {today - timedelta(days=1), today - timedelta(days=3)}
        streak = calculate_current_streak(h, logs, today)
        # Grace for today → counts yesterday only before hitting gap
        self.assertEqual(streak, 1)

    def test_grace_period_today_not_yet_completed(self):
        h = _daily_habit()
        today = date.today()
        # Completed yesterday and the day before, not yet today
        logs = {today - timedelta(days=1), today - timedelta(days=2)}
        streak = calculate_current_streak(h, logs, today)
        self.assertEqual(streak, 2)

    def test_longest_streak(self):
        h = _daily_habit()
        today = date.today()
        # Two separate streaks: 3 days and 4 days
        streak_a = {today - timedelta(days=i) for i in range(10, 7, -1)}  # days 10,9,8
        streak_b = {today - timedelta(days=i) for i in range(4, 0, -1)}   # days 4,3,2,1
        logs = streak_a | streak_b
        self.assertEqual(calculate_longest_streak(h, logs), 4)

    def test_weekday_habit_skips_weekend(self):
        h = _weekday_habit()
        # Find a Monday
        today = date.today()
        days_to_monday = today.weekday()  # 0=Mon
        monday = today - timedelta(days=days_to_monday)
        # Logs: Mon, Tue, Wed, Thu, Fri (5 consecutive weekdays)
        logs = {monday + timedelta(days=i) for i in range(5)}
        streak = calculate_current_streak(h, logs, monday + timedelta(days=4))  # Friday
        self.assertEqual(streak, 5)


# ─── Claude API fallback tests ───────────────────────────────────────────────

class ClaudeApiFallbackTests(TestCase):

    @override_settings(GROQ_API_KEY='')
    def test_call_anthropic_returns_empty_when_no_key(self):
        from apps.core.ai import call_anthropic
        result = call_anthropic("system prompt", "user text")
        self.assertEqual(result, '')

    @override_settings(GROQ_API_KEY='')
    def test_finance_import_falls_back_to_csv_parse(self):
        from apps.finance.views import _call_anthropic

        csv_text = "tarih,tutar,açıklama\n2026-01-15,250.00,Market alışverişi\n2026-01-16,-500.00,Elektrik faturası"
        rows = _call_anthropic(csv_text)

        self.assertIsInstance(rows, list)
        self.assertGreater(len(rows), 0)
        for row in rows:
            self.assertIn('date', row)
            self.assertIn('amount', row)
            self.assertIn('type', row)

    @override_settings(GROQ_API_KEY='test-key-123')
    def test_call_anthropic_uses_key_and_handles_api_error(self):
        """API error should not raise — returns empty string."""
        from apps.core.ai import call_anthropic

        with patch('groq.Groq') as mock_cls:
            mock_cls.return_value.chat.completions.create.side_effect = Exception("connection refused")
            result = call_anthropic("system prompt", "user text")

        self.assertEqual(result, '')

    @override_settings(GROQ_API_KEY='test-key-123')
    def test_call_anthropic_returns_response_text(self):
        from apps.core.ai import call_anthropic

        with patch('groq.Groq') as mock_cls:
            mock_cls.return_value.chat.completions.create.return_value = MagicMock(
                choices=[MagicMock(message=MagicMock(content='  hello world  '))]
            )
            result = call_anthropic("system prompt", "user text")

        self.assertEqual(result, 'hello world')
