from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *
urlpatterns = [
    path('login/',UserLoginAPIView.as_view(), name='api_login'),
    path('register/', UserRegistrationAPIView.as_view(), name='api_register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('user/', UserInfoAPIView.as_view(), name='info_user'),
    path('logout/', UserLogoutAPIView.as_view(), name='api_logout')
]
