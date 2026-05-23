from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, TransactionViewSet,
    SummaryView, CategoryBreakdownView,
    ExcelSchemaView, ImportView, ImportConfirmView, ExportView,
)

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
    path('summary/', SummaryView.as_view(), name='finance-summary'),
    path('breakdown/', CategoryBreakdownView.as_view(), name='finance-breakdown'),
    path('excel-schema/', ExcelSchemaView.as_view(), name='excel-schema'),
    path('import/', ImportView.as_view(), name='finance-import'),
    path('import/confirm/', ImportConfirmView.as_view(), name='finance-import-confirm'),
    path('export/', ExportView.as_view(), name='finance-export'),
]
