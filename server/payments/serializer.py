from rest_framework import serializers
from .models import Payment
from photography.models import Photography

class PaymentSerializer(serializers.ModelSerializer):
    photo = serializers.IntegerField(write_only=True)
    class Meta:
        model = Payment
        fields = ['payment_id', 'photo', 'status', 'payment_type', 'created_at', 'updated_at']

    def create(self, validated_data):
        photo_id = validated_data.pop('photo')
        photo = Photography.objects.get(id=photo_id)
        validated_data['photo'] = photo # Se reemplaza el id de la foto por el objeto de la foto
        payment = Payment.objects.create(**validated_data)
        return payment
    
    def to_representation(self, instance):
        return {
            'photo': instance.photo.id,
            'photo_price': instance.photo.price,
            'photo_title': instance.photo.title,
            'photo_image': instance.photo.image.url,
            'payment_id': instance.payment_id,
            'status': instance.status,
            'payment_type': instance.payment_type,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at
        }