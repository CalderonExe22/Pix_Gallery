from rest_framework.viewsets import ModelViewSet
from .models import Comment
from photography.models import CollectionPhotography
from user_statistics.models import Statistics
from .serializer import CommentSerializer
from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class CommentApiView(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def get_comments_by_collection(self, request, collection_id=None):
        # Endpoint para obtener comentarios por colección
        comments = Comment.objects.filter(collection_id=collection_id)
        serializer = self.get_serializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action (detail=False, methods=['get'], permission_classes=[AllowAny])
    def get_all_comments(self, request):
        # Endpoint para obtener todos los comentarios sin filtrar por el usuario
        all_comments = Comment.objects.all()
        serializer = self.get_serializer(all_comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action (detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_user_comments(self, request):
        # Endpoint para obtener todos los comentarios de un usuario
        user_comments = Comment.objects.filter(user=request.user)
        serializer = self.get_serializer(user_comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_permissions(self):
        if self.action in ['update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsOwner]
        else:
            self.permission_classes = [AllowAny]
        return super().get_permissions()
    
    def perform_destroy(self, instance):
        if instance.photo:
            user_stats = Statistics.objects.get(user=instance.photo.user)
        elif instance.collection:
            collection_photography = CollectionPhotography.objects.filter(collection=instance.collection).first()
            user_stats = Statistics.objects.get(user=collection_photography.user)
            if collection_photography:
                user_stats = Statistics.objects.get(user=collection_photography.user)
            else:
                user_stats = None
        else: 
            user_stats = None
            
        if user_stats and user_stats.comments_count > 0:
            user_stats.comments_count -= 1
            user_stats.save()

        instance.delete()