from django.contrib import admin
from .models import (
    Role,
    Title,
    Skill,
    UserProfileType,
    ProjectMapsJuniflow,
    UserMapsJuniflow,
    ProjectPartner,
    UserRole,
    Menu,
    MenuRole,
    Language,
)

# Register your models here.
admin.site.register(Role)
admin.site.register(Title)
admin.site.register(Skill)
admin.site.register(UserProfileType)
admin.site.register(ProjectMapsJuniflow)
admin.site.register(UserMapsJuniflow)
admin.site.register(ProjectPartner)
admin.site.register(UserRole)
admin.site.register(Menu)
admin.site.register(MenuRole)
admin.site.register(Language)