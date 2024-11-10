from django.urls import path, include
from .views import CommentApiView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'comments', CommentApiView, 'comments')

urlpatterns = [
    path('', include(router.urls)),
]