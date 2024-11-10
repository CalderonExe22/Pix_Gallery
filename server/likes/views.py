from rest_framework import viewsets, status
from .models import Like
from .serializer import LikeSerializer
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
        elif self.action == 'get_all_likes':
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)