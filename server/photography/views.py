from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.viewsets import ModelViewSet
from .models import Photography
from users.models import User
from .serializer import SerializerPhotography

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class PhotographyAPIView(ModelViewSet):
    queryset = Photography.objects.all()
    serializer_class = SerializerPhotography
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        user_param = self.request.query_params.get('user', None)
        if user_param:
            try:
                user = User.objects.get(id=user_param)  # Asegúrate de validar si el usuario existe
                return Photography.objects.filter(user=user, is_public=True)
            except User.DoesNotExist:
                return Photography.objects.none()  # Si el usuario no existe, devolver un queryset vacío
        else:
            return Photography.objects.filter(user=self.request.user)
    
    def get_permissions(self):
        if self.action in ['retrieve', 'update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsOwner]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)