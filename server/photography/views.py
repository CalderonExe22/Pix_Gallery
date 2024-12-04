from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny
from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import *
from users.models import User
from .serializer import *
from follower.models import Follower
from notification.models import Notification
from cloudinary.uploader import destroy
from rest_framework.views import APIView
from django.db.models import Count
from django.db.models import Q

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        print(f"Request User: {request.user}, Object Owner: {obj.user}")
        return obj.user == request.user

class PhotographyAPIView(ModelViewSet):
    queryset = Photography.objects.all()
    serializer_class = SerializerPhotography
    permission_classes = [IsAuthenticated, IsOwner]
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def get_all_categories(self, request):
        """Endpoint para obtener todas las categorías."""
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def get_all_tags(self, request):
        """Endpoint para obtener todos los tags."""
        tags = Tag.objects.all()
        serializer = TagsForFilter(tags, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['patch'], permission_classes = [IsAuthenticated, IsOwner])
    def toggle_privacy(self, request, pk=None):
        photography = self.get_object()
        self.check_object_permissions(request, photography)
        if photography.user != request.user:
            return Response({"detail": "No tienes permiso para modificar esta fotografía."}, status=status.HTTP_403_FORBIDDEN)
        
        photography.is_public = not photography.is_public
        photography.save()
        return Response({
            "detail": "El estado de privacidad se ha actualizado correctamente.",
            "is_public": photography.is_public
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'],permission_classes=[AllowAny])
    def get_all_photographies(self, request):
        """Endpoint para obtener todas las fotografías sin filtrar por usuario."""
        category_id = request.query_params.get('category')
        tag_id = request.query_params.get('tag')
        is_free = request.query_params.get('is_free')
        query = Q(is_public=True)
        if category_id:
            query &= Q(categoryphotography__category_id=category_id)
        if tag_id:
            query &= Q(photography_tags__tag_id=tag_id)
        if is_free is not None and is_free != '': 
            query &= Q(is_free=is_free.lower() == 'true')
            
        all_photographies = Photography.objects.filter(query).distinct()
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
        
        user_photographies = Photography.objects.filter(user=user).distinct()
        serializer = self.get_serializer(user_photographies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def perform_create(self, serializer):
        photography = serializer.save(user=self.request.user)
        followers = Follower.objects.filter(followed=self.request.user)
        can_notification = self.request.data.get('can_notification', "true").lower() == "true"
        if can_notification :
            for follower in followers:
                Notification.objects.create(
                    user= follower.follower,
                    message=f'{self.request.user.username} ha subido una nueva fotografia',
                    photography=photography
                )
        return Response(data=photography,status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):
        photo = self.get_object()
        self.check_object_permissions(request, photo)
        photo.delete()
        return Response({"detail": "Fotografía eliminada correctamente."}, status=status.HTTP_204_NO_CONTENT)
    
    def update(self, request, *args, **kwargs):
        # Obtener el objeto de la fotografía a actualizar
        photo = self.get_object()
        if photo.user != request.user:
            return Response({"detail": "No tienes permiso para modificar esta fotografía."}, status=status.HTTP_403_FORBIDDEN)
        validated_data = request.data.copy()
        
        tags = validated_data.pop('tags', None)
        camera = validated_data.pop('camera', None)
        lens = validated_data.pop('lens', None)
        focal_length = validated_data.pop('focal_length', None)
        shutter_speed = validated_data.pop('shutter_speed', None)
        aperture = validated_data.pop('aperture', None)
        iso = validated_data.pop('iso', None)
        category_id = validated_data.pop('category', None)
        
        if isinstance(category_id, list):
            category_id = category_id[0]
        
        # Llamamos al `update` original para actualizar los campos de la fotografía
        for attr, value in validated_data.items():
            setattr(photo, attr, value)

        # Actualizar la categoría si se pasa un ID de categoría
        if category_id:
            # Eliminar la relación anterior
            photo.categoryphotography_set.all().delete()
            
            # Crear la nueva relación con la categoría seleccionada
            category = Category.objects.get(id=category_id)
            CategoryPhotography.objects.create(category=category, photography=photo)

        # Actualizar los tags solo si se pasan tags
        if tags is not None:
            # Eliminar los tags anteriores si se van a actualizar
            PhotographyTag.objects.filter(photography=photo).delete()
            # Crear los nuevos tags
            for tag_name in tags:
                tag, created = Tag.objects.get_or_create(name=tag_name)
                PhotographyTag.objects.create(photography=photo, tag=tag)

        # Actualizar los datos EXIF si se proporcionan
        if any([camera, lens, focal_length, shutter_speed, aperture, iso]):
            exif_data = ExifData.objects.get(photography=photo)
            if camera is not None: exif_data.camera = camera
            if lens is not None: exif_data.lens = lens
            if focal_length is not None: exif_data.focal_length = focal_length
            if shutter_speed is not None: exif_data.shutter_speed = shutter_speed
            if aperture is not None: exif_data.aperture = aperture
            if iso is not None: exif_data.iso = iso
            exif_data.save()

        # Guardar la fotografía actualizada
        photo.save()

        # Serializar y devolver la respuesta
        serializer = self.get_serializer(photo)
        return Response(serializer.data)
        
        
    def get_permissions(self):
        if self.action in ['update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsOwner]
        elif self.action in ['get_all_photographies', 'get_photographies_by_user','get_all_tags','get_all_categories']:
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

class CollectionAPIView(ModelViewSet):
    serializer_class = CollectionSerializer
    queryset = Collection.objects.all()
    permission_classes = [IsAuthenticated, IsOwner]
    
    def create(self, request, *args, **kwargs):
    # Validar los datos recibidos
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) 
        # Guardar la colección y obtener la instancia del modelo
        collection = serializer.save()
        # Crear notificaciones para los seguidores
        followers = Follower.objects.filter(followed=request.user)
        for follower in followers:
            Notification.objects.create(
                user=follower.follower,
                message=f'{request.user.username} ha creado una nueva colección',  # Ahora `collection` tiene acceso a sus atributos del modelo
                collection=collection  # Solo si el modelo `Notification` tiene un campo relacionado con la colección
            )
        # Retornar la respuesta con la colección creada
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):
        collection = self.get_object()
        
        if not CollectionPhotography.objects.filter(collection=collection, user=request.user).exists():
            return Response({"detail": "No tienes permiso para eliminar esta colección."}, status=status.HTTP_403_FORBIDDEN)
        
        collection_photographies = CollectionPhotography.objects.filter(collection=collection)
        for collection_photo in collection_photographies:
            photo = collection_photo.photography
            if photo.image:
                destroy(photo.image.public_id)
            collection_photo.delete()

        collection.delete()
        return Response({"detail": "Colección eliminada con éxito."}, status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)  # Manejar actualizaciones parciales (PATCH)
        instance = self.get_object()
        if not CollectionPhotography.objects.filter(collection=instance, user=request.user).exists():
            return Response({"detail": "No tienes permiso para modificar esta colección."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def all_collections(self, request):
        """Endpoint para obtener todas las colecciones sin filtrar por usuario."""
        category_id = request.query_params.get('category') 
        tag_id = request.query_params.get('tag')
        is_free = request.query_params.get('is_free')
        query = Q(is_public=True)
        if category_id:
            query &= Q(categorycollection__category_id=category_id)
        if tag_id:
            query &= Q(collectionphotography__photography__photography_tags__tag_id=tag_id)
        if is_free is not None and is_free != '': 
            is_free_bool = is_free.lower() == 'true'
            query &= Q(collectionphotography__photography__is_free=is_free_bool)
        
        all_collections = Collection.objects.filter(query).distinct()
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
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def toggle_privacy(self, request, pk=None):
        collection = self.get_object()
        if not CollectionPhotography.objects.filter(collection=collection, user=request.user).exists():
            return Response({"detail": "No tienes permiso para modificar esta colección."}, status=status.HTTP_403_FORBIDDEN)

        collection.is_public = not collection.is_public
        collection.save()
        
        return Response({
            "detail": "El estado de privacidad de la colección se ha actualizado correctamente.",
            "is_public": collection.is_public
        }, status=status.HTTP_200_OK)
    
    def get_permissions(self):
        if self.action in [ 'update', 'destroy']:
            self.permission_classes = [IsAuthenticated]
        elif self.action in ['all_collections','get_collections_by_user']:
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
    
class ExploreView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        most_viewed_photos = Photography.objects.filter(is_public=True).annotate(
            view_count=Count('view')
        ).order_by('-view_count')[:10]
        
        most_liked_photos = Photography.objects.filter(is_public=True).annotate(
            like_count=Count('like')
        ).order_by('-like_count')[:10]
        
        most_followed_users = User.objects.annotate(
            follower_count=Count('followers')
        ).order_by('-follower_count')[:10]
        
        most_viewed_collections = Collection.objects.filter(is_public=True).annotate(
            view_count=Count('view')
        ).order_by('-view_count')[:10] 
        
        most_liked_collections = Collection.objects.filter(is_public=True).annotate(
            like_count=Count('like')
        ).order_by('-like_count')[:10]
        
        
        data = {
            "most_viewed_photos": SerializerPhotography(most_viewed_photos, many=True).data,
            "most_liked_photos": SerializerPhotography(most_liked_photos, many=True).data,
            "most_followed_users": UserSerializer(most_followed_users, many=True).data,
            "most_viewed_collections": CollectionSerializer(most_viewed_collections, many=True).data,
            "most_liked_collections": CollectionSerializer(most_liked_collections, many=True).data,
        }
        
        return Response(data=data, status=status.HTTP_200_OK)


class MostLikedCollectionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        most_liked_collections = Collection.objects.filter(is_public=True).annotate(
            like_count=Count('like')
        ).order_by('-like_count')[:10]

        data = CollectionSerializer(most_liked_collections, many=True).data
        return Response(data=data, status=status.HTTP_200_OK)

class MostViewedCollectionsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        most_viewed_collections = Collection.objects.filter(is_public=True).annotate(
            view_count=Count('view')
        ).order_by('-view_count')[:10] 

        data = CollectionSerializer(most_viewed_collections, many=True).data
        return Response(data=data, status=status.HTTP_200_OK)


class ExploreMostLikedPhotosView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        most_liked_photos = Photography.objects.filter(is_public=True).annotate(
            like_count=Count('like')
        ).order_by('-like_count')[:10]
        
        data = SerializerPhotography(most_liked_photos, many=True).data
        return Response(data=data, status=status.HTTP_200_OK)

class ExploreMostViewedPhotosView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        most_viewed_photos = Photography.objects.filter(is_public=True).annotate(
            view_count=Count('view')
        ).order_by('-view_count')[:10]
        
        data = SerializerPhotography(most_viewed_photos, many=True).data
        return Response(data=data, status=status.HTTP_200_OK)
    
