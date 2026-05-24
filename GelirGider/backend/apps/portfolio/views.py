from decimal import Decimal
from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import AssetClass, Asset, PortfolioEntry, TargetAllocation
from .serializers import (
    AssetClassSerializer, AssetSerializer,
    PortfolioEntrySerializer, TargetAllocationSerializer,
)


class AssetClassListView(generics.ListAPIView):
    queryset = AssetClass.objects.all()
    serializer_class = AssetClassSerializer
    permission_classes = [IsAuthenticated]


class AssetListView(generics.ListCreateAPIView):
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Asset.objects.select_related('asset_class').all()
        asset_class = self.request.query_params.get('asset_class')
        if asset_class:
            qs = qs.filter(asset_class__key=asset_class)
        return qs


class PortfolioEntryViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PortfolioEntry.objects.filter(user=self.request.user).select_related(
            'asset__asset_class'
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        entries = PortfolioEntry.objects.filter(user=request.user).select_related('asset__asset_class')
        total_value = Decimal('0')
        total_cost = Decimal('0')

        for e in entries:
            effective = e.current_price if e.current_price is not None else e.purchase_price
            total_value += e.quantity * effective
            total_cost += e.quantity * e.purchase_price

        pnl = total_value - total_cost
        pnl_pct = round(float(pnl / total_cost * 100), 2) if total_cost else 0.0

        return Response({
            'total_value': float(total_value),
            'total_cost': float(total_cost),
            'pnl': float(pnl),
            'pnl_pct': pnl_pct,
            'entry_count': entries.count(),
        })


class DistributionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        entries = PortfolioEntry.objects.filter(user=request.user).select_related('asset__asset_class')

        buckets: dict[int, dict] = {}
        for e in entries:
            effective = e.current_price if e.current_price is not None else e.purchase_price
            value = float(e.quantity * effective)
            ac = e.asset.asset_class
            if ac.id not in buckets:
                buckets[ac.id] = {
                    'asset_class_id': ac.id,
                    'asset_class_name': ac.name,
                    'asset_class_color': ac.color,
                    'total_value': 0.0,
                }
            buckets[ac.id]['total_value'] += value

        total = sum(b['total_value'] for b in buckets.values())
        result = []
        for b in sorted(buckets.values(), key=lambda x: -x['total_value']):
            b['percentage'] = round(b['total_value'] / total * 100, 1) if total else 0.0
            result.append(b)

        return Response(result)


class TargetAllocationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = TargetAllocation.objects.filter(user=request.user).select_related('asset_class')
        return Response(TargetAllocationSerializer(qs, many=True).data)

    def post(self, request):
        allocations = request.data.get('allocations', [])
        TargetAllocation.objects.filter(user=request.user).delete()
        created = []
        for item in allocations:
            ac_id = item.get('asset_class_id')
            pct = item.get('percentage', 0)
            if ac_id and float(pct) > 0:
                obj = TargetAllocation.objects.create(
                    user=request.user,
                    asset_class_id=ac_id,
                    percentage=pct,
                )
                created.append(obj)
        qs = TargetAllocation.objects.filter(user=request.user).select_related('asset_class')
        return Response(TargetAllocationSerializer(qs, many=True).data, status=status.HTTP_201_CREATED)
