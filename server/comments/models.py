from django.db import models
from users.models import User
from photography.models import *

# Create your models here.
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    photo = models.ForeignKey(Photography, on_delete=models.CASCADE, blank=True, null=True)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, blank=True, null=True)
    comment = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        if self.photo:
            return f'{self.user.username} - {self.photo.title}'
        elif self.collection:
            return f'{self.user.username} - {self.collection.name}'
        return f'{self.user.username} - General Comment'