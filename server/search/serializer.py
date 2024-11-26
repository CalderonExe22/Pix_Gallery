from users.models import Profile
from photography.models import *
from photography.serializer import *
from users.serializer import *
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

class PhotographySerializer(ModelSerializer): 
    image_url = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True) 
    class Meta:
        model = Photography
        fields = ['id','title','description','image','image_url','user']
        
    def get_image_url(self, obj):
        return obj.image.url if obj.image else None
    
class ProfileSerializer(ModelSerializer): 
    user = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = ['user']
    
class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name', 'image', 'description']
        
class CollectionSerializer(ModelSerializer):
    photos = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    class Meta:
        model = Collection
        fields = ['id','name','description','photos','user']
    
    def get_user(self, obj):
        collection_photography = CollectionPhotography.objects.filter(collection=obj).first()
        if collection_photography:
            return UserSerializer(collection_photography.user).data
        return None
    
    def get_photos(self, obj):
        # Obtener todas las fotos asociadas a la colección a través del modelo intermedio CollectionPhotography
        collection_photographies = CollectionPhotography.objects.filter(collection=obj)
        
        # Serializar las fotos usando un serializer específico para el modelo Photography
        photography_serializer = SerializerPhotography(
            [cp.photography for cp in collection_photographies],
            many=True
        )
        return photography_serializer.data
    
class CollectionPhotographySerializer(ModelSerializer):
    photography = SerializerPhotography()
    class Meta:
        model = CollectionPhotography
        fields = ['photography']