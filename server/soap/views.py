from django.http import JsonResponse
from .soap_service import list_countries  # Nombre exacto de la función y archivo

def lists_countries(request):
    countries = list_countries()
    return JsonResponse(countries, safe=False)