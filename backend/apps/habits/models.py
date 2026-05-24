from django.db import models
from django.conf import settings


class Habit(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Her Gün'),
        ('weekdays', 'Hafta İçi'),
        ('custom', 'Özel'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#A78BFA')
    icon = models.CharField(max_length=50, default='check')
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='daily')
    custom_days = models.JSONField(default=list)
    target_streak = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.name


class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='logs')
    date = models.DateField()
    completed = models.BooleanField(default=True)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ['habit', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.habit.name} — {self.date}"
