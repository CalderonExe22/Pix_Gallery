from django.shortcuts import render
from .models import *
from .serializer import *
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class PortafolioAPIView(ModelViewSet):
    queryset = Portafolio.objects.all()
    serializer_class = PortafolioSerializer
    permission_classes = (IsAuthenticated,)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        return Response(status=status.HTTP_200_OK)