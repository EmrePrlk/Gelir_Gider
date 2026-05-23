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
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('type', models.CharField(choices=[('income', 'Gelir'), ('expense', 'Gider')], max_length=10)),
                ('color', models.CharField(max_length=7)),
                ('icon', models.CharField(max_length=50)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={'verbose_name_plural': 'Categories'},
        ),
        migrations.CreateModel(
            name='UserExcelSchema',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('column_date', models.CharField(max_length=100)),
                ('column_amount', models.CharField(max_length=100)),
                ('column_description', models.CharField(max_length=100)),
                ('column_category', models.CharField(blank=True, max_length=100)),
                ('date_format', models.CharField(max_length=50)),
                ('amount_decimal_separator', models.CharField(default='.', max_length=1)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('amount', models.DecimalField(decimal_places=2, max_digits=12)),
                ('description', models.CharField(max_length=500)),
                ('type', models.CharField(choices=[('income', 'Gelir'), ('expense', 'Gider')], max_length=10)),
                ('source', models.CharField(choices=[('manual', 'Manuel'), ('import', 'İçe Aktarma')], default='manual', max_length=10)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='finance.category')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={'ordering': ['-date', '-created_at']},
        ),
    ]
