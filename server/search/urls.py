from django.urls import path
from .views import SearchAPIView
urlpatterns = [
    path('global-search/',SearchAPIView.as_view(),name='search_api')
]
