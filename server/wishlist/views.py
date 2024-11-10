from rest_framework.viewsets import ModelViewSet
from .models import Wishlist
from .serializer import WishlistSerializer
from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny

# Create your views here.

class WishlistApiView(ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)