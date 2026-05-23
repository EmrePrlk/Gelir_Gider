from django.db import models
from django.conf import settings


class Category(models.Model):
    TYPES = [('income', 'Gelir'), ('expense', 'Gider')]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPES)
    color = models.CharField(max_length=7)
    icon = models.CharField(max_length=50)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Transaction(models.Model):
    TYPES = [('income', 'Gelir'), ('expense', 'Gider')]
    SOURCES = [('manual', 'Manuel'), ('import', 'İçe Aktarma')]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=500)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.CharField(max_length=10, choices=TYPES)
    source = models.CharField(max_length=10, choices=SOURCES, default='manual')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.date} — {self.description} ({self.amount})"


class UserExcelSchema(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    column_date = models.CharField(max_length=100)
    column_amount = models.CharField(max_length=100)
    column_description = models.CharField(max_length=100)
    column_category = models.CharField(max_length=100, blank=True)
    date_format = models.CharField(max_length=50)
    amount_decimal_separator = models.CharField(max_length=1, default='.')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Excel Schema — {self.user.email}"
