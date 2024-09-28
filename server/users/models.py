from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField
# Create your models here.

class User(AbstractUser): 
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self) -> str:
        return self.email

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    profile_photo = CloudinaryField('image')
    website = models.URLField(blank=True)
    
    def __str__(self):
        return f'{self.user.username} Profile'
    
class Rol(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name
    
class RolUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)
    
    def __str__(self):
        return f'{self.user.email} - {self.rol.name}'