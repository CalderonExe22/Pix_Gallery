from rest_framework import viewsets, status
from .models import Comment
from .serializer import CommentSerializer
from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class CommentApiView(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

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

    def get_permissions(self):
        if self.action in ['retrieve','update', 'destroy', 'get_user_comments']:
            self.permission_classes = [IsAuthenticated, IsOwner]
        elif self.action == 'get_all_comments':
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)