from django.urls import path
from . import views

urlpatterns = [
    path('', views.lists_countries, name='lists_countries'),
]
