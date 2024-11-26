from rest_framework import serializers
from .models import Payment
from photography.models import Photography, Collection
from django.db.models import Sum

class PaymentSerializer(serializers.ModelSerializer):
    photo = serializers.IntegerField(write_only=True, required=False)
    collection = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Payment
        fields = ['payment_id', 'photo', 'collection', 'status', 'payment_type', 'created_at', 'updated_at']

    def create(self, validated_data):
        photo_id = validated_data.pop('photo', None)
        collection_id = validated_data.pop('collection', None)
        if photo_id:
            photo = Photography.objects.get(id=photo_id)
            validated_data['photo'] = photo
        elif collection_id:
            collection = Collection.objects.get(id=collection_id)
            validated_data['collection'] = collection
        else:
            raise serializers.ValidationError("Photo or Collection is required")
        
        payment = Payment.objects.create(**validated_data)
        return payment

    def to_representation(self, instance):
        representation = {
            'user': instance.user.username,
            'payment_id': instance.payment_id,
            'status': instance.status,
            'payment_type': instance.payment_type,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at
        }
        if instance.photo:
            representation.update({
            'type_payment': 'photo',
            'photo': instance.photo.id,
            'photo_user': instance.photo.user_id,
            'photo_username': instance.photo.user.username,
            'photo_precio': instance.photo.precio,
            'photo_title': instance.photo.title,
            'photo_image': instance.photo.image.url
            })
        if instance.collection:
            collection_photography = instance.collection.collectionphotography_set.first()
            representation.update({
            'type_payment': 'collection',
            'collection': instance.collection.id,
            'collection_name': instance.collection.name,
            'collection_user_id': collection_photography.user.id if collection_photography else None,
            })
        return representation