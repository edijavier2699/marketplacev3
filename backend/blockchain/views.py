from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from throttling import CustomAnonRateThrottle  # Asegúrate de que la ruta sea correcta
from rest_framework.throttling import UserRateThrottle
from django.views.decorators.cache import cache_page
from rest_framework.views import APIView
from .models import Token
from rest_framework.pagination import PageNumberPagination
from users.authentication import Auth0JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .serializers import TokenSerializer


# VIEWS FRO TOKEN MODEL
class TokenListView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TokenSerializer 

    def get(self, request):
        tokens = Token.objects.all()  # Ejemplo de obtener datos
        serializer = self.serializer_class(tokens, many=True)  # Serializamos los datos
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Aquí validamos y procesamos los datos enviados en la solicitud POST
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Guarda el nuevo token si los datos son válidos
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)