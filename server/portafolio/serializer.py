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
    existing_photos = serializers.PrimaryKeyRelatedField(queryset=Photography.objects.all(), many=True, required=False, write_only=True)
    existing_collections = serializers.PrimaryKeyRelatedField(queryset=Collection.objects.all(), many=True, required=False, write_only=True)
    class Meta: 
        model = Portafolio
        fields = ['id', 'name','description', 'is_public', 'existing_photos', 'existing_collections']
        
    def create(self, validated_data):
        existing_photos = validated_data.pop('existing_photos', [])
        existing_colections = validated_data.pop('existing_collections', [])
        collections_data = self.context['request'].data.get('collections')
        photos_data = self.context['request'].data.get('photos')
        user = self.context['request'].user

        # Crear el portafolio
        portafolio = Portafolio.objects.create(**validated_data)

        # Procesar colecciones existentes
        if existing_colections:
            for existing_collection in existing_colections:
                collection_instance = Collection.objects.get(id=existing_collection.id)  # Asegúrate de obtener la instancia correcta
                PortafolioCollection.objects.create(portafolio=portafolio, collection=collection_instance)

        # Procesar nuevas colecciones
        if collections_data:
            collections_data = json.loads(collections_data)
            for collection_data in collections_data:
                collection, created = Collection.objects.get_or_create(**collection_data)
                PortafolioCollection.objects.create(portafolio=portafolio, collection=collection)

        # Procesar nuevas fotos
        if photos_data:
            photos_data = json.loads(photos_data)
            for index, photo_data in enumerate(photos_data):
                image = self.context['request'].FILES.get(f'photos[{index}][image]')
                if image:
                    cloudinary_response = cloudinary.uploader.upload(image)
                    photo_data['image'] = cloudinary_response['secure_url']
                photo, created = Photography.objects.get_or_create(**photo_data, user=user)
                CollectionPhotography.objects.create(photography=photo, collection=collection, user=user)

        # Asociar fotos existentes a la colección
        if existing_photos:
            for photo in existing_photos:  # Aquí ya son objetos Photography
                CollectionPhotography.objects.create(photography=photo, collection=collection, user=user)

        return portafolio