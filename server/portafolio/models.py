from django.db import models
from users.models import User
from photography.models import Collection
# Create your models here.

class Portafolio(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
class PortafolioCollection(models.Model):
    portafolio = models.ForeignKey(Portafolio, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    
    def __str__(self):
        return f'{self.portafolio.name} - {self.collection.name}'