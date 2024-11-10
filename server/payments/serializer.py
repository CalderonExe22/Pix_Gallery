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