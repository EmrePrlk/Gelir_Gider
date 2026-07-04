"""Sprint 7 — WeeklyInsight üretme testleri."""
from datetime import date, timedelta
from unittest.mock import patch, MagicMock
from decimal import Decimal

from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model

from apps.core.models import WeeklyInsight

User = get_user_model()


def _make_user(email='test@example.com'):
    return User.objects.create_user(
        email=email, username=email, password='pass123'
    )


class InsightDataTests(TestCase):
    """build_week_summary veriyi doğru topluyor mu?"""

    def setUp(self):
        self.user = _make_user()
        today = date.today()
        from apps.finance.models import Category, Transaction
        cat = Category.objects.create(
            user=self.user, name='Market', type='expense', color='#fff', icon='cart'
        )
        Transaction.objects.create(
            user=self.user, date=today - timedelta(days=2),
            amount=Decimal('250.00'), description='Migros',
            category=cat, type='expense',
        )
        Transaction.objects.create(
            user=self.user, date=today - timedelta(days=1),
            amount=Decimal('5000.00'), description='Maaş',
            category=None, type='income',
        )

    def test_summary_includes_expense_and_income(self):
        from apps.core.insight import build_week_summary
        summary = build_week_summary(self.user)
        self.assertIn('5000', summary)
        self.assertIn('250', summary)
        self.assertIn('Market', summary)

    def test_summary_is_string(self):
        from apps.core.insight import build_week_summary
        summary = build_week_summary(self.user)
        self.assertIsInstance(summary, str)
        self.assertGreater(len(summary), 10)


class GenerateInsightTests(TestCase):

    def setUp(self):
        self.user = _make_user('insight@test.com')

    @override_settings(ANTHROPIC_API_KEY='test-key')
    def test_insight_saved_to_db(self):
        from apps.core.insight import generate_insight_for_user

        mock_content = MagicMock()
        mock_content.text = 'Bu hafta harika gitti!'
        mock_message = MagicMock()
        mock_message.content = [mock_content]

        with patch('anthropic.Anthropic') as mock_cls:
            mock_cls.return_value.messages.create.return_value = mock_message
            generate_insight_for_user(self.user)

        insight = WeeklyInsight.objects.get(user=self.user)
        self.assertEqual(insight.content, 'Bu hafta harika gitti!')

    @override_settings(ANTHROPIC_API_KEY='')
    def test_no_key_saves_fallback_message(self):
        from apps.core.insight import generate_insight_for_user
        generate_insight_for_user(self.user)
        insight = WeeklyInsight.objects.filter(user=self.user).first()
        self.assertIsNotNone(insight)
        self.assertGreater(len(insight.content), 0)

    @override_settings(ANTHROPIC_API_KEY='test-key')
    def test_regenerate_updates_existing(self):
        from apps.core.insight import generate_insight_for_user
        today = date.today()
        week_start = today - timedelta(days=today.weekday())
        WeeklyInsight.objects.create(
            user=self.user, week_start=week_start, content='Eski içgörü'
        )

        mock_content = MagicMock()
        mock_content.text = 'Yeni içgörü'
        mock_message = MagicMock()
        mock_message.content = [mock_content]

        with patch('anthropic.Anthropic') as mock_cls:
            mock_cls.return_value.messages.create.return_value = mock_message
            generate_insight_for_user(self.user)

        self.assertEqual(WeeklyInsight.objects.filter(user=self.user).count(), 1)
        self.assertEqual(WeeklyInsight.objects.get(user=self.user).content, 'Yeni içgörü')
