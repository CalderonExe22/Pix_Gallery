from django.contrib import admin
from .models import User, Profile, Rol, RolUser
from .forms import CustomUserChangeForm, CustomUserCreationForm
from django.contrib.auth.admin import UserAdmin
# Register your models here.

@admin.register(User)
class CustomAdminUser(UserAdmin):
    add_form = CustomUserChangeForm
    form = CustomUserChangeForm
    model = User

admin.site.register(Profile)
admin.site.register(Rol)
admin.site.register(RolUser)