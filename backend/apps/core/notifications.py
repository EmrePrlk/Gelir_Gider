import json
import logging
from datetime import date

from django.conf import settings

logger = logging.getLogger(__name__)


def get_pending_counts(user):
    from apps.habits.models import Habit, HabitLog
    from apps.habits.serializers import is_scheduled
    from apps.tasks.models import Task

    today = date.today()

    habits = Habit.objects.filter(user=user, is_active=True)
    completed_habit_ids = set(
        HabitLog.objects.filter(
            habit__user=user, date=today, completed=True,
        ).values_list('habit_id', flat=True)
    )
    pending_habits = sum(
        1 for h in habits
        if is_scheduled(h, today) and h.id not in completed_habit_ids
    )

    pending_tasks = Task.objects.filter(
        user=user,
        due_date__lte=today,
        status__in=('todo', 'in_progress'),
    ).count()

    return pending_habits, pending_tasks


def send_push_to_user(user):
    from .models import PushSubscription
    try:
        sub = PushSubscription.objects.get(user=user)
    except PushSubscription.DoesNotExist:
        return

    pending_habits, pending_tasks = get_pending_counts(user)
    if pending_habits == 0 and pending_tasks == 0:
        return

    parts = []
    if pending_tasks:
        parts.append(f"📋 {pending_tasks} görev")
    if pending_habits:
        parts.append(f"🔔 {pending_habits} alışkanlık")

    body = ", ".join(parts) + " seni bekliyor"

    try:
        from pywebpush import webpush, WebPushException
        webpush(
            subscription_info={
                'endpoint': sub.endpoint,
                'keys': {'p256dh': sub.p256dh, 'auth': sub.auth},
            },
            data=json.dumps({
                'title': 'Günlük Kontrol',
                'body': body,
                'url': '/dashboard',
            }),
            vapid_private_key=settings.VAPID_PRIVATE_KEY,
            vapid_claims={'sub': f'mailto:{settings.VAPID_CLAIMS_EMAIL}'},
        )
        logger.info('Push gönderildi: %s', user.email)
    except Exception as e:
        logger.error('Push gönderilemedi (%s): %s', user.email, e)
        if 'expired' in str(e).lower() or '410' in str(e):
            sub.delete()
            logger.info('Expired subscription silindi: %s', user.email)
