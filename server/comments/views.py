from rest_framework.viewsets import ModelViewSet
from .models import Comment
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