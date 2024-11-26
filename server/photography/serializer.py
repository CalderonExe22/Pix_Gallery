from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework import serializers
from .models import *
from users.models import User
from users.serializer import UserSerializer

class ExifDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExifData
        fields = ['camera', 'lens', 'focal_length', 'shutter_speed', 'aperture', 'iso']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']

class TagsForFilter (serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id','name']

class SerializerPhotography(ModelSerializer):
    image_url = serializers.SerializerMethodField()
    category = serializers.IntegerField(write_only=True)
    exif_data = ExifDataSerializer(read_only=True)
    user = UserSerializer(read_only=True) 
    tags = serializers.ListField(child=serializers.CharField(), required=False)
    camera = serializers.CharField(required=False, allow_blank=True,write_only=True)
    lens = serializers.CharField(required=False, allow_blank=True,write_only=True)
    focal_length = serializers.FloatField(required=False, allow_null=True,write_only=True)
    shutter_speed = serializers.FloatField(required=False, allow_null=True,write_only=True)
    aperture = serializers.FloatField(required=False, allow_null=True,write_only=True)
    iso = serializers.IntegerField(required=False, allow_null=True,write_only=True)  
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    view_count = serializers.SerializerMethodField()
    tags_photo = serializers.SerializerMethodField()
    class Meta:
        model = Photography
        fields = ['id','user', 'title', 'description', 'image','image_url','category', 
            'precio', 'is_free','is_public', 'created_at','tags','exif_data', 'camera', 'lens',
            'focal_length', 'shutter_speed', 'aperture', 'iso','likes_count', 'comments_count',
            'view_count','tags_photo'
        ]
    
    def get_tags_photo(self, obj):
        # Usa el related_name para acceder a los tags relacionados
        photography_tags = obj.photography_tags.all()  # Relación photography_tags
        tags = [photography_tag.tag for photography_tag in photography_tags]
        return TagSerializer(tags, many=True).data
    
    def get_likes_count(self, obj):
        return obj.like_set.count()

    def get_comments_count(self, obj):
        return obj.comment_set.count()

    def get_view_count(self, obj):
        return obj.view_set.count()
    
    def get_image_url(self, obj):
        return obj.image.url if obj.image else None
    
    def validate(self, data):
        if data['is_free'] and data.get('precio', 0) > 0:
            raise ValidationError("Las fotos gratuitas no deben tener un precio.")
        if not data['is_free'] and (data.get('precio') is None or data['precio'] <= 0):
            raise ValidationError("Las fotos no gratuitas deben tener un precio mayor que 0.")
        return data
    
    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        camera = validated_data.pop('camera', '')
        lens = validated_data.pop('lens', '')
        focal_length = validated_data.pop('focal_length', None)
        shutter_speed = validated_data.pop('shutter_speed', None)
        aperture = validated_data.pop('aperture', None)
        iso = validated_data.pop('iso', None)
        category_id = validated_data.pop('category')
        category = Category.objects.get(id=category_id)
        
        photography = Photography.objects.create(**validated_data)
        
        CategoryPhotography.objects.create(category=category, photography=photography)
        
        #crear los tags
        for tag_name in tags:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            PhotographyTag.objects.create(photography=photography, tag=tag)

        ExifData.objects.create(
            photography=photography,
            camera=camera,
            lens=lens,
            focal_length=focal_length,
            shutter_speed=shutter_speed,
            aperture=aperture,
            iso=iso
        )
        
        return photography
    
class CollectionPhotographySerializer(ModelSerializer):
    photography = SerializerPhotography()

    class Meta:
        model = CollectionPhotography
        fields = ['photography']
    
class CollectionSerializer(serializers.ModelSerializer):
    photos = serializers.SerializerMethodField()  # Utilizamos SerializerMethodField para obtener las fotos relacionadas
    photos_input = serializers.ListField(
        child=serializers.IntegerField(),  # Usamos un campo de tipo lista de enteros para enviar los IDs de las fotos
        write_only=True  # Este campo solo se utilizará para la escritura (en el create)
    )
    user = serializers.SerializerMethodField()
    category = serializers.IntegerField(write_only=True)
    class Meta:
        model = Collection
        fields = ['id', 'name', 'description','is_public' ,'photos', 'category','user','photos_input']  # Añadimos `photos_input` para crear las fotos y `photos` para leerlas

    def get_user(self, obj):
        collection_photography = CollectionPhotography.objects.filter(collection=obj).first()
        if collection_photography:
            return UserSerializer(collection_photography.user).data
        return None

    def get_photos(self, obj):
        # Obtener todas las fotos asociadas a la colección a través del modelo intermedio CollectionPhotography
        collection_photographies = CollectionPhotography.objects.filter(collection=obj)
        
        # Serializar las fotos usando un serializer específico para el modelo Photography
        photography_serializer = SerializerPhotography(
            [cp.photography for cp in collection_photographies],
            many=True
        )
        return photography_serializer.data
    
    def create(self, validated_data):
        photos_data = validated_data.pop('photos_input', [])# Recibimos el campo `photos_input` para agregar las fotos a la colección
        category_id = validated_data.pop('category')
        
        collection = Collection.objects.create(**validated_data)

        category = Category.objects.get(id=category_id)
        
        CategoryCollection.objects.create(category=category, collection=collection)
        
        # Asociamos las fotos a la colección utilizando los IDs recibidos
        for photo_id in photos_data:
            try:
                photography = Photography.objects.get(id=photo_id)
                CollectionPhotography.objects.create(
                    collection=collection,
                    photography=photography,
                    user=self.context['request'].user
                )
            except Photography.DoesNotExist:
                raise serializers.ValidationError(f"Fotografía con id {photo_id} no existe.")
        
        return collection

    def update(self, instance, validated_data):
        category_id = validated_data.pop('category', None)
        
        for atrr, value in validated_data.items():
            setattr(instance, atrr, value)
        instance.save()
        
        if category_id:
            category = Category.objects.get(id=category_id)
            CategoryCollection.objects.filter(collection=instance).delete()
            CategoryCollection.objects.create(category=category, collection=instance)
        
        return instance 

class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class CategoryPhotographySerializer(ModelSerializer):
    class Meta:
        model = CategoryPhotography
        fields = ['id', 'photography', 'category']
        
        
