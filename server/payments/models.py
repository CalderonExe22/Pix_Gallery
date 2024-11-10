from django.db import models
from users.models import User
from photography.models import Photography

# Create your models here.
class Payment(models.Model):
    payment_id = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    photo = models.ForeignKey(Photography, on_delete=models.CASCADE)
    status = models.CharField(max_length=100)
    payment_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'{self.user.username} - {self.photo.title} - {self.status}'