from django.shortcuts import render
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from users.models import User
from .models import Follower
from .serializer import FollowerSerializer
from user_statistics.models import Statistics
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class FollowerAPIView(ModelViewSet):
    queryset = Follower.objects.all()
    serializer_class = FollowerSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], url_path='check/(?P<followed_id>[^/.]+)')
    def check_follow_status(self, request, followed_id=None):
        user = request.user
        try:
            followed_user = User.objects.get(id=followed_id)
        except User.DoesNotExist:
            return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        is_following = Follower.objects.filter(follower=user, followed=followed_user).exists()
        
        return Response({"isFollowing": is_following}, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        follower = request.user
        followed_id = request.data.get('followed')
        if not followed_id:
            return Response({"detail": "Debe especificar el ID del usuario a seguir."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            followed = User.objects.get(id=followed_id)
        except User.DoesNotExist:
            return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        if Follower.objects.filter(follower = follower, followed = followed).exists():
            return Response({"detail": "Ya sigues a este usuario."}, status=status.HTTP_400_BAD_REQUEST)
        
        follower_instance = Follower.objects.create(follower=follower, followed=followed)
        self.update_statistics(follower, followed)
        serializer = self.get_serializer(follower_instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):
        follower = request.user
        followed_id = self.kwargs.get('pk')

        try:
            followed = User.objects.get(id=followed_id)
        except User.DoesNotExist:
            return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        instance = Follower.objects.filter(follower=follower, followed=followed).first()
        if instance:
            instance.delete()
            self.update_statistics(follower, followed)
            return Response({"detail": "Has dejado de seguir a este usuario."}, status=status.HTTP_204_NO_CONTENT)
        
        return Response({"detail": "No sigues a este usuario."}, status=status.HTTP_400_BAD_REQUEST)
    
    def update_statistics(self, follower, followed):
        """Actualizar las estadísticas de los usuarios después de seguir o dejar de seguir a alguien"""
        # Actualizar el contador de seguidores y siguiendo del usuario seguido
        followed_statistics, _ = Statistics.objects.get_or_create(user=followed)
        followed_statistics.followers_count = Follower.objects.filter(followed=followed).count()
        followed_statistics.save()
        
        follower_statistics, _ = Statistics.objects.get_or_create(user=follower)
        follower_statistics.following_count = Follower.objects.filter(follower=follower).count()
        follower_statistics.save()