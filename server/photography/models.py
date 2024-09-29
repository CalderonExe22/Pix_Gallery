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