from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from rest_framework import status
import requests

# Create your views here.

class ImaggaTagsAPIView(APIView):

    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        if 'image' not in request.FILES:
            return Response({"error": "No se proporcionó una imagen."}, status=400)

        file = request.FILES['image']
        API_KEY = 'acc_6846ab175d053b6'
        API_SECRET = '9a1e78edb34cc5cd7370f18c1ffb1417'
        params = {"language": "es"}

        tags_url = "https://api.imagga.com/v2/tags"
        response = requests.post(tags_url, files={"image": file}, auth=(API_KEY, API_SECRET), params=params)

        if response.status_code == 200:
            tags_data = response.json()
            tags = [
                {"etiqueta": t['tag']['es'], "confianza": t['confidence']}
                for t in tags_data['result']['tags'] if 'es' in t['tag']
            ]
            return Response({"tags": tags})
        else:
            return Response({"error": response.text}, status=response.status_code)
        
        
class ImaggaModerationAPIView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        if 'image' not in request.FILES:
            return Response({"error": "No se proporcionó una imagen."}, status=400)

        file = request.FILES['image']
        API_KEY = 'acc_6846ab175d053b6'
        API_SECRET = '9a1e78edb34cc5cd7370f18c1ffb1417'

        moderation_url = "https://api.imagga.com/v2/categories/adult_content"
        response = requests.post(moderation_url, files={"image": file}, auth=(API_KEY, API_SECRET))

        if response.status_code == 200:
            print(response.json())
            moderation_data = response.json()
            nsfw_score = moderation_data['result']['categories'][0]['confidence']
            return Response({
                "moderation": {
                    "nsfw_score": nsfw_score,
                    "is_inappropriate": nsfw_score > 0.5
                }
            },status=status.HTTP_200_OK)
        else:
            return Response({"error": response.text}, status=response.status_code)