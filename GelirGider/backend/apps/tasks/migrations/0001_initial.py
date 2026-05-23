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
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=500)),
                ('description', models.TextField(blank=True)),
                ('status', models.CharField(
                    choices=[('todo', 'Yapılacak'), ('in_progress', 'Devam Ediyor'), ('done', 'Tamamlandı'), ('cancelled', 'İptal')],
                    default='todo',
                    max_length=20,
                )),
                ('priority', models.CharField(
                    choices=[('low', 'Düşük'), ('medium', 'Orta'), ('high', 'Yüksek'), ('urgent', 'Acil')],
                    default='medium',
                    max_length=10,
                )),
                ('due_date', models.DateField(blank=True, null=True)),
                ('due_time', models.TimeField(blank=True, null=True)),
                ('tags', models.JSONField(default=list)),
                ('is_recurring', models.BooleanField(default=False)),
                ('recurrence_rule', models.JSONField(blank=True, null=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to=settings.AUTH_USER_MODEL,
                )),
                ('parent_task', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='subtasks',
                    to='tasks.task',
                )),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
