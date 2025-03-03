from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework import status
from .authentication import Auth0JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
import json
from django.conf import settings
import requests
from django.http import JsonResponse

@csrf_exempt
def hola_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print("estoy aqui dentro")
        print(data)
        email = data.get('email', 'No email provided')
        name = data.get('name', 'No name provided')

        givenNmae = data.get("givenName")

            # Imprimir o registrar los datos (aquí usaremos print para debug)
        print(f"Email: {email}, Name: {name}, givenname: {givenNmae}")

        return JsonResponse({'message': 'Hola'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
 

class SyncUserView(APIView):
    authentication_classes = [Auth0JWTAuthentication]

    def post(self, request):
        # The user is already authenticated by the time we reach this point
        user = request.user  # This is the CustomUser that was either created or fetched

        # Get additional data from the frontend
        email = request.data.get('email', user.email)
        name = request.data.get('name', user.name)
        role = request.data.get('role', 'investor')  # Default role is 'investor'

        # Update the user's email and name if they were passed from the frontend
        user.email = email
        user.name = name
        user.rol = role
        user.save()

        # Serialize and return the user data
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        

# GET, UPDATE, DELETE USER FROM OUR DATABASE
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

# Para listar todos los usuarios
class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

# Vista para obtener el perfil del usuario autenticado
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

# Configura la URL y credenciales de tu aplicación Auth0
AUTH0_DOMAIN = settings.AUTH0_DOMAIN
AUTH0_CLIENT_ID = settings.AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET = settings.AUTH0_CLIENT_SECRET

# Obtén el token de acceso para la Management API
def get_management_token():
    url = f"https://{AUTH0_DOMAIN}/oauth/token"
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "client_id": AUTH0_CLIENT_ID,
        "client_secret": AUTH0_CLIENT_SECRET,
        "audience": f"https://{AUTH0_DOMAIN}/api/v2/",
        "grant_type": "client_credentials",
        "scope": "read:users update:users"  # Asegúrate de incluir los scopes necesarios

    }

    response = requests.post(url, json=data, headers=headers)
    response.raise_for_status()
    return response.json()['access_token']

# Vista para reenviar el correo de verificación
class ResendEmailVerification(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Obtén el token de acceso
            management_token = get_management_token()
            print(management_token)

            # Llamada a la API de Auth0 para reenviar el correo de verificación
            url = f"https://{AUTH0_DOMAIN}/api/v2/jobs/verification-email"
            headers = {
                "Authorization": f"Bearer {management_token}",
                "Content-Type": "application/json"
            }
            data = {
                "email": email
            }

            response = requests.post(url, json=data, headers=headers)
            response.raise_for_status()

            return Response({"message": "Verification email sent successfully!"}, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            return Response({"error": f"Error sending verification email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    
        

class EmailCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request,email):
        if not email:
            return Response({"error": "Email is required"}, status=400)
        # Verificar si el email ya existe en la base de datos
        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "This email is already in use."}, status=400)

        return Response({"message": "Email is available."}, status=200)
