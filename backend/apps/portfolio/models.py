from django.db import models
from django.conf import settings


class AssetClass(models.Model):
    name = models.CharField(max_length=100)
    key = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7)

    def __str__(self):
        return self.name


class Asset(models.Model):
    DATA_SOURCES = [
        ('bigpara', 'Bigpara'),
        ('tefas', 'TEFAS'),
        ('coingecko', 'CoinGecko'),
        ('tcmb', 'TCMB'),
        ('collectapi', 'CollectAPI'),
        ('manual', 'Manuel'),
    ]

    name = models.CharField(max_length=200)
    symbol = models.CharField(max_length=50)
    asset_class = models.ForeignKey(AssetClass, on_delete=models.PROTECT)
    data_source = models.CharField(max_length=20, choices=DATA_SOURCES, default='manual')
    source_identifier = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.symbol} — {self.name}"


class PortfolioEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=20, decimal_places=8)
    purchase_price = models.DecimalField(max_digits=16, decimal_places=4)
    current_price = models.DecimalField(max_digits=16, decimal_places=4, null=True, blank=True)
    purchase_date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-purchase_date']

    def __str__(self):
        return f"{self.asset.symbol} x{self.quantity}"


class PriceSnapshot(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='price_snapshots')
    price = models.DecimalField(max_digits=16, decimal_places=4)
    currency = models.CharField(max_length=3, default='TRY')
    fetched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fetched_at']

    def __str__(self):
        return f"{self.asset.symbol}: {self.price} {self.currency}"


class TargetAllocation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    asset_class = models.ForeignKey(AssetClass, on_delete=models.CASCADE)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        unique_together = ('user', 'asset_class')

    def __str__(self):
        return f"{self.user} — {self.asset_class.name}: {self.percentage}%"
