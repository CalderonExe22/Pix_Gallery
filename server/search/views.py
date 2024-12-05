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
            # Fotografías: Búsqueda en título, descripción, categorías y tags
            photos = Photography.objects.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(categoryphotography__category__name__icontains=query) |  # Categorías
                Q(photography_tags__tag__name__icontains=query),  # Tags
                is_public=True  # Solo fotografías públicas
            ).distinct()
            
            profiles = Profile.objects.filter(Q(user__username__icontains = query)) 
            
            # Colecciones: Búsqueda en nombre, descripción, categorías y tags asociados
            collections = Collection.objects.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(categorycollection__category__name__icontains=query) |  # Categorías
                Q(collectionphotography__photography__photography_tags__tag__name__icontains=query),  # Tags
                is_public=True  # Solo colecciones públicas
            ).distinct()
            
            photo_serializer = PhotographySerializer(photos, many=True)
            profiles_serializer = ProfileSerializer(profiles, many=True)
            collection_serializer = CollectionSerializer(collections, many=True)
            return Response({
                'photos':photo_serializer.data,
                'profiles':profiles_serializer.data,
                'collections': collection_serializer.data
            }, status=status.HTTP_200_OK)
        return Response({"error": "No se encontraron resultados"}, status=status.HTTP_400_BAD_REQUEST)