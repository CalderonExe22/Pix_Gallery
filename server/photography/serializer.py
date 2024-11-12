from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, ValidationError, ListSerializer
from .models import *
from users.models import User

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username']

class SerializerPhotography(ModelSerializer):
    category = serializers.IntegerField(write_only=True)
    image_url = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Photography
        fields = ['id', 'title', 'description', 'image','image_url','category', 'price', 'is_free','is_public', 'created_at', 'user']

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None
    
    def validate(self, data):
        if data['is_free'] and data.get('price', 0) > 0:
            raise ValidationError("Las fotos gratuitas no deben tener un price.")
        if not data['is_free'] and (data.get('price') is None or data['price'] <= 0):
            raise ValidationError("Las fotos no gratuitas deben tener un price mayor que 0.")
        return data
    
    def create(self, validated_data):
        category_id = validated_data.pop('category')
        category = Category.objects.get(id=category_id)
        photography = Photography.objects.create(**validated_data)
        CategoryPhotography.objects.create(category=category, photography=photography)
        return photography

class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image']

class CategoryPhotographySerializer(ModelSerializer):
    class Meta:
        model = CategoryPhotography
        fields = ['id', 'photography', 'category']

class CollectionSerializer(serializers.ModelSerializer):
    photos = serializers.SerializerMethodField()  # Utilizamos SerializerMethodField para obtener las fotos relacionadas
    photos_input = serializers.ListField(
        child=serializers.IntegerField(),  # Usamos un campo de tipo lista de enteros para enviar los IDs de las fotos
        write_only=True  # Este campo solo se utilizará para la escritura (en el create)
    )

    class Meta:
        model = Collection
        fields = ['id', 'name', 'description', 'photos', 'photos_input']  # Añadimos `photos_input` para crear las fotos y `photos` para leerlas

    def get_photos(self, obj):
        # Obtener todas las fotos asociadas a la colección a través del modelo intermedio CollectionPhotography
        collection_photographies = CollectionPhotography.objects.filter(collection=obj)
        
        # Serializar las fotos usando un serializer específico para el modelo Photography
        photography_serializer = SerializerPhotography(
            [cp.photography for cp in collection_photographies],
            many=True
        )
        return photography_serializer.data
    
    def create(self, validated_data):
        photos_data = validated_data.pop('photos_input', [])  # Recibimos el campo `photos_input` para agregar las fotos a la colección
        collection = Collection.objects.create(**validated_data)

        # Asociamos las fotos a la colección utilizando los IDs recibidos
        for photo_id in photos_data:
            try:
                photography = Photography.objects.get(id=photo_id)
                CollectionPhotography.objects.create(
                    collection=collection,
                    photography=photography,
                    user=self.context['request'].user
                )
            except Photography.DoesNotExist:
                raise serializers.ValidationError(f"Fotografía con id {photo_id} no existe.")
        return collection

class CollectionPhotographySerializer(ModelSerializer):
    photography = SerializerPhotography()
    class Meta:
        model = CollectionPhotography
        fields = ['photography']