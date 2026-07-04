from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Tüm aktif kullanıcılar için haftalık AI içgörüsü üretir'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            help='Sadece bu kullanıcı için üret',
        )

    def handle(self, *args, **options):
        from apps.core.insight import generate_insight_for_user

        if options['email']:
            users = User.objects.filter(email=options['email'], is_active=True)
        else:
            users = User.objects.filter(is_active=True)

        for user in users:
            self.stdout.write(f'Üretiliyor: {user.email}... ', ending='')
            try:
                generate_insight_for_user(user)
                self.stdout.write(self.style.SUCCESS('OK'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'HATA: {e}'))
