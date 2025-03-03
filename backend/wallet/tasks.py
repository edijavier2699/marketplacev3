import logging
from celery import shared_task
import requests
from users.models import CustomUser
from decouple import config
from wallet.models import Wallet

# Configura el logger para que puedas ver los mensajes de log
logger = logging.getLogger(__name__)

# Cargar las variables necesarias
PROVIDER_TOKEN_URL = config('PROVIDER_TOKEN_URL')
PROVIDER_CLIENT_ID = config('PROVIDER_CLIENT_ID')
PROVIDER_CLIENT_SECRET = config('PROVIDER_CLIENT_SECRET')
PROVIDER_WALLET_URL = config('PROVIDER_WALLET_URL')

@shared_task
def create_wallet(user_id):
    logger.info(f"Start creating wallet for user ID: {user_id}")
    
    try:
        # Intentamos obtener el usuario por ID
        user = CustomUser.objects.get(id=user_id)
        logger.info(f"User found: {user.name}")

        # Realizamos la primera solicitud para obtener el token de accesoCONFIG

        headers = {
            "accept": "application/json",
            "content-type": "application/json"
        }
        payload = {
            "clientId": PROVIDER_CLIENT_ID,
            "clientSecret": PROVIDER_CLIENT_SECRET
        }
        
        # Enviamos la solicitud POST para obtener el token de acceso
        response = requests.post(PROVIDER_TOKEN_URL, json=payload, headers=headers)

        # Verificamos si la respuesta es exitosa (status code 200)
        if response.status_code == 200:
            access_token = response.json().get("accessToken")
            if access_token:
                logger.info("Access token obtained successfully.")
                
                # Si el token es válido, intentamos crear la wallet
                wallet_payload = {
                    "blockchain": "ETHEREUM",
                    "keystore": "HSM",
                    "name": f"{user.name}'s T-Wallet ",
                    "description": "Tokunize native wallet for users on Tokunize Marketplace"
                }
                next_headers = {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "Authorization": f"Bearer {access_token}"
                }

                # Enviamos la solicitud para crear la wallet
                wallet_response = requests.post(PROVIDER_WALLET_URL, json=wallet_payload, headers=next_headers)

                # Verificamos si la creación de la wallet fue exitosa
                if wallet_response.status_code == 200:
                    logger.info("Wallet created successfully.")
                    # Obtenemos los datos de la wallet desde la respuesta JSON
                    wallet_data = wallet_response.json()

                    # Almacenamos los datos de la wallet en la base de datos directamente
                    wallet = Wallet.objects.create(
                        wallet_id=wallet_data['id'],
                        wallet_address=wallet_data['address'],
                        wallet_user_id=user,
                        is_enabled=wallet_data['settings']['enabled'],
                        balance=0
                    )

                    # Log de éxito
                    logger.info(f"Wallet stored in the database for user {user} with address: {wallet.wallet_address}")

                else:
                    # Si la respuesta no es exitosa, registramos el error con el detalle de la respuesta
                    logger.error(f"Failed to create wallet. Status code: {wallet_response.status_code}. Response: {wallet_response.text}")
                    return {"success": False, "error": "Failed to create wallet", "details": wallet_response.json()}

            else:
                # Si no obtuvimos el access token, registramos el error
                logger.error(f"Access token not received. Response: {response.text}")
                return {"success": False, "error": "Access token not received", "details": response.json()}

        else:
            # Si la solicitud para obtener el token falló, registramos el error
            logger.error(f"Failed to obtain access token. Status code: {response.status_code}. Response: {response.text}")
            return {"success": False, "error": "Failed to obtain access token", "details": response.json()}

    except CustomUser.DoesNotExist:
        # Si no encontramos al usuario, manejamos ese error
        logger.error(f"User with ID {user_id} does not exist.")
        return {"success": False, "error": f"User with ID {user_id} does not exist."}

    except Exception as e:
        # Cualquier otra excepción inesperada se captura aquí
        logger.error(f"An error occurred: {str(e)}")
        return {"success": False, "error": str(e)}

