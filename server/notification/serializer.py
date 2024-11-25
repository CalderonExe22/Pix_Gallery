from rest_framework import serializers
from .models import Notification
from photography.serializer import * 

class NotificationSerializer(serializers.ModelSerializer):
    photography = SerializerPhotography(read_only=True)
    collection = CollectionSerializer(read_only=True)
    class Meta:
        model=Notification
        fields = ['id', 'message', 'user', 'is_read', 'created_at', 'photography', 'collection']
        read_only_fields = ['id', 'user', 'created_at', 'photography', 'collection']