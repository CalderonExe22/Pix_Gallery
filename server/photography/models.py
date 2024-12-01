from django.db import models
from users.models import User
from cloudinary.models import CloudinaryField
from cloudinary.uploader import destroy
# Create your models here.

class Photography(models.Model): 
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = CloudinaryField('image')
    precio = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    is_free = models.BooleanField(default=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.is_free:
            self.precio = 0  # Si es gratis, el precio es 0
        super().save(*args, **kwargs)
        
    def delete(self, *args, **kwargs):
        # Eliminar la imagen de Cloudinary
        if self.image:
            public_id = self.image.public_id  # Extraer el ID público de la imagen
            destroy(public_id)  # Eliminar de Cloudinary
        # Llamar al método delete original para eliminar el objeto de la BD
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.title
    
class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name
    
class CategoryPhotography(models.Model):
    photography = models.ForeignKey(Photography, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    
    def __str__(self):
        return f'{self.photography.title} - {self.category.name}'
    
class Collection(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=True)
    def __str__(self):
        return self.name 

class CategoryCollection(models.Model):
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    
    def __str__(self):
        return f'{self.collection.name} - {self.category.name}'
    
    
class CollectionPhotography(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    photography = models.ForeignKey(Photography, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    
    def __str__(self):
        return f'{self.photography.title} - {self.collection.name}'
        
    class Meta:
        unique_together = ('collection', 'photography', 'user')
        

class Tag(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
    
    
class PhotographyTag(models.Model):
    photography = models.ForeignKey(Photography, on_delete=models.CASCADE, related_name='photography_tags')
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    def __str__(self):
        return f'{self.photography.title} - {self.tag.name}'
    
class ExifData(models.Model):
    photography = models.OneToOneField(Photography, on_delete=models.CASCADE, related_name='exif_data')
    camera = models.CharField(max_length=255, blank=True, null=True)
    lens = models.CharField(max_length=255, blank=True, null=True)
    focal_length = models.FloatField(blank=True, null=True)
    shutter_speed = models.FloatField(blank=True, null=True)
    aperture = models.FloatField(blank=True, null=True)
    iso = models.IntegerField(blank=True, null=True)