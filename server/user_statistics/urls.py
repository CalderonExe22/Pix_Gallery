from django.urls import path, include
from .views import UserStatisticsAPIView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'statistics', UserStatisticsAPIView, 'statistics')

urlpatterns = [
    path('', include(router.urls)),
]