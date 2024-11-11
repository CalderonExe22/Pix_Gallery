from rest_framework import viewsets, status
from .models import Wishlist
from .serializer import WishlistSerializer
from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class WishlistApiView(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    @action (detail=False, methods=['get'], permission_classes=[AllowAny])
    def get_all_wishlist(self, request):
        # Endpoint para obtener todas las wishlists sin filtrar por el usuario
        all_wishlist = Wishlist.objects.all()
        serializer = self.get_serializer(all_wishlist, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action (detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_user_wishlist(self, request):
        # Endpoint para obtener todas las wishlists de un usuario
        user_wishlist = Wishlist.objects.filter(user=request.user)
        serializer = self.get_serializer(user_wishlist, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_permissions(self):
        if self.action in ['retrieve','update', 'destroy', 'get_user_wishlist']:
            self.permission_classes = [IsAuthenticated, IsOwner]
        elif self.action == 'get_all_wishlist':
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)