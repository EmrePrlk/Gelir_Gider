import logging

from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Haftalık içgörü scheduler\'ını başlatır (blocking — Docker service olarak çalışır)'

    def handle(self, *args, **options):
        from apscheduler.schedulers.blocking import BlockingScheduler
        from apscheduler.triggers.cron import CronTrigger
        from django_apscheduler.jobstores import DjangoJobStore

        scheduler = BlockingScheduler(timezone='Europe/Istanbul')
        scheduler.add_jobstore(DjangoJobStore(), 'default')

        @scheduler.scheduled_job(
            CronTrigger(day_of_week='mon', hour=9, minute=0),
            id='weekly_insight_job',
            replace_existing=True,
            misfire_grace_time=3600,
        )
        def weekly_insight_job():
            from apps.core.insight import generate_insight_for_all_users
            self.stdout.write('Haftalık içgörü üretiliyor...')
            generate_insight_for_all_users()
            self.stdout.write(self.style.SUCCESS('Tamamlandı.'))

        self.stdout.write('Scheduler başlatıldı. Her Pazartesi 09:00 çalışır.')
        try:
            scheduler.start()
        except (KeyboardInterrupt, SystemExit):
            self.stdout.write('Scheduler durduruldu.')
