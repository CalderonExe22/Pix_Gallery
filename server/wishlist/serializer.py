from rest_framework import serializers
from .models import Wishlist
from photography.models import *
from photography.serializer import *
import json

class WishlistSerializer(serializers.ModelSerializer):
    photo = serializers.IntegerField(write_only=True, required=False)
    collection = serializers.IntegerField(write_only=True, required=False)
    class Meta:
        model = Wishlist
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
            raise serializers.ValidationError("Debes proporcionar una foto o una colección.")
            
        wishlist = Wishlist.objects.create(**validated_data)
        return wishlist

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'user': instance.user.username,
            'photo': SerializerPhotography(instance.photo).data if instance.photo else None,
            'collection': CollectionSerializer(instance.collection).data if instance.collection else None,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at
        }
