from django.shortcuts import render
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializer import *
from .models import *

# Create your views here.

# self te permite trabajar con los atributos y métodos de la instancia actual. 
class PublicMenuAPIView(ListAPIView):
    serializer_class = MenuSerializer
    permission_classes = (AllowAny,)
    #El método get_queryset() te permite definir qué datos va a mostrar una 
    # vista basada en clases. Al sobrescribirlo, puedes personalizar la consulta
    # a la base de datos según las condiciones específicas del usuario o la vista, 
    # lo que lo hace extremadamente útil y flexible.
    def get_queryset(self):
        if self.request.user.is_authenticated:
            roles = self.request.user.roles.all()
            
            return Menu.objects.filter(menurol__rol=roles)
        else:
            anonimo_role = Rol.objects.get(name='anonimo')
            return Menu.objects.filter(menurol__rol=anonimo_role)
        
        
class AuthenticatedMenuAPIView(ListAPIView):
    serializer_class = MenuSerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        roles = self.request.user.roluser_set.values_list('rol_id', flat=True)
        return Menu.objects.filter(menurol__rol__in=roles).distinct()