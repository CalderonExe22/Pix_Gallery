import mercadopago
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework import viewsets, status
from .models import Payment
from .serializer import PaymentSerializer
from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class PaymentApiView(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    @action (detail=False, methods=['get'], permission_classes=[AllowAny])
    def get_all_payments(self, request):
        all_payments = Payment.objects.all()
        serializer = self.get_serializer(all_payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action (detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_user_payments(self, request):
        user_payments = Payment.objects.filter(user=request.user)
        serializer = self.get_serializer(user_payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_permissions(self):
        if self.action in ['retrieve','update', 'destroy', 'get_user_payments']:
            self.permission_classes = [IsAuthenticated, IsOwner]
        elif self.action == 'get_all_payments':
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@csrf_exempt # Desactivar proteccion CSRF
def create_preference(request):
    if request.method == "POST":
        data = json.loads(request.body)
        title = data.get("title")
        precio = float(data.get('precio'))
        id_payment = data.get('id_payment')
        type_payment = data.get('type_payment')
        
        sdk = mercadopago.SDK("APP_USR-4215764096973588-103114-86c962f9d8e4e4e26bb81ea4ccf085a5-2060264761") # Access Token
        preference_data = {
            "items": [
                {
                    "title": title,
                    "quantity": 1,
                    "currency_id": "ARS",
                    "unit_price": precio,
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
            "external_reference": f"{id_payment}-{type_payment}",
            "binary_mode": True,
        }
        preference = sdk.preference().create(preference_data)
        return JsonResponse(preference)
    else:
        return JsonResponse({"error": "Metodo no permitido"}, status=400)