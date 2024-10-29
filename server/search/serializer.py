from users.models import Profile
from photography.models import *
from photography.serializer import *
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
        fields = ['id','name', 'image', 'description']
        
class CollectionSerializer(ModelSerializer):
    photos = serializers.SerializerMethodField()
    class Meta:
        model = Collection
        fields = ['id','name','description','photos']
    
    def get_photos(self, obj):
        photos = CollectionPhotography.objects.filter(collection=obj)
        return CollectionPhotographySerializer(photos, many=True).data
            
class CollectionPhotographySerializer(ModelSerializer):
    photography = SerializerPhotography()
    class Meta:
        model = CollectionPhotography
        fields = ['photography']