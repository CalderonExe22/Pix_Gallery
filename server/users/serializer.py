from .models import *
import re
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from django.contrib.auth import authenticate

class UserSerializer(ModelSerializer):
    class Meta: 
        model = User
        fields = ['id','email','username', 'first_name', 'last_name']
        
class ProfileSerializer(ModelSerializer):
    class Meta: 
        model = Profile
        fields = ['user','bio','profile_photo','website']
        
class UserRegistrationSerializar(ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta: 
        model = User
        fields = ('id','username','email','password1','password2')
        extra_kwargs = {
            'password' : {'write_only':True}
        }
    
    def validate(self, attrs):
        if attrs['password1'] != attrs['password2'] : 
            raise serializers.ValidationError('Las contraseñas no son iguales!!')
        password = attrs.get('password1','') 
        if not (len(password) >= 8 and re.search(r'\d', password) and 
                re.search(r'[A-Z]', password)):
            raise serializers.ValidationError(
                "La contraseña debe tener al menos 8 caracteres, contener un número y "
                "una letra mayúscula."
            )
        return attrs
    
    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')
        user =  User.objects.create_user(password=password,**validated_data)
        
        Profile.objects.create(user=user)
        
        fotografo_role, created = Rol.objects.get_or_create(name='fotógrafo')
        RolUser.objects.create(user=user, rol=fotografo_role)
        return user 
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active : 
            return user
        raise serializers.ValidationError('Datos incorrectos')
    
