from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HabitViewSet, HabitLogViewSet

router = DefaultRouter()
router.register('habits', HabitViewSet, basename='habit')
router.register('logs', HabitLogViewSet, basename='habit-log')

urlpatterns = [
    path('', include(router.urls)),
]
