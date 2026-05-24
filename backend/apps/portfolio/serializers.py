from decimal import Decimal
from rest_framework import serializers
from .models import AssetClass, Asset, PortfolioEntry, TargetAllocation


class AssetClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetClass
        fields = ['id', 'name', 'key', 'color']


class AssetSerializer(serializers.ModelSerializer):
    asset_class = AssetClassSerializer(read_only=True)
    asset_class_id = serializers.PrimaryKeyRelatedField(
        queryset=AssetClass.objects.all(), source='asset_class', write_only=True
    )

    class Meta:
        model = Asset
        fields = ['id', 'name', 'symbol', 'asset_class', 'asset_class_id', 'data_source']


class PortfolioEntrySerializer(serializers.ModelSerializer):
    asset = AssetSerializer(read_only=True)
    asset_id = serializers.PrimaryKeyRelatedField(
        queryset=Asset.objects.all(), source='asset', write_only=True, required=False
    )
    # Fields for creating a new asset inline
    asset_name = serializers.CharField(write_only=True, required=False)
    asset_symbol = serializers.CharField(write_only=True, required=False)
    asset_class_id = serializers.PrimaryKeyRelatedField(
        queryset=AssetClass.objects.all(), write_only=True, required=False
    )

    value = serializers.SerializerMethodField()
    cost = serializers.SerializerMethodField()
    pnl = serializers.SerializerMethodField()
    pnl_pct = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioEntry
        fields = [
            'id', 'asset', 'asset_id', 'asset_name', 'asset_symbol', 'asset_class_id',
            'quantity', 'purchase_price', 'current_price', 'purchase_date',
            'notes', 'created_at', 'value', 'cost', 'pnl', 'pnl_pct',
        ]
        read_only_fields = ['created_at']

    def _effective_price(self, entry: PortfolioEntry) -> Decimal:
        return entry.current_price if entry.current_price is not None else entry.purchase_price

    def get_value(self, entry):
        return float(entry.quantity * self._effective_price(entry))

    def get_cost(self, entry):
        return float(entry.quantity * entry.purchase_price)

    def get_pnl(self, entry):
        return self.get_value(entry) - self.get_cost(entry)

    def get_pnl_pct(self, entry):
        cost = self.get_cost(entry)
        if cost == 0:
            return 0.0
        return round(self.get_pnl(entry) / cost * 100, 2)

    def create(self, validated_data):
        asset_name = validated_data.pop('asset_name', None)
        asset_symbol = validated_data.pop('asset_symbol', None)
        asset_class = validated_data.pop('asset_class_id', None)

        if 'asset' not in validated_data:
            if not (asset_name and asset_symbol and asset_class):
                raise serializers.ValidationError('asset_id or (asset_name, asset_symbol, asset_class_id) required')
            asset, _ = Asset.objects.get_or_create(
                symbol=asset_symbol.upper(),
                asset_class=asset_class,
                defaults={'name': asset_name, 'data_source': 'manual'},
            )
            validated_data['asset'] = asset

        return super().create(validated_data)


class TargetAllocationSerializer(serializers.ModelSerializer):
    asset_class = AssetClassSerializer(read_only=True)
    asset_class_id = serializers.PrimaryKeyRelatedField(
        queryset=AssetClass.objects.all(), source='asset_class', write_only=True
    )

    class Meta:
        model = TargetAllocation
        fields = ['id', 'asset_class', 'asset_class_id', 'percentage']
