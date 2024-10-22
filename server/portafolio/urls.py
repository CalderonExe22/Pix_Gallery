from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'portafolios', PortafolioAPIView,'portafolios')

urlpatterns = [
    path('',include(router.urls)),
]
