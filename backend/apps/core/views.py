from datetime import date
from decimal import Decimal

from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status

from .serializers import CustomTokenObtainPairSerializer, UserSerializer
from .models import WeeklyInsight
from apps.finance.models import Transaction
from apps.tasks.models import Task
from apps.habits.models import Habit, HabitLog
from apps.habits.serializers import is_scheduled, calculate_current_streak
from apps.portfolio.models import PortfolioEntry


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        user = request.user
        for field in ('username', 'first_name', 'last_name'):
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save()
        return Response(UserSerializer(user).data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current = request.data.get('current_password', '')
        new_password = request.data.get('new_password', '')

        if not request.user.check_password(current):
            return Response({'detail': 'Mevcut şifre yanlış.'}, status=status.HTTP_400_BAD_REQUEST)
        if len(new_password) < 8:
            return Response({'detail': 'Yeni şifre en az 8 karakter olmalı.'}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new_password)
        request.user.save()
        return Response({'detail': 'Şifre başarıyla değiştirildi.'})


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today()

        # ── Finance: current month ──────────────────────────────────────
        month_start = today.replace(day=1)
        income = Transaction.objects.filter(
            user=user, type='income', date__gte=month_start,
        ).aggregate(s=Sum('amount'))['s'] or Decimal('0')
        expense = Transaction.objects.filter(
            user=user, type='expense', date__gte=month_start,
        ).aggregate(s=Sum('amount'))['s'] or Decimal('0')
        month_net = float(income) - float(expense)

        # ── Finance: 12-month trend — single query, correct month arithmetic ──
        start_month = today.month - 11
        start_year = today.year
        while start_month <= 0:
            start_month += 12
            start_year -= 1
        trend_start = date(start_year, start_month, 1)

        monthly_agg = (
            Transaction.objects
            .filter(user=user, date__gte=trend_start)
            .values('date__year', 'date__month', 'type')
            .annotate(total=Sum('amount'))
        )
        monthly_lookup: dict = {}
        for row in monthly_agg:
            key = (row['date__year'], row['date__month'])
            if key not in monthly_lookup:
                monthly_lookup[key] = {'income': Decimal('0'), 'expense': Decimal('0')}
            if row['type'] in ('income', 'expense'):
                monthly_lookup[key][row['type']] = row['total']

        trend_months = []
        for i in range(11, -1, -1):
            month = today.month - i
            year = today.year
            while month <= 0:
                month += 12
                year -= 1
            data = monthly_lookup.get((year, month), {})
            trend_months.append({
                'month': f"{year}-{month:02d}",
                'income': float(data.get('income', Decimal('0'))),
                'expense': float(data.get('expense', Decimal('0'))),
            })

        # ── Tasks: today ────────────────────────────────────────────────
        today_tasks_qs = Task.objects.filter(
            user=user, due_date=today,
        ).exclude(status='cancelled')
        t_completed = today_tasks_qs.filter(status='done').count()
        t_total = today_tasks_qs.count()
        today_tasks_list = [
            {'id': t.id, 'title': t.title, 'priority': t.priority, 'status': t.status}
            for t in today_tasks_qs.order_by('-created_at')
        ]

        # ── Habits: today + streaks ─────────────────────────────────────
        habits = Habit.objects.filter(user=user, is_active=True).prefetch_related('logs')
        today_habits = []
        best_streak = 0

        for h in habits:
            logs_set = {log.date for log in h.logs.all() if log.completed}
            streak = calculate_current_streak(h, logs_set, today)
            best_streak = max(best_streak, streak)
            if is_scheduled(h, today):
                today_habits.append({
                    'id': h.id,
                    'name': h.name,
                    'color': h.color,
                    'icon': h.icon,
                    'completed': today in logs_set,
                    'streak': streak,
                })

        # ── Portfolio: net worth + distribution + top 3 ─────────────────
        entries = PortfolioEntry.objects.filter(user=user).select_related('asset__asset_class')
        net_worth = 0.0
        buckets: dict = {}
        entry_rows = []

        for e in entries:
            effective = e.current_price if e.current_price is not None else e.purchase_price
            value = float(e.quantity * effective)
            cost = float(e.quantity * e.purchase_price)
            pnl_pct = round((value - cost) / cost * 100, 2) if cost > 0 else 0.0
            net_worth += value
            ac = e.asset.asset_class
            if ac.id not in buckets:
                buckets[ac.id] = {'name': ac.name, 'color': ac.color, 'value': 0.0}
            buckets[ac.id]['value'] += value
            entry_rows.append({'symbol': e.asset.symbol, 'name': e.asset.name, 'value': value, 'pnl_pct': pnl_pct})

        portfolio_distribution = []
        for b in sorted(buckets.values(), key=lambda x: -x['value']):
            b['percentage'] = round(b['value'] / net_worth * 100, 1) if net_worth else 0.0
            portfolio_distribution.append(b)

        top_portfolio = sorted(entry_rows, key=lambda x: -x['value'])[:3]

        return Response({
            'net_worth': net_worth,
            'month_net': month_net,
            'today_tasks': {'completed': t_completed, 'total': t_total},
            'best_streak': best_streak,
            'finance_trend': trend_months,
            'portfolio_distribution': portfolio_distribution,
            'today_habits': today_habits,
            'today_tasks_list': today_tasks_list,
            'top_portfolio': top_portfolio,
        })


class WeeklyInsightView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        insight = WeeklyInsight.objects.filter(user=request.user).first()
        if not insight:
            return Response({'detail': 'Henüz içgörü oluşturulmadı.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'id': insight.id,
            'week_start': insight.week_start,
            'content': insight.content,
            'generated_at': insight.generated_at,
        })

    def post(self, request):
        from .insight import generate_insight_for_user
        generate_insight_for_user(request.user)
        insight = WeeklyInsight.objects.filter(user=request.user).first()
        return Response({
            'id': insight.id,
            'week_start': insight.week_start,
            'content': insight.content,
            'generated_at': insight.generated_at,
        })


class PushSubscribeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.conf import settings as django_settings
        return Response({'vapid_public_key': django_settings.VAPID_PUBLIC_KEY})

    def post(self, request):
        from .models import PushSubscription
        endpoint = request.data.get('endpoint')
        p256dh = request.data.get('p256dh')
        auth = request.data.get('auth')
        if not endpoint or not p256dh or not auth:
            return Response({'detail': 'endpoint, p256dh ve auth zorunlu.'}, status=status.HTTP_400_BAD_REQUEST)
        PushSubscription.objects.update_or_create(
            user=request.user,
            defaults={'endpoint': endpoint, 'p256dh': p256dh, 'auth': auth},
        )
        return Response({'detail': 'Subscription kaydedildi.'}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        from .models import PushSubscription
        PushSubscription.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
