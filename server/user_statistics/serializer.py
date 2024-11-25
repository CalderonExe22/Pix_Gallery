from rest_framework import serializers
from .models import *

class StatisticsSerializar(serializers.ModelSerializer):
    class Meta: 
        model = Statistics
        fields = ['likes_count', 'comments_count', 'views_count','photos_views_count','collections_views_count','following_count','followers_count']