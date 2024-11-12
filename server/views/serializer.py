from rest_framework import serializers
from .models import View
from photography.models import Photography
from user_statistics.models import Statistics

class ViewSerializer(serializers.ModelSerializer):
    photo = serializers.IntegerField(write_only=True)
    class Meta:
        model = View
        fields = ['photo', 'created_at']
    
    def create(self, validated_data):
        photo_id = validated_data.pop('photo')
        photo = Photography.objects.get(id=photo_id)
        validated_data['photo'] = photo # Se reemplaza el id de la foto por el objeto de la foto
        view = View.objects.create(**validated_data)
        user_stats, created = Statistics.objects.get_or_create(user=photo.user)
        user_stats.visits_count += 1
        user_stats.save()
        return view
    
    def to_representation(self, instance):
        return {
            'id': instance.id,
            'user': instance.user.username,
            'photo': instance.photo.id,
            'created_at': instance.created_at,
        }
