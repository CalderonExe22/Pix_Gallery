from django.urls import path
from .views import *

urlpatterns = [
    path('tags/', ImaggaTagsAPIView.as_view(), name='imagga_tags'),
    path('moderation/', ImaggaModerationAPIView.as_view(), name='imagga_moderation'),
]