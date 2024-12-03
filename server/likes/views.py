from rest_framework import viewsets, status
from .models import Like
from photography.models import CollectionPhotography
from .serializer import LikeSerializer
from user_statistics.models import Statistics
from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class LikeApiView(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='get_all_likes_photo/(?P<photo_id>[0-9]+)')
    def get_all_likes_photo(self, request, photo_id=None):
        # Endpoint para obtener todos los likes de una foto
        like_count = Like.objects.filter(photo_id=photo_id).count()
        return Response({'like_count': like_count}, status=status.HTTP_200_OK)

    @action (detail=False, methods=['get'], permission_classes=[AllowAny])
    def get_all_likes(self, request):
        # Endpoint para obtener todos los likes sin filtrar por el usuario
        all_likes = Like.objects.all()
        serializer = self.get_serializer(all_likes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action (detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_user_likes(self, request):
        # Endpoint para obtener todos los likes de un usuario
        user_likes = Like.objects.filter(user=request.user)
        serializer = self.get_serializer(user_likes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_permissions(self):
        if self.action in ['retrieve','update', 'destroy', 'get_user_likes']:
            self.permission_classes = [IsAuthenticated]
        elif self.action in ['get_all_likes','get_all_likes_photo']:
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    def perform_destroy(self, instance):
        if instance.photo:
            user_stats = Statistics.objects.filter(user=instance.photo.user).first()
        elif instance.collection:
            collection_photography = CollectionPhotography.objects.filter(collection=instance.collection).first()
            user_stats = Statistics.objects.get(user=collection_photography.user) if collection_photography else None
        else:
            user_stats = None    
            
        if user_stats and user_stats.likes_count > 0:
            user_stats.likes_count -= 1
            user_stats.save()

        instance.delete()
        