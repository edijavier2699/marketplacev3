from django.db import models
from django.core.validators import RegexValidator, ValidationError
import re
import requests
from django.conf import settings
from django.utils import timezone


class Wallet(models.Model):
    # Validador para direcciones de Ethereum (0x seguido de 40 caracteres hexadecimales)
    wallet_address_validator = RegexValidator(
        regex=r'^0x[a-fA-F0-9]{40}$',  # Formato de dirección de Ethereum
        message="Invalid Ethereum wallet address. It must start with '0x' followed by 40 hexadecimal characters."
    )
    
    wallet_id = models.CharField(max_length=100, unique=True)  
    wallet_address = models.CharField(max_length=42, unique=True,null=True, blank=True,  validators=[wallet_address_validator], db_index=True)
    wallet_user_id = models.OneToOneField("users.customuser", on_delete=models.CASCADE, related_name="wallet")
    created_at = models.DateTimeField(auto_now_add=True)
    is_enabled = models.BooleanField(default=False)
    allowed_address = models.CharField( null=True, blank=True,  validators=[wallet_address_validator])
    last_balance_sync = models.DateTimeField(null=True, blank=True)  
    balance = models.DecimalField(max_digits=20, decimal_places=8, null=True, blank=True, default=0.0)  
    is_address_allowed =  models.BooleanField(default=False)

    def __str__(self):
        return f'Wallet {self.wallet_address} (ID: {self.wallet_id}) for user {self.wallet_user_id}'

    # Método para validar la dirección de la wallet
    def clean(self):
        if not self.is_valid_wallet_address(self.wallet_address):
            raise ValidationError('Invalid wallet address.')
    
    class Meta:
        indexes = [
            models.Index(fields=['wallet_address']),  # Índice para búsquedas por dirección
            models.Index(fields=['wallet_user_id']),  # Índice para búsquedas por usuario
            models.Index(fields=['wallet_id']),       # Índice para búsquedas por ID
        ]
    
    # Lógica para validar la dirección de la wallet (en caso de que quieras hacer validaciones adicionales)
    @staticmethod
    def is_valid_wallet_address(address):
        # Verifica el formato de la dirección de Ethereum
        return re.match(r'^0x[a-fA-F0-9]{40}$', address) is not None
    
    def update_balance_from_provider(self):
        """
        Método para actualizar el balance desde el proveedor externo y actualizar la base de datos.
        """
        print("aquiii")
        PROVIDER_TOKEN_URL = settings.PROVIDER_TOKEN_URL
        PROVIDER_CLIENT_ID = settings.PROVIDER_CLIENT_ID
        PROVIDER_CLIENT_SECRET = settings.PROVIDER_CLIENT_SECRET
        PROVIDER_USERS_VAULT = settings.PROVIDER_USERS_VAULT

        payload = {
            "clientId": PROVIDER_CLIENT_ID,
            "clientSecret": PROVIDER_CLIENT_SECRET
        }
        headers = {
            "accept": "application/json",
            "content-type": "application/json"
        }

        try:
            # Obtener el token de acceso
            response = requests.post(PROVIDER_TOKEN_URL, json=payload, headers=headers)
            response.raise_for_status()
            access_token = response.json().get("accessToken")

            if not access_token:
                raise ValueError("No access token received from the provider.")
            
            # Obtener el balance de la wallet desde el proveedor
            provider_balance_url = f"https://api.sandbox.palisade.co/v2/vaults/{PROVIDER_USERS_VAULT}/wallets/{self.wallet_id}/balances"
            balance_headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }

            balance_response = requests.get(provider_balance_url, headers=balance_headers)
            balance_response.raise_for_status()
            balance_data = balance_response.json()

            # Validación de la respuesta
            if "balances" not in balance_data or len(balance_data["balances"]) == 0:
                raise ValueError("Balance data not found in the provider's response.")
            
            new_balance = balance_data["balances"][0]["balance"]
            self.balance = new_balance
            self.last_balance_sync = timezone.now()  # Fecha de la última sincronización
            self.save()

            return new_balance

        except Exception as e:
            raise Exception(f"Error actualizando balance: {str(e)}")
        

    def get_balance(self):
        """
        Devuelve el balance sincronizado con el proveedor, actualizándolo si es necesario.
        """
        # Si el balance no se ha sincronizado o ha pasado más de 5 minutos desde la última sincronización
        if not self.last_balance_sync or (timezone.now() - self.last_balance_sync).total_seconds() / 60 > 10:
            self.update_balance_from_provider()
        return self.balance
        
    
    def enable_wallet(self):
        """
        Habilita la wallet.
        """
        PROVIDER_USERS_VAULT = settings.PROVIDER_USERS_VAULT

        self.is_enabled = True
        self.save()

        wallet_settings_url = f"https://api.sandbox.palisade.co/v2/vaults/{PROVIDER_USERS_VAULT}/wallets/{self.wallet_id}/settings"

        payload = { "settings": {
                "enabled": True,
                "rawSigningEnabled": False
            } }
        
        headers = {
            "accept": "application/json",
            "content-type": "application/json"
        }

        try:
            response = requests.put(wallet_settings_url, json=payload, headers=headers)
            if response.status_code == 200:
                return {"detail": "Wallet enabled successfully.", "data": response.json()}
            else:
                raise Exception(f"Failed to enabling the wallet. Status code: {response.status_code}. Response: {response.text}")
        except Exception as e:
            raise Exception(f"An error occurred while enabling the wallet: {str(e)}")
        

