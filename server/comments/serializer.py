from rest_framework import serializers
from .models import Comment
from photography.models import *
from user_statistics.models import Statistics 
from users.serializer import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    photo = serializers.IntegerField(write_only=True, required=False)
    collection = serializers.IntegerField(write_only=True, required=False)
    user = UserSerializer(read_only=True) 
    class Meta:
        model = Comment
        fields = ['photo','collection', 'comment', 'created_at', 'updated_at','user']

    def create(self, validated_data):
        photo_id = validated_data.pop('photo', None)
        collection_id = validated_data.pop('collection', None)
        if photo_id :
            photo = Photography.objects.get(id=photo_id)
            validated_data['photo'] = photo # Se reemplaza el id de la foto por el objeto de la foto
        else:
            collection = Collection.objects.get(id=collection_id)
            validated_data['collection'] = collection
            
        comment = Comment.objects.create(**validated_data)
        
        if photo_id :
            user_stats, created = Statistics.objects.get_or_create(user=photo.user)
        else:
            collection_photography = CollectionPhotography.objects.filter(collection=collection).first()
            if collection_photography:
                user_stats, created = Statistics.objects.get_or_create(user=collection_photography.user)
            else:
                user_stats = None
                
        user_stats.comments_count += 1
        user_stats.save()
        return comment

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'photo': instance.photo.id if instance.photo else None,
            'collection': instance.collection.id if instance.collection else None,
            'user': UserSerializer(instance.user).data,
            'comment': instance.comment,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at
        }