from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'photography',PhotographyAPIView,'photography')
router.register(r'collections',CollectionsAPIView,'collections')
urlpatterns = [
    path('', include(router.urls)),
]
