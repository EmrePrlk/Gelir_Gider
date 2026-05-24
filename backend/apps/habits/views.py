from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.http import HttpResponse
from datetime import date, timedelta
from io import BytesIO
import openpyxl

from .models import Habit, HabitLog
from .serializers import HabitSerializer, HabitLogSerializer, is_scheduled


class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Habit.objects.filter(user=self.request.user, is_active=True)
            .prefetch_related('logs')
            .order_by('created_at')
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

    @action(detail=False, methods=['get'])
    def today(self, request):
        today = date.today()
        habits = self.get_queryset()
        today_habits = [h for h in habits if is_scheduled(h, today)]
        serializer = self.get_serializer(today_habits, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def export_excel(self, request):
        habits = list(Habit.objects.filter(user=request.user, is_active=True).order_by('created_at'))
        logs = (
            HabitLog.objects.filter(habit__user=request.user)
            .select_related('habit')
            .order_by('date')
        )

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = 'Alışkanlık Logları'
        ws.append(['Tarih'] + [h.name for h in habits])

        date_map: dict = {}
        for log in logs:
            date_map.setdefault(log.date, {})[log.habit_id] = log.completed

        for d in sorted(date_map.keys()):
            row = [str(d)] + ['✓' if date_map[d].get(h.id) else '' for h in habits]
            ws.append(row)

        buf = BytesIO()
        wb.save(buf)
        buf.seek(0)

        res = HttpResponse(
            buf.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        )
        res['Content-Disposition'] = 'attachment; filename="aliskanliklar.xlsx"'
        return res


class HabitLogViewSet(viewsets.ModelViewSet):
    serializer_class = HabitLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = HabitLog.objects.filter(habit__user=self.request.user).select_related('habit')
        habit_id = self.request.query_params.get('habit')
        if habit_id:
            qs = qs.filter(habit_id=habit_id)
        return qs

    def perform_create(self, serializer):
        habit = serializer.validated_data['habit']
        if habit.user != self.request.user:
            raise PermissionError('Not your habit')
        serializer.save()

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        habit_id = request.data.get('habit')
        log_date = request.data.get('date', str(date.today()))

        try:
            habit = Habit.objects.get(id=habit_id, user=request.user)
        except Habit.DoesNotExist:
            return Response({'detail': 'Alışkanlık bulunamadı'}, status=404)

        log, created = HabitLog.objects.get_or_create(
            habit=habit,
            date=log_date,
            defaults={'completed': True},
        )

        if not created:
            if log.completed:
                log.delete()
                return Response({'completed': False, 'action': 'uncompleted'})
            log.completed = True
            log.save()
            return Response({'completed': True, 'action': 'completed'})

        return Response({'completed': True, 'action': 'completed'}, status=201)

    @action(detail=False, methods=['get'])
    def heatmap(self, request):
        today = date.today()
        start = today - timedelta(days=364)

        data = (
            HabitLog.objects.filter(
                habit__user=request.user,
                completed=True,
                date__gte=start,
                date__lte=today,
            )
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        return Response([
            {'date': str(item['date']), 'count': item['count']}
            for item in data
        ])
