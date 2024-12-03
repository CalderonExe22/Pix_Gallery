from rest_framework import serializers
from users.models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Profile
        fields = ['id','name','last_name','bio','country','profile_photo','website','profile_image_url']
        
    def update(self, instance, validated_data):
        profile_photo = validated_data.get('profile_photo',None)
        if profile_photo:
            instance.profile_photo = profile_photo
        return super().update(instance, validated_data)
    
    def get_profile_image_url(self, obj):
        return obj.profile_photo.url if obj.profile_photo else None