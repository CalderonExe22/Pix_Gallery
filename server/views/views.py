from rest_framework import viewsets, status
from .models import View
from .serializer import ViewSerializer
from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class ViewApiView(viewsets.ModelViewSet):
    queryset = View.objects.all()
    serializer_class = ViewSerializer
    permission_classes = [IsAuthenticated]

    @action (detail=False, methods=['get'], permission_classes=[AllowAny])
    def get_all_views(self, request):
        # Endpoint para obtener todas las views sin filtrar por el usuario
        all_views = View.objects.all()
        serializer = self.get_serializer(all_views, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action (detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_user_views(self, request):
        # Endpoint para obtener todas las vistas de un usuario
        user_views = View.objects.filter(user=request.user)
        serializer = self.get_serializer(user_views, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_permissions(self):
        if self.action in ['retrieve','update', 'destroy', 'get_user_views']:
            self.permission_classes = [IsAuthenticated]
        elif self.action == 'get_all_views':
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)