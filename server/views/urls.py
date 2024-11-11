from django.urls import path, include
from .views import ViewApiView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'views', ViewApiView, 'views')

urlpatterns = [
    path('', include(router.urls)),
]