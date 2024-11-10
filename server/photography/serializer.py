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
    class Meta:
        model = Photography
        fields = ['id', 'title', 'description', 'image','image_url','category', 'price', 'is_free','is_public', 'created_at']

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

class CollectionSerializer(ModelSerializer):
    class Meta:
        model = Collection
        fields = ['id','name','description']
        
class CollectionPhotographySerializer(ModelSerializer):
    class Meta:
        model = CollectionPhotography
        fields = ['id','user','photography','collection']