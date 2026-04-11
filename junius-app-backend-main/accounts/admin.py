from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser,
    UserCertificate,
    UserLanguage,
    UserEducation,
    UserNotesForHR,
)


class EmailUserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password', 'profile_picture', 'cv_link')}),
        (_('Personal info'), {
         'fields': ('first_name', 'last_name', 'phone_number', 'type_of_user')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'type_of_user')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)


admin.site.register(CustomUser, EmailUserAdmin)
admin.site.register(UserCertificate)
admin.site.register(UserLanguage)
admin.site.register(UserEducation)
admin.site.register(UserNotesForHR)
