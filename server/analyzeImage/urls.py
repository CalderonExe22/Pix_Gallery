from .views import ImageQualityCheck
from django.urls import path

urlpatterns = [
    path('image-quality-check/', ImageQualityCheck.as_view(), name='image-quality-check'),
]