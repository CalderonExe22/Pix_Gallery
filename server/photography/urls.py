from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PhotographyAPIView

router = DefaultRouter()
router.register(r'photography',PhotographyAPIView,'photography')

urlpatterns = [
    path('', include(router.urls)),
]
