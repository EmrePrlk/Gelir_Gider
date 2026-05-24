from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AssetClassListView, AssetListView,
    PortfolioEntryViewSet,
    SummaryView, DistributionView, TargetAllocationView,
)

router = DefaultRouter()
router.register('entries', PortfolioEntryViewSet, basename='entry')

urlpatterns = [
    path('', include(router.urls)),
    path('asset-classes/', AssetClassListView.as_view()),
    path('assets/', AssetListView.as_view()),
    path('summary/', SummaryView.as_view()),
    path('distribution/', DistributionView.as_view()),
    path('target/', TargetAllocationView.as_view()),
]
