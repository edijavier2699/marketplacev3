from django.shortcuts import render
import requests
from rest_framework import  status
from rest_framework.response import Response
from .models import Wallet
from .serializers import WalletSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from users.authentication import Auth0JWTAuthentication
from django.conf import settings
from users.models import CustomUser
from rest_framework.views import APIView
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import NotFound
from blockchain.utils import get_token_value_and_balance_all
from property.models import PropertyToken
from .serializers import WalletDashboardSerializer


class WalletListApiView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            wallet = request.user.wallet  
        except ObjectDoesNotExist:
            # Si no existe un wallet, devolver un mensaje de error personalizado
            raise NotFound(detail="No se ha encontrado un wallet para este usuario. Por favor, contacte con la plataforma para solucionarlo.")

        utility_token_address = "0xcB005405C5E27596FD29291Df51cB0b3875Dfde5"  # Dirección del contrato del token
        utility_tokens_info = get_token_value_and_balance_all(wallet.wallet_address, utility_token_address)
        # Se asume que utility_tokens_info es un diccionario que contiene al menos la clave "total_value"

        # Obtener los PropertyToken del usuario con las relaciones optimizadas
        property_tokens = PropertyToken.objects.filter(owner_user_code=request.user).select_related('property_code', 'token_code')

        # Crear una lista con la información de los PropertyToken y calcular el valor total de estos tokens
        property_tokens_info = []
        total_property_tokens_value = 0
        for pt in property_tokens:
            token_price = pt.token_code.token_price
            amount = pt.number_of_tokens
            property_tokens_info.append({
                'image': pt.property_code.image[0],
                'name': pt.property_code.title, 
                'token_value': token_price,
                'amount': amount
            })
            total_property_tokens_value += token_price * amount

        # Calcular el total global sumando el valor total de utility tokens y property tokens
        overall_total_value = utility_tokens_info.get("total_value", 0) + total_property_tokens_value

        # Usar el serializer de Wallet, pasando 'include_balance' en el contexto para decidir si incluir el balance
        wallet_serializer = WalletDashboardSerializer(wallet, context={'include_balance': True})

        # Construir la respuesta con las transacciones, property tokens, y wallet
        response_data = {
            "property_tokens": property_tokens_info,
            "overall_total_value": overall_total_value,
            "utility_tokens": utility_tokens_info,
            "wallet": wallet_serializer.data,  # Siempre incluir los datos del wallet
        }

        return Response(response_data, status=status.HTTP_200_OK)





class SaveWalletInBackend(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        user_wallets = Wallet.objects.filter(wallet_user_id=user_id)  
        
        # Serialize the wallet data
        serializer = WalletSerializer(user_wallets, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)  #



class AddFundsWallet(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        pass



class CheckWalletBalance(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pass