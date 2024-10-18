from users.models import Profile
from photography.models import Photography, Category
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

class PhotographySerializer(ModelSerializer): 
    class Meta:
        model = Photography
        fields = ['id','title','description','image']
    
class ProfileSerializer(ModelSerializer): 
    user = serializers.CharField(source='user.username')
    class Meta:
        model = Profile
        fields = ['id','user','profile_photo']
    
class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name']