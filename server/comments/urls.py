from django.urls import path, include
from .views import CommentApiView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'comments', CommentApiView, 'comments')

urlpatterns = [
    path('', include(router.urls)),
    path('comments/collection/<int:collection_id>/', CommentApiView.as_view({'get': 'get_comments_by_collection'})),
]