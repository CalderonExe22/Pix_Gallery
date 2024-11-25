from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Photography)
admin.site.register(Category)
admin.site.register(CategoryPhotography)
admin.site.register(Collection)
admin.site.register(CollectionPhotography)
admin.site.register(Tag)
admin.site.register(PhotographyTag)
admin.site.register(ExifData)
admin.site.register(CategoryCollection)
