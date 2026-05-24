from django.contrib import admin
from .models import AssetClass, Asset, PortfolioEntry, PriceSnapshot, TargetAllocation


@admin.register(AssetClass)
class AssetClassAdmin(admin.ModelAdmin):
    list_display = ['name', 'key', 'color']


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ['symbol', 'name', 'asset_class', 'data_source']
    list_filter = ['asset_class', 'data_source']
    search_fields = ['symbol', 'name']


@admin.register(PortfolioEntry)
class PortfolioEntryAdmin(admin.ModelAdmin):
    list_display = ['user', 'asset', 'quantity', 'purchase_price', 'current_price', 'purchase_date']
    list_filter = ['asset__asset_class']
    raw_id_fields = ['user', 'asset']


@admin.register(PriceSnapshot)
class PriceSnapshotAdmin(admin.ModelAdmin):
    list_display = ['asset', 'price', 'currency', 'fetched_at']


@admin.register(TargetAllocation)
class TargetAllocationAdmin(admin.ModelAdmin):
    list_display = ['user', 'asset_class', 'percentage']
