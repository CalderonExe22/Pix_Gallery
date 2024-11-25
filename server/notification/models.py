from django.db import models
from users.models import User
from photography.models import *
# Create your models here.

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    photography = models.ForeignKey(Photography, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    
    def __str__(self):
        return f'Notification for {self.user.username}'
    