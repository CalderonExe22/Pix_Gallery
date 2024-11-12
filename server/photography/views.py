from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import *
from users.models import User
from .serializer import *

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class PhotographyAPIView(ModelViewSet):
    queryset = Photography.objects.all()
    serializer_class = SerializerPhotography
    
    @action(detail=False, methods=['get'],permission_classes=[AllowAny])
    def get_all_photographies(self, request):
        """Endpoint para obtener todas las fotografías sin filtrar por usuario."""
        all_photographies = Photography.objects.all()
        serializer = self.get_serializer(all_photographies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'],permission_classes=[IsAuthenticated])
    def get_user_photographies(self, request ):
        """Endpoint para obtener fotografías de un usuario específico."""
        user_photographies = Photography.objects.filter(user = self.request.user)
        serializer = self.get_serializer(user_photographies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='user-photographies/(?P<user_id>[^/.]+)')
    def get_photographies_by_user(self, request, user_id=None):
        """Endpoint para obtener fotografías públicas de un usuario específico."""
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        user_photographies = Photography.objects.filter(user=user, is_public=True)
        serializer = self.get_serializer(user_photographies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def perform_create(self, serializer):
        data = serializer.save(user=self.request.user)
        return Response(data=data)
    
    def get_permissions(self):
        if self.action in ['retrieve', 'update', 'destroy', 'get_user_photographies']:
            self.permission_classes = [IsAuthenticated]
        elif self.action == ['get_all_photographies','get_photographies_by_user']:
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

class CollectionAPIView(ModelViewSet):
    serializer_class = CollectionSerializer
    queryset = Collection.objects.all()
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Devolvemos la colección creada en la respuesta
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def all_collections(self, request):
        """Endpoint para obtener todas las colecciones sin filtrar por usuario."""
        all_collections = Collection.objects.all()
        serializer = self.get_serializer(all_collections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def user_collections(self, request):
        """Endpoint para obtener colecciones del usuario autenticado mediante CollectionPhotography."""
        # Filtramos CollectionPhotography por el usuario actual y obtenemos las colecciones relacionadas
        user_collection_ids = CollectionPhotography.objects.filter(user=request.user).values_list('collection', flat=True)
        user_collections = Collection.objects.filter(id__in=user_collection_ids)
        
        serializer = self.get_serializer(user_collections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='user-collections/(?P<user_id>[^/.]+)')
    def get_collections_by_user(self, request, user_id=None):
        """Endpoint para obtener las colecciones y fotografías de un usuario específico."""
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        user_collections = Collection.objects.filter(collectionphotography__user=user).distinct()
        serializer = CollectionSerializer(user_collections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def get_permissions(self):
        if self.action in ['retrieve', 'update', 'destroy', 'user_collections']:
            self.permission_classes = [IsAuthenticated]
        elif self.action == ['all_collections','get_collections_by_user']:
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [AllowAny]
        return super().get_permissions()


class CategoryAPIView(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryPhotographyAPIView(ModelViewSet):
    queryset = CategoryPhotography.objects.all()
    serializer_class = CategoryPhotographySerializer