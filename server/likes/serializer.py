from rest_framework import serializers
from .models import Like
from photography.models import Photography
from user_statistics.models import Statistics

class LikeSerializer(serializers.ModelSerializer):
    photo = serializers.IntegerField(write_only=True)
    class Meta:
        model = Like
        fields = ['photo', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        photo_id = validated_data.pop('photo')
        photo = Photography.objects.get(id=photo_id)
        validated_data['photo'] = photo # Se reemplaza el id de la foto por el objeto de la foto
        like = Like.objects.create(**validated_data)
        user_stats, created = Statistics.objects.get_or_create(user=photo.user)
        user_stats.likes_count += 1
        user_stats.save()
        return like
    
    def to_representation(self, instance):
        return {
            'id': instance.id,
            'user': instance.user.username,
            'photo_title': instance.photo.title,
            'photo': instance.photo.id,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at
        }