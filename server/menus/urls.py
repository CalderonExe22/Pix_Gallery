from django.urls import path
from .views import *

urlpatterns = [
    path('public-menu/', PublicMenuAPIView.as_view(), name='public-menu'),
    path('authenticated-menu/', AuthenticatedMenuAPIView.as_view(), name='authenticated-menu')
]
