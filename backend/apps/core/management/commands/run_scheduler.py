import logging

from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


def run_weekly_insight_job():
    from apps.core.insight import generate_insight_for_all_users
    logger.info('Haftalık içgörü üretiliyor...')
    generate_insight_for_all_users()
    logger.info('Haftalık içgörü tamamlandı.')


def run_morning_notification_job():
    from apps.core.models import PushSubscription
    from apps.core.notifications import send_push_to_user
    logger.info('Sabah bildirimleri gönderiliyor...')
    subs = PushSubscription.objects.select_related('user').all()
    for sub in subs:
        send_push_to_user(sub.user)
    logger.info('Sabah bildirimleri tamamlandı.')


class Command(BaseCommand):
    help = 'Scheduler\'ı başlatır (blocking — Docker service olarak çalışır)'

    def handle(self, *args, **options):
        from apscheduler.schedulers.blocking import BlockingScheduler
        from apscheduler.triggers.cron import CronTrigger
        from django_apscheduler.jobstores import DjangoJobStore

        scheduler = BlockingScheduler(timezone='Europe/Istanbul')
        scheduler.add_jobstore(DjangoJobStore(), 'default')

        scheduler.add_job(
            run_weekly_insight_job,
            trigger=CronTrigger(day_of_week='mon', hour=9, minute=0),
            id='weekly_insight_job',
            jobstore='default',
            replace_existing=True,
            misfire_grace_time=3600,
        )

        scheduler.add_job(
            run_morning_notification_job,
            trigger=CronTrigger(hour=10, minute=0),
            id='morning_notification_job',
            jobstore='default',
            replace_existing=True,
            misfire_grace_time=3600,
        )

        self.stdout.write('Scheduler başlatıldı. Her gün 10:00 bildirim, her Pazartesi 09:00 içgörü.')
        try:
            scheduler.start()
        except (KeyboardInterrupt, SystemExit):
            self.stdout.write('Scheduler durduruldu.')
