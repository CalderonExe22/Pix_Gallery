from django.shortcuts import render
from .serializer import *
from .models import *
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class UserStatisticsAPIView(ModelViewSet):
    serializer_class = StatisticsSerializar
    queryset = Statistics.objects.all()
    
    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def get_user_statistics(self,request, user_id=None):
        try:
            user_statistics = Statistics.objects.get(user=user_id)
        except Statistics.DoesNotExist:
            return Response({"detail": "Estadísticas no encontradas para este usuario."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(user_statistics)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
