from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AssetClass',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('key', models.CharField(max_length=50, unique=True)),
                ('color', models.CharField(max_length=7)),
            ],
        ),
        migrations.CreateModel(
            name='Asset',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('symbol', models.CharField(max_length=50)),
                ('data_source', models.CharField(
                    choices=[
                        ('bigpara', 'Bigpara'),
                        ('tefas', 'TEFAS'),
                        ('coingecko', 'CoinGecko'),
                        ('tcmb', 'TCMB'),
                        ('collectapi', 'CollectAPI'),
                        ('manual', 'Manuel'),
                    ],
                    default='manual',
                    max_length=20,
                )),
                ('source_identifier', models.CharField(blank=True, max_length=200)),
                ('asset_class', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='portfolio.assetclass')),
            ],
        ),
        migrations.CreateModel(
            name='PortfolioEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('quantity', models.DecimalField(decimal_places=8, max_digits=20)),
                ('purchase_price', models.DecimalField(decimal_places=4, max_digits=16)),
                ('current_price', models.DecimalField(decimal_places=4, max_digits=16, null=True, blank=True)),
                ('purchase_date', models.DateField()),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('asset', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='portfolio.asset')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={'ordering': ['-purchase_date']},
        ),
        migrations.CreateModel(
            name='PriceSnapshot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('price', models.DecimalField(decimal_places=4, max_digits=16)),
                ('currency', models.CharField(default='TRY', max_length=3)),
                ('fetched_at', models.DateTimeField(auto_now_add=True)),
                ('asset', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='price_snapshots', to='portfolio.asset')),
            ],
            options={'ordering': ['-fetched_at']},
        ),
        migrations.CreateModel(
            name='TargetAllocation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('percentage', models.DecimalField(decimal_places=2, max_digits=5)),
                ('asset_class', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='portfolio.assetclass')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={'unique_together': {('user', 'asset_class')}},
        ),
    ]
