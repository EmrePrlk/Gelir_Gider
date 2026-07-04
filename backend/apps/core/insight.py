import logging
from datetime import date, timedelta
from decimal import Decimal

from django.db.models import Sum

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """Sen kişisel finans ve yaşam koçusun. Kullanıcının geçen haftasına ait özet verilerini analiz edip Türkçe, samimi, motive edici bir haftalık içgörü yazıyorsun.

Kurallar:
- Maksimum 3-4 kısa cümle veya madde
- Olumlu çerçevele, eleştiri değil yönlendirme
- Somut sayıları kullan (TL miktarları, gün sayıları)
- Eğer alışkanlık adı ile harcama kategorisi örtüşüyorsa (örn. "Kahve" alışkanlığı + "Kafe" harcaması) korelasyonu vurgula
- Emoji kullanma
- Markdown kullanma, sade düz metin"""


def build_week_summary(user) -> str:
    """Geçen 7 günün verilerini Claude için metin özetine dönüştürür."""
    from apps.finance.models import Transaction
    from apps.habits.models import Habit, HabitLog
    from apps.tasks.models import Task
    from apps.habits.serializers import is_scheduled

    today = date.today()
    seven_days_ago = today - timedelta(days=6)

    # ── Finans ────────────────────────────────────────────────────────────────
    transactions = Transaction.objects.filter(
        user=user, date__gte=seven_days_ago
    ).select_related('category')

    total_income = sum(t.amount for t in transactions if t.type == 'income')
    total_expense = sum(t.amount for t in transactions if t.type == 'expense')

    category_totals: dict = {}
    for t in transactions:
        if t.type == 'expense':
            cat_name = t.category.name if t.category else 'Kategorisiz'
            category_totals[cat_name] = category_totals.get(cat_name, Decimal('0')) + t.amount

    top_categories = sorted(category_totals.items(), key=lambda x: -x[1])[:5]
    cat_lines = ', '.join(f'{name}: {amt:.0f} TL' for name, amt in top_categories)

    finance_text = (
        f"Gelir: {total_income:.0f} TL | Gider: {total_expense:.0f} TL\n"
        f"En yüksek harcama kategorileri: {cat_lines or 'yok'}"
    )

    # ── Alışkanlıklar ─────────────────────────────────────────────────────────
    habits = Habit.objects.filter(user=user, is_active=True).prefetch_related('logs')
    habit_lines = []
    for h in habits:
        scheduled_days = [
            seven_days_ago + timedelta(days=i)
            for i in range(7)
            if is_scheduled(h, seven_days_ago + timedelta(days=i))
        ]
        completed_days = {
            log.date for log in h.logs.all()
            if log.completed and seven_days_ago <= log.date <= today
        }
        scheduled_count = len(scheduled_days)
        completed_count = sum(1 for d in scheduled_days if d in completed_days)
        if scheduled_count > 0:
            habit_lines.append(
                f"{h.name}: {completed_count}/{scheduled_count} gün tamamlandı"
            )

    habits_text = '\n'.join(habit_lines) if habit_lines else 'Alışkanlık verisi yok'

    # ── Görevler ─────────────────────────────────────────────────────────────
    total_tasks = Task.objects.filter(
        user=user, due_date__gte=seven_days_ago, due_date__lte=today
    ).exclude(status='cancelled').count()
    done_tasks = Task.objects.filter(
        user=user, due_date__gte=seven_days_ago, due_date__lte=today, status='done'
    ).count()
    tasks_text = f"Tamamlanan görev: {done_tasks}/{total_tasks}"

    return (
        f"[Geçen 7 Gün Özeti — {seven_days_ago} ile {today} arası]\n\n"
        f"FİNANS:\n{finance_text}\n\n"
        f"ALIŞKANLIKLAR:\n{habits_text}\n\n"
        f"GÖREVLER:\n{tasks_text}"
    )


def _fallback_content(user) -> str:
    """API key yokken ya da hata durumunda üretilen basit Türkçe özet."""
    from apps.finance.models import Transaction
    from apps.habits.models import HabitLog

    today = date.today()
    seven_days_ago = today - timedelta(days=6)

    expense = Transaction.objects.filter(
        user=user, type='expense', date__gte=seven_days_ago
    ).aggregate(s=Sum('amount'))['s'] or Decimal('0')

    completed_habits = HabitLog.objects.filter(
        habit__user=user, date__gte=seven_days_ago, completed=True
    ).count()

    return (
        f"Bu hafta toplam {expense:.0f} TL harcama yaptın "
        f"ve {completed_habits} alışkanlık kaydı tamamladın. "
        f"Detaylı içgörü için Anthropic API anahtarını ayarla."
    )


def generate_insight_for_user(user) -> None:
    """Kullanıcı için haftalık içgörü üretir ve DB'ye kaydeder."""
    from apps.core.ai import call_anthropic
    from apps.core.models import WeeklyInsight

    today = date.today()
    week_start = today - timedelta(days=today.weekday())  # Pazartesi

    summary = build_week_summary(user)
    content = call_anthropic(SYSTEM_PROMPT, summary)

    if not content:
        content = _fallback_content(user)

    WeeklyInsight.objects.update_or_create(
        user=user,
        week_start=week_start,
        defaults={'content': content},
    )
    logger.info("Weekly insight generated for %s (week: %s)", user.email, week_start)


def generate_insight_for_all_users() -> None:
    """Tüm aktif kullanıcılar için haftalık içgörü üretir (scheduler job'u çağırır)."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    for user in User.objects.filter(is_active=True):
        try:
            generate_insight_for_user(user)
        except Exception as e:
            logger.error("Failed to generate insight for %s: %s", user.email, e)
