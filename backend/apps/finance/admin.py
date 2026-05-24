from django.contrib import admin
from .models import Category, Transaction, UserExcelSchema


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'type', 'color', 'icon']
    list_filter = ['type']
    search_fields = ['name', 'user__email']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['date', 'description', 'amount', 'type', 'category', 'source', 'user']
    list_filter = ['type', 'source']
    search_fields = ['description', 'user__email']
    date_hierarchy = 'date'


@admin.register(UserExcelSchema)
class UserExcelSchemaAdmin(admin.ModelAdmin):
    list_display = ['user', 'column_date', 'column_amount', 'updated_at']
