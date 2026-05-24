from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.core.urls')),
    path('api/v1/finance/', include('apps.finance.urls')),
    path('api/v1/habits/', include('apps.habits.urls')),
    path('api/v1/tasks/', include('apps.tasks.urls')),
    path('api/v1/portfolio/', include('apps.portfolio.urls')),
]
