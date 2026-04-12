from accounts.models import CustomUser
u = CustomUser.objects.filter(is_superuser=True).first()
u.status = 'active'
u.save()
print('Done:', u.email, u.status)
