from django.db import models
from django.conf import settings


class Task(models.Model):
    STATUS_CHOICES = [
        ('todo', 'Yapılacak'),
        ('in_progress', 'Devam Ediyor'),
        ('done', 'Tamamlandı'),
        ('cancelled', 'İptal'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Düşük'),
        ('medium', 'Orta'),
        ('high', 'Yüksek'),
        ('urgent', 'Acil'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    due_date = models.DateField(null=True, blank=True)
    due_time = models.TimeField(null=True, blank=True)
    tags = models.JSONField(default=list)
    is_recurring = models.BooleanField(default=False)
    recurrence_rule = models.JSONField(null=True, blank=True)
    parent_task = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='subtasks')
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
