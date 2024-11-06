from django.shortcuts import render
from .serializer import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from users.models import Profile
from photography.models import Photography,Category

# Create your views here.

class SearchAPIView(APIView):
    def get(self, request, *args, **kwargs):
        query = request.query_params.get('q',None)
        if query:
            photos = Photography.objects.filter(Q(title__icontains = query) | Q(description__icontains = query))
            categories = Category.objects.filter(Q(name__icontains = query)) 
            profiles = Profile.objects.filter(Q(user__username__icontains = query)) 
            photo_serializer = PhotographySerializer(photos, many=True)
            categories_serializer = CategorySerializer(categories, many=True)
            profiles_serializer = ProfileSerializer(profiles, many=True)
            return Response({
                'photos':photo_serializer.data,
                'categories':categories_serializer.data,
                'profiles':profiles_serializer.data
            }, status=status.HTTP_200_OK)
        return Response({"error": "No se encontraron resultados"}, status=status.HTTP_400_BAD_REQUEST)