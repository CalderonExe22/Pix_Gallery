from rest_framework import serializers
from .models import Comment
from photography.models import Photography

class CommentSerializer(serializers.ModelSerializer):
    photo = serializers.IntegerField(write_only=True)
    class Meta:
        model = Comment
        fields = ['photo', 'comment', 'created_at', 'updated_at']

    def create(self, validated_data):
        photo_id = validated_data.pop('photo')
        photo = Photography.objects.get(id=photo_id)
        validated_data['photo'] = photo # Se reemplaza el id de la foto por el objeto de la foto
        comment = Comment.objects.create(**validated_data)
        return comment

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'user': instance.user.username,
            'photo': instance.photo.id,
            'comment': instance.comment,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at
        }