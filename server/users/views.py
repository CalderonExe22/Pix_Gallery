from django.shortcuts import render
from .serializer import *
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class UserRegistrationAPIView(GenericAPIView): 
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializar
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)
        data = serializer.data
        data['tokens'] = {
            'refresh' : str(token),
            'access' : str(token.access_token)
        }
        return Response(data, status=status.HTTP_201_CREATED)
    
class UserLoginAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        serializer = UserSerializer(user)
        token = RefreshToken.for_user(user)
        data = serializer.data
        data['tokens'] = {
            'refresh' : str(token),
            'access' : str(token.access_token)
        }
        return Response(data, status=status.HTTP_200_OK)
    
class UserLogoutAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request, *args, **kwargs):
        try:
            token_refresh = request.data['refresh']
            token = RefreshToken(token_refresh)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class UserInfoAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user