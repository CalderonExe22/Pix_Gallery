from django.contrib import admin
from .models import Photography, Category, CategoryPhotography
# Register your models here.

admin.site.register(Photography)
admin.site.register(Category)
admin.site.register(CategoryPhotography)