import mercadopago
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.viewsets import ModelViewSet
from .models import Payment
from .serializer import PaymentSerializer
from rest_framework.permissions import IsAuthenticated

class PaymentApiView(ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

@csrf_exempt # Desactivar proteccion CSRF
def create_preference(request):
    if request.method == "POST":
        data = json.loads(request.body)
        title = data.get("title")
        price = float(data.get('price'))
        external_reference = data.get('id_photo')
        
        sdk = mercadopago.SDK("APP_USR-4215764096973588-103114-86c962f9d8e4e4e26bb81ea4ccf085a5-2060264761") # Access Token
        preference_data = {
            "items": [
                {
                    "title": title,
                    "quantity": 1,
                    "currency_id": "ARS",
                    "unit_price": price,
                }
            ],
            "back_urls": {
                "success": "http://localhost:5173/payments/success",
                "failure": "http://localhost:5173/payments/failure",
                "pending": "http://localhost:5173/payments/pending"
            },
            "payment_methods": {
                "excluded_payment_methods" : [
                    {
                        "id" : "argencard"
                    },
                    {
                        "id" : "cabal"
                    },
                    {
                        "id" : "cmr"
                    },
                    {
                        "id" : "cencosud"
                    },
                    {
                        "id" : "cordobesa"
                    },
                    {
                        "id" : "diners"
                    },
                    {
                        "id" : "naranja"
                    },
                    {
                        "id" : "tarshop"
                    },
                    {
                        "id" : "debcabal"
                    },
                    {
                        "id" : "maestro"
                    }
                ],
                "excluded_payment_types" : [
                    {
                        "id" : "ticket"
                    }
                ],
                "installments" : 6
            },
            "external_reference": external_reference,
            "binary_mode": True,
        }
        preference = sdk.preference().create(preference_data)
        return JsonResponse(preference)
    else:
        return JsonResponse({"error": "Metodo no permitido"}, status=400)