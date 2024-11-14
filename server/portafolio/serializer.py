from rest_framework import serializers
from .models import *
from photography.models import *
from photography.serializer import *
import json
import cloudinary
import cloudinary.uploader

class PortafolioCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortafolioCollection
        fields = ['portafolio', 'collection']
    
class PortafolioSerializer(serializers.ModelSerializer):
    collections = serializers.SerializerMethodField() 
    existing_collections = serializers.ListField(child=serializers.IntegerField(), write_only=True)  # IDs de colecciones existentes
    user = serializers.CharField(source='user.id', read_only=True)
    class Meta:
        model = Portafolio
        fields = ['id', 'name', 'description', 'is_public','existing_collections','collections','user']

    def create(self, validated_data):
        existing_collection_ids = validated_data.pop('existing_collections', []) 
        portafolio = Portafolio.objects.create(**validated_data,user=self.context['request'].user)
        # Asociar colecciones existentes al portafolio
        for collection_id in existing_collection_ids:
            try:
                collection = Collection.objects.get(id=collection_id)
                PortafolioCollection.objects.create(portafolio=portafolio, collection=collection)
            except Collection.DoesNotExist:
                raise serializers.ValidationError(f"Collection with ID {collection_id} does not exist.")

        return portafolio
    
    def get_collections(self, obj):
        # Obtener las colecciones asociadas al portafolio a través del modelo intermedio PortafolioCollection
        portafolio_collections = PortafolioCollection.objects.filter(portafolio=obj)
        
        # Serializar las colecciones relacionadas usando el CollectionSerializer
        return CollectionSerializer([pc.collection for pc in portafolio_collections], many=True).data