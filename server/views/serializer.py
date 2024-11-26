from rest_framework import serializers
from .models import View
from photography.models import *
from user_statistics.models import Statistics
from rest_framework.exceptions import ValidationError

class ViewSerializer(serializers.ModelSerializer):
    photo = serializers.IntegerField(write_only=True, required=False)
    collection = serializers.IntegerField(write_only=True, required=False)
    class Meta:
        model = View
        fields = ['photo','collection', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        request_user = self.context['request'].user
        photo_id = validated_data.pop('photo', None)
        collection_id = validated_data.pop('collection', None)
        
        if photo_id:
            photo = Photography.objects.get(id=photo_id)
            validated_data['photo'] = photo # Se reemplaza el id de la foto por el objeto de la foto
            if photo.user != request_user:
                photo_owner_stats, _ = Statistics.objects.get_or_create(user=validated_data['photo'].user)
                photo_owner_stats.photos_views_count += 1
                photo_owner_stats.views_count += 1
                photo_owner_stats.save()
        elif collection_id:
            collection = Collection.objects.get(id=collection_id)
            validated_data['collection'] = Collection.objects.get(id=collection_id)
            collection_photography = CollectionPhotography.objects.filter(collection=collection).first()
            if collection_photography and collection_photography.user != request_user :
                collection_owner_stats, _ = Statistics.objects.get_or_create(user=collection_photography.user)
                collection_owner_stats.collections_views_count += 1
                collection_owner_stats.views_count += 1
                collection_owner_stats.save()
        
        return super().create(validated_data)
        
    
    def to_representation(self, instance):
        return {
            'id': instance.id,
            'user': instance.user.username,
            'photo': instance.photo.id if instance.photo else None,
            'collection': instance.collection.id if instance.collection else None,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at,
        }
