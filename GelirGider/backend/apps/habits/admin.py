from django.contrib import admin
from .models import Habit, HabitLog


@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'frequency', 'is_active', 'created_at']
    list_filter = ['frequency', 'is_active']
    search_fields = ['name', 'user__email']


@admin.register(HabitLog)
class HabitLogAdmin(admin.ModelAdmin):
    list_display = ['habit', 'date', 'completed']
    list_filter = ['completed']
    search_fields = ['habit__name']
