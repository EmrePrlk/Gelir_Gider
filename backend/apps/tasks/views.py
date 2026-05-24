from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import date, timedelta

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Task.objects.filter(user=self.request.user)

        status_param = self.request.query_params.get('status')
        priority_param = self.request.query_params.get('priority')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        search = self.request.query_params.get('search')

        if status_param:
            qs = qs.filter(status=status_param)
        if priority_param:
            qs = qs.filter(priority=priority_param)
        if date_from:
            qs = qs.filter(due_date__gte=date_from)
        if date_to:
            qs = qs.filter(due_date__lte=date_to)
        if search:
            qs = qs.filter(title__icontains=search)

        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        new_status = self.request.data.get('status')
        if new_status == 'done' and instance.status != 'done':
            serializer.save(completed_at=timezone.now())
        elif new_status and new_status != 'done' and instance.status == 'done':
            serializer.save(completed_at=None)
        else:
            serializer.save()

    @action(detail=False, methods=['get'])
    def today(self, request):
        today = date.today()
        tasks = (
            Task.objects.filter(user=request.user, due_date=today)
            .exclude(status='cancelled')
            .order_by('priority', 'created_at')
        )
        return Response(TaskSerializer(tasks, many=True).data)

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        today = date.today()
        tasks = (
            Task.objects.filter(user=request.user, due_date__lt=today)
            .exclude(status__in=['done', 'cancelled'])
            .order_by('due_date', 'priority')
        )
        return Response(TaskSerializer(tasks, many=True).data)

    @action(detail=False, methods=['get'])
    def weekly(self, request):
        today = date.today()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)

        tasks = (
            Task.objects.filter(user=request.user, due_date__range=[week_start, week_end])
            .exclude(status='cancelled')
            .order_by('due_date', 'priority', 'created_at')
        )

        result = {str(week_start + timedelta(days=i)): [] for i in range(7)}
        for task in tasks:
            key = str(task.due_date)
            if key in result:
                result[key].append(TaskSerializer(task).data)

        return Response(result)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        task = self.get_object()
        if task.status == 'done':
            task.status = 'todo'
            task.completed_at = None
        else:
            task.status = 'done'
            task.completed_at = timezone.now()
        task.save()
        return Response(TaskSerializer(task).data)
