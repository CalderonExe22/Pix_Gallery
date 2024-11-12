from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from users.models import Profile
from .serializer import ProfileSerializer

class ProfileViewSet(ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        # Permitir solo que el propietario del perfil lo edite
        if self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsAuthenticatedOrReadOnly]
        return super().get_permissions()

    def retrieve(self, request, *args, **kwargs):
        # Obtener el perfil del usuario específico si se proporciona un `pk`
        profile = get_object_or_404(Profile, user__id=kwargs['pk'])
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        # Solo permitir que el usuario autenticado edite su propio perfil
        profile = get_object_or_404(Profile, user=request.user)
        if profile.user.id != request.user.id:
            return Response({"detail": "No tienes permiso para editar este perfil."}, status=403)

        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)