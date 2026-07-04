from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView, MeView, ChangePasswordView,
    DashboardSummaryView, WeeklyInsightView, PushSubscribeView,
)

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard_summary'),
    path('dashboard/weekly-insight/', WeeklyInsightView.as_view(), name='weekly_insight'),
    path('push/subscribe/', PushSubscribeView.as_view(), name='push_subscribe'),
]
