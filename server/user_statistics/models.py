from django.db import models
from users.models import User
# Create your models here.

class Statistics(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name="statistics")
    likes_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    followers_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)  
    photos_views_count = models.PositiveIntegerField(default=0)
    collections_views_count = models.PositiveIntegerField(default=0)
    def __str__(self):
        return f"Estadísticas de {self.user.username}"