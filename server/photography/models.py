from django.db import models
from users.models import User
from cloudinary.models import CloudinaryField

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

    def __str__(self):
        return self.title
    
class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = CloudinaryField('image')
    
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
    def __str__(self):
        return self.name
    
class CollectionPhotography(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    photography = models.ForeignKey(Photography, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)