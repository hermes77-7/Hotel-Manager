from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Add the role and phone fields to the admin interface
    fieldsets = UserAdmin.fieldsets + (
        ('Hotel Role', {
            'fields': ('role', 'phone')
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Hotel Role', {
            'fields': ('role', 'phone')
        }),
    )
    list_display  = ['username', 'email', 'role', 'is_active', 'is_staff']
    list_filter   = ['role', 'is_active', 'is_staff']
