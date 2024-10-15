from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PhotographyAPIView, CategoryAPIView, CategoryPhotographyAPIView

router = DefaultRouter()
router.register(r'photography',PhotographyAPIView,'photography')
router.register(r'category',CategoryAPIView,'category')
router.register(r'category-photography',CategoryPhotographyAPIView,'category-photography')

urlpatterns = [
    path('', include(router.urls)),
]
