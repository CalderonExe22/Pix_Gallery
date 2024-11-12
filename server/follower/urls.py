from rest_framework.routers import DefaultRouter
from .views import FollowerAPIView
from django.urls import path, include

router = DefaultRouter()
router.register(r'followers', FollowerAPIView, basename='followers')
urlpatterns = [
    path('', include(router.urls)),
]
