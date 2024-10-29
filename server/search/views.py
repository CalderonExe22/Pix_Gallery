from django.shortcuts import render
from .serializer import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from users.models import Profile
from photography.models import *

# Create your views here.

class SearchAPIView(APIView):
    def get(self, request, *args, **kwargs):
        query = request.query_params.get('q',None)
        if query:
            photos = Photography.objects.filter(Q(title__icontains = query) | Q(description__icontains = query))
            categories = Category.objects.filter(Q(name__icontains = query)) 
            profiles = Profile.objects.filter(Q(user__username__icontains = query)) 
            collections = Collection.objects.filter(
                Q(name__icontains=query) | 
                Q(collectionphotography__photography__title__icontains=query) | 
                Q(collectionphotography__photography__description__icontains=query)
            ).distinct()
            photo_serializer = PhotographySerializer(photos, many=True)
            categories_serializer = CategorySerializer(categories, many=True)
            profiles_serializer = ProfileSerializer(profiles, many=True)
            collection_serializer = CollectionSerializer(collections, many=True)
            return Response({
                'photos':photo_serializer.data,
                'categories':categories_serializer.data,
                'profiles':profiles_serializer.data,
                'collections': collection_serializer.data
            }, status=status.HTTP_200_OK)
        return Response({"error": "No se encontraron resultados"}, status=status.HTTP_400_BAD_REQUEST)