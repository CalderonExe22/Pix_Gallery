from rest_framework.serializers import ModelSerializer, ValidationError
from .models import Photography
from users.models import User

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username'] 

class SerializerPhotography(ModelSerializer):
    class Meta:
        model = Photography
        fields = ['id', 'title', 'description', 'image', 'precio', 'is_free','is_public', 'created_at']
    
    def validate(self, data):
        if data['is_free'] and data.get('precio', 0) > 0:
            raise ValidationError("Las fotos gratuitas no deben tener un precio.")
        if not data['is_free'] and (data.get('precio') is None or data['precio'] <= 0):
            raise ValidationError("Las fotos no gratuitas deben tener un precio mayor que 0.")
        return data