from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, ValidationError
from .models import Photography, Category, CategoryPhotography
from users.models import User

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username'] 

class SerializerPhotography(ModelSerializer):
    category = serializers.IntegerField(write_only=True)
    class Meta:
        model = Photography
        fields = ['id', 'title', 'description','category', 'image', 'precio', 'is_free','is_public', 'created_at']
    
    def validate(self, data):
        if data['is_free'] and data.get('precio', 0) > 0:
            raise ValidationError("Las fotos gratuitas no deben tener un precio.")
        if not data['is_free'] and (data.get('precio') is None or data['precio'] <= 0):
            raise ValidationError("Las fotos no gratuitas deben tener un precio mayor que 0.")
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