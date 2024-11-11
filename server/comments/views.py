from rest_framework.viewsets import ModelViewSet
from .models import Comment
from user_statistics.models import Statistics
from .serializer import CommentSerializer
from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny

# Create your views here.

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class CommentApiView(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_permissions(self):
        if self.action in ['update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsOwner]
        else:
            self.permission_classes = [AllowAny]
        return super().get_permissions()
    
    def perform_destroy(self, instance):
        user_stats = Statistics.objects.get(user=instance.photo.user)
        if user_stats.comments_count > 0:
            user_stats.comments_count -= 1
            user_stats.save()

        # Eliminar el comentario
        instance.delete()