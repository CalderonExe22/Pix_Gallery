from django.urls import path
from .views import create_preference

urlpatterns = [
    path('create_preference/', create_preference, name='create_preference')
]