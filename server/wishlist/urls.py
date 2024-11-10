from django.urls import path, include
from .views import WishlistApiView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'wishlist', WishlistApiView, 'wishlist')

urlpatterns = [
    path('', include(router.urls)),
]