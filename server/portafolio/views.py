from django.shortcuts import render
from .models import *
from .serializer import *
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
# Create your views here.

class PortafolioAPIView(ModelViewSet):
    queryset = Portafolio.objects.all()
    serializer_class = PortafolioSerializer
    permission_classes = (IsAuthenticated,)
    def get_queryset(self):
        # Filtramos el portafolio para que solo el usuario autenticado vea su propio portafolio
        return Portafolio.objects.filter(user=self.request.user)