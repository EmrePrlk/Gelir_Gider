from rest_framework import serializers
from .models import Task
from datetime import date


class TaskSerializer(serializers.ModelSerializer):
    is_overdue = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'due_date', 'due_time', 'tags', 'is_recurring',
            'recurrence_rule', 'parent_task', 'completed_at',
            'created_at', 'is_overdue',
        ]
        read_only_fields = ['id', 'created_at', 'completed_at']

    def get_is_overdue(self, task: Task) -> bool:
        if task.status in ('done', 'cancelled'):
            return False
        return bool(task.due_date and task.due_date < date.today())
