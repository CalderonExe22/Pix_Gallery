from rest_framework import serializers
from .models import Follower

class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follower
        fields = ['follower', 'followed', 'created_at']
        read_only_fields = ['created_at']