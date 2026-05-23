from rest_framework import serializers
from .models import Category, Transaction, UserExcelSchema


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'type', 'color', 'icon']
        read_only_fields = ['id']


class TransactionSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source='category', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'date', 'amount', 'description', 'type', 'source',
            'notes', 'created_at', 'category', 'category_detail',
        ]
        read_only_fields = ['id', 'created_at']


class UserExcelSchemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExcelSchema
        fields = [
            'column_date', 'column_amount', 'column_description',
            'column_category', 'date_format', 'amount_decimal_separator', 'updated_at',
        ]
        read_only_fields = ['updated_at']


class MonthlySummarySerializer(serializers.Serializer):
    month = serializers.CharField()
    income = serializers.DecimalField(max_digits=14, decimal_places=2)
    expense = serializers.DecimalField(max_digits=14, decimal_places=2)


class SummarySerializer(serializers.Serializer):
    income = serializers.DecimalField(max_digits=14, decimal_places=2)
    expense = serializers.DecimalField(max_digits=14, decimal_places=2)
    net = serializers.DecimalField(max_digits=14, decimal_places=2)
    monthly_trend = MonthlySummarySerializer(many=True)


class CategoryBreakdownItemSerializer(serializers.Serializer):
    category_id = serializers.IntegerField(allow_null=True)
    category_name = serializers.CharField()
    category_color = serializers.CharField()
    category_icon = serializers.CharField()
    total = serializers.DecimalField(max_digits=14, decimal_places=2)
    percentage = serializers.FloatField()


class ImportPreviewRowSerializer(serializers.Serializer):
    date = serializers.CharField()
    amount = serializers.FloatField()
    description = serializers.CharField()
    category = serializers.CharField(allow_blank=True, default='')
    type = serializers.ChoiceField(choices=['income', 'expense'])
