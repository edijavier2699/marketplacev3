from rest_framework import serializers
from .models import Wallet

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['wallet_address', 'balance', 'wallet_user_id', 'created_at', 'updated_at']  # Ensure wallet_user_id is included
        read_only_fields = ['created_at']  # Estos campos no deben ser modificados

    def validate_wallet_address(self, value):
        # Validar la dirección de la wallet
        if not Wallet.is_valid_wallet_address(value):
            raise serializers.ValidationError("Invalid Ethereum wallet address.")
        return value


class WalletDashboardSerializer(serializers.ModelSerializer):
    # Campo adicional para balance, utilizando el método 'get_balance' del modelo Wallet
    balance = serializers.SerializerMethodField()

    class Meta:
        model = Wallet
        fields = ['wallet_address', 'balance', 'is_enabled','is_address_allowed']  # Incluir los campos que deseas devolver

    def get_balance(self, obj):
        # Llamamos al método get_balance() del modelo para obtener el balance actual
        return obj.get_balance()  # Esto retorna el balance sincronizado o actual