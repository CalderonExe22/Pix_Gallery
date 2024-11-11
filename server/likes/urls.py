from django.urls import path, include
from .views import LikeApiView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'likes', LikeApiView, 'likes')

urlpatterns = [
    path('', include(router.urls)),
]