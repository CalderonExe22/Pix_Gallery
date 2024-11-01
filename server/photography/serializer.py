from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework import serializers
from .models import *
from users.models import User


class SerializerPhotography(ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Photography
        fields = ['id', 'title', 'description', 'image','image_url', 'precio', 'is_free','is_public', 'created_at']
    
    def get_image_url(self, obj):
        return obj.image.url if obj.image else None
    
    def validate(self, data):
        if data['is_free'] and data.get('precio', 0) > 0:
            raise ValidationError("Las fotos gratuitas no deben tener un precio.")
        if not data['is_free'] and (data.get('precio') is None or data['precio'] <= 0):
            raise ValidationError("Las fotos no gratuitas deben tener un precio mayor que 0.")
        return data
    
class CollectionSerializer(ModelSerializer):
    class Meta:
        model = Collection
        fields = ['id','name','description','photos']
        
class CollectionPhotographySerializer(ModelSerializer):
    photography = SerializerPhotography()
    class Meta:
        model = CollectionPhotography
        fields = ['photography']
