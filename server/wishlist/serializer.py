from rest_framework import serializers
from .models import Wishlist
from photography.models import Photography

class WishlistSerializer(serializers.ModelSerializer):
    photo = serializers.IntegerField(write_only=True)
    class Meta:
        model = Wishlist
        fields = ['photo', 'created_at', 'updated_at']

    def create(self, validated_data):
        photo_id = validated_data.pop('photo')
        photo = Photography.objects.get(id=photo_id)
        validated_data['photo'] = photo # Se reemplaza el id de la foto por el objeto de la foto
        wishlist = Wishlist.objects.create(**validated_data)
        return wishlist

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'photo': instance.photo.id,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at
        }
