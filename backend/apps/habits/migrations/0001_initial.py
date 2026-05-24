from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Habit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('color', models.CharField(default='#A78BFA', max_length=7)),
                ('icon', models.CharField(default='Check', max_length=50)),
                ('frequency', models.CharField(
                    choices=[('daily', 'Her Gün'), ('weekdays', 'Hafta İçi'), ('custom', 'Özel')],
                    default='daily',
                    max_length=20,
                )),
                ('custom_days', models.JSONField(default=list)),
                ('target_streak', models.IntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='HabitLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('completed', models.BooleanField(default=True)),
                ('notes', models.TextField(blank=True)),
                ('habit', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='logs',
                    to='habits.habit',
                )),
            ],
            options={
                'ordering': ['-date'],
                'unique_together': {('habit', 'date')},
            },
        ),
    ]
