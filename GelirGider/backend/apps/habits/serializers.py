from rest_framework import serializers
from .models import Habit, HabitLog
from datetime import date, timedelta


def is_scheduled(habit: 'Habit', d: date) -> bool:
    if habit.frequency == 'daily':
        return True
    if habit.frequency == 'weekdays':
        return d.weekday() < 5
    if habit.frequency == 'custom':
        return d.weekday() in (habit.custom_days or [])
    return True


def calculate_current_streak(habit: 'Habit', logs_set: set, today: date) -> int:
    """Count consecutive completed scheduled days going backward from today.
    Today gets a grace period — not breaking the streak if not yet completed."""
    streak = 0
    d = today
    grace = True

    while d >= today - timedelta(days=730):
        if is_scheduled(habit, d):
            if d in logs_set:
                streak += 1
                grace = False
            elif grace and d == today:
                pass  # today still in progress
            else:
                break
        d -= timedelta(days=1)

    return streak


def calculate_longest_streak(habit: 'Habit', logs_set: set) -> int:
    if not logs_set:
        return 0

    sorted_dates = sorted(logs_set)
    longest = 0
    current = 0
    prev = None

    for d in sorted_dates:
        if prev is None:
            current = 1
        else:
            check = prev + timedelta(days=1)
            consecutive = True
            while check < d:
                if is_scheduled(habit, check):
                    consecutive = False
                    break
                check += timedelta(days=1)
            current = current + 1 if consecutive else 1

        prev = d
        longest = max(longest, current)

    return longest


def calculate_completion_rate(habit: 'Habit', logs_set: set, days: int | None) -> float:
    today = date.today()
    start = (today - timedelta(days=days - 1)) if days else habit.created_at.date()

    total = completed = 0
    d = start
    while d <= today:
        if is_scheduled(habit, d):
            total += 1
            if d in logs_set:
                completed += 1
        d += timedelta(days=1)

    return round(completed / total * 100, 1) if total else 0.0


class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        fields = ['id', 'habit', 'date', 'completed', 'notes']
        read_only_fields = ['id']


class HabitSerializer(serializers.ModelSerializer):
    current_streak = serializers.SerializerMethodField()
    longest_streak = serializers.SerializerMethodField()
    completion_rate_30 = serializers.SerializerMethodField()
    completion_rate_90 = serializers.SerializerMethodField()
    completion_rate_all = serializers.SerializerMethodField()
    is_completed_today = serializers.SerializerMethodField()

    class Meta:
        model = Habit
        fields = [
            'id', 'name', 'description', 'color', 'icon',
            'frequency', 'custom_days', 'target_streak',
            'is_active', 'created_at',
            'current_streak', 'longest_streak',
            'completion_rate_30', 'completion_rate_90', 'completion_rate_all',
            'is_completed_today',
        ]
        read_only_fields = ['id', 'created_at']

    def _logs(self, habit: Habit) -> set:
        attr = '_completed_logs_set'
        if not hasattr(habit, attr):
            setattr(habit, attr, {log.date for log in habit.logs.all() if log.completed})
        return getattr(habit, attr)

    def get_current_streak(self, habit):
        return calculate_current_streak(habit, self._logs(habit), date.today())

    def get_longest_streak(self, habit):
        return calculate_longest_streak(habit, self._logs(habit))

    def get_completion_rate_30(self, habit):
        return calculate_completion_rate(habit, self._logs(habit), 30)

    def get_completion_rate_90(self, habit):
        return calculate_completion_rate(habit, self._logs(habit), 90)

    def get_completion_rate_all(self, habit):
        return calculate_completion_rate(habit, self._logs(habit), None)

    def get_is_completed_today(self, habit):
        return date.today() in self._logs(habit)
