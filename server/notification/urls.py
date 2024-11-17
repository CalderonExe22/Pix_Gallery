from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationAPIView

router = DefaultRouter()
router.register(f'notifications',NotificationAPIView, basename='notifications')

urlpatterns = [
    path('', include(router.urls))
]
