from rest_framework import serializers
from .models import Like
from photography.models import *
from user_statistics.models import Statistics

class LikeSerializer(serializers.ModelSerializer):
    photo = serializers.IntegerField(write_only=True, required=False)
    collection = serializers.IntegerField(write_only=True, required=False)
    class Meta:
        model = Like
        fields = ['photo','collection', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        photo_id = validated_data.pop('photo', None)
        collection_id = validated_data.pop('collection', None)
        if photo_id:   
            photo = Photography.objects.get(id=photo_id)
            validated_data['photo'] = photo # Se reemplaza el id de la foto por el objeto de la foto
        elif collection_id:
            collection = Collection.objects.get(id=collection_id)
            validated_data['collection'] = collection
        else:
            raise serializers.ValidationError("Debe proporcionar 'photo' o 'collection' para realizar un like.")
        
        like = Like.objects.create(**validated_data)
        
        if photo_id:
            user_stats, created = Statistics.objects.get_or_create(user=photo.user)
        elif collection_id:
            collection_photography = CollectionPhotography.objects.filter(collection=collection).first()
            if collection_photography:
                user_stats, created = Statistics.objects.get_or_create(user=collection_photography.user)
            else:
                user_stats = None

        if user_stats:
            user_stats.likes_count += 1
            user_stats.save()

        return like
    
    def to_representation(self, instance):
        return {
            'id': instance.id,
            'user': instance.user.username,
            'photo': instance.photo.id if instance.photo else None,
            'collection': instance.collection.id if instance.collection else None,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at
        }