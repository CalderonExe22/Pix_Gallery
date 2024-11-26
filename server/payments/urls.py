from django.urls import path, include
from .views import create_preference, PaymentApiView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'success', PaymentApiView, 'success')

urlpatterns = [
    path('create_preference/', create_preference, name='create_preference'),
    path('', include(router.urls)),
]