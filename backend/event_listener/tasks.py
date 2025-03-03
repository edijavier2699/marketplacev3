from celery import shared_task
from web3 import Web3
from django.conf import settings
import redis
import os
import json

# # Función para cargar el ABI
# def load_abi():
#     script_dir = os.path.dirname(os.path.abspath(__file__))
#     abi_file_path = os.path.join(script_dir, "..", "contracts", "token_to_token_pool_abi.json")

#     if not os.path.exists(abi_file_path):
#         print(f"Archivo ABI no encontrado: {abi_file_path}")
#         exit()

#     with open(abi_file_path, "r") as abi_file:
#         return json.load(abi_file)

# # Cargar ABI
# POOL_ABI = load_abi()

# # Conexión a Redis
# redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

# @shared_task
# def listen_for_pool_events():
#     """
#     Escucha los eventos de la pool seleccionada y procesa las transacciones.
#     """
#     # Dirección del contrato dummy
#     pool_address = "0x7A409697C26aaA26b8c22f9165640634ddbF3F98"

#     # Conexión a la red Arbitrum Sepolia
#     w3 = Web3(Web3.HTTPProvider("https://arbitrum-sepolia.infura.io/v3/fa9cae809b5140959aa332484eace960"))

#     if not w3.is_connected():
#         print("Error al conectar a la red Arbitrum Sepolia")
#         return

#     print("Conexión exitosa a la red Arbitrum Sepolia")

#     # Crear el contrato
#     contract = w3.eth.contract(address=pool_address, abi=POOL_ABI)

#     # Obtener la firma del evento SentToBackend
#     event_abi = contract.events.SentToBackend().abi
#     event_signature = f"{event_abi['name']}({','.join(input['type'] for input in event_abi['inputs'])})"
#     event_topic = "0x" + Web3.keccak(text=event_signature).hex()

#     # Obtener el bloque más reciente
#     last_block = w3.eth.block_number

#     print("Escuchando eventos SentToBackend...")

#     try:
#         while True:
#             # Obtener los eventos desde el último bloque
#             events = w3.eth.get_logs({
#                 'fromBlock': last_block,
#                 'toBlock': 'latest',
#                 'address': pool_address,
#                 'topics': [event_topic]
#             })

#             # Procesar los eventos
#             for event in events:
#                 decoded_event = contract.events.SentToBackend().process_log(event)
#                 event_args = decoded_event['args']
#                 print(f"Evento recibido: {event_args}")

#                 # Guardar el evento en Redis
#                 redis_client.rpush("pool_events", json.dumps(event_args))

#             # Actualizar el último bloque
#             last_block = w3.eth.block_number + 1

#     except Exception as e:
#         print(f"Error al procesar eventos: {str(e)}")








   # Crear un filtro de eventos para escuchar 'PurchaseEvent'
    # events = contract.events.SentToBackend.get_logs(
    #             from_block="latest"  # Escuchar desde el último bloque
    #         )

    # Escucha los eventos y procesa los nuevos eventos
    # while True:
    #     for event in events:
    #         process_event(dummy_pool, event, r)



        # handle_purchase(pool, event_data, r)





# def handle_purchase(pool, event_data, r):
#     """
#     Maneja la transacción de compra y actualiza el balance del usuario.
#     """
#     user_address = event_data['user']
#     amount = event_data['amount']
    
#     # Verificar si ya hemos procesado este evento (prevención de duplicados)
#     event_hash = event_data['transactionHash'].hex()  # Obtiene el hash de la transacción
#     if not r.get(event_hash):
#         # Marcar el evento como procesado en Redis
#         r.set(event_hash, 'processed')

#         try:
#             # Buscar al usuario por su dirección de Ethereum
#             user = User.objects.get(address=user_address)
#             wallet = Wallet.objects.get(user=user)

#             # Actualizar el balance del usuario
#             wallet.balance += amount
#             wallet.save()

#             # Registrar la transacción en la base de datos
#             Transaction.objects.create(
#                 user=user,
#                 pool=pool,
#                 amount=amount,
#                 status='successful'
#             )
#         except User.DoesNotExist:
#             print(f"Usuario no encontrado: {user_address}")
#         except Wallet.DoesNotExist:
#             print(f"Cartera no encontrada para el usuario: {user_address}")




import aiohttp
import asyncio
import json
import os
from web3 import Web3

# Función para cargar el ABI
def load_abi():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    abi_file_path = os.path.join(script_dir, "..", "contracts", "token_to_token_pool_abi.json")

    if not os.path.exists(abi_file_path):
        print(f"Archivo ABI no encontrado: {abi_file_path}")
        exit()

    with open(abi_file_path, "r") as abi_file:
        return json.load(abi_file)

# Cargar ABI
POOL_ABI = load_abi()
w3 = Web3()

# Dirección del contrato en la red Arbitrum Sepolia
contract_address = "0x7A409697C26aaA26b8c22f9165640634ddbF3F98"



# Función para decodificar el evento
def decode_event(log):
    try:
        # Calcular la firma del evento SentToBackend(address,uint256)
        event_signature = "SentToBackend(address,uint256)"
        event_signature_hash = Web3.keccak(text=event_signature)

        # Verificar si el hash del evento coincide con el primer topic
        if log["topics"][0] == "0x332d00e18f2b35d5c71fc063acfaa4300cf052a823d3fa199e29a155d6975e72":
            print(f"¡Coinciden los hashes!")

            # Extraer la dirección del wallet desde el segundo topic
            wallet = Web3.toChecksumAddress("0x" + log["topics"][1][26:])  # Extrae los últimos 40 caracteres
            print(f"Dirección del wallet: {wallet}")


            # Construir el evento decodificado
            decoded_event = {
                "event": "SentToBackend",
                "wallet": wallet,
            }

            print(f"Evento decodificado: {decoded_event}")
            return decoded_event
        else:
            print("Evento no reconocido.")
            return None

    except Exception as e:
        print(f"Error al decodificar el evento: {e}")
        return None


# Conexión WebSocket con desactivación de la verificación SSL
async def connect_to_websocket():
    connector = aiohttp.TCPConnector(ssl=False)

    async with aiohttp.ClientSession(connector=connector) as session:
        async with session.ws_connect("wss://arbitrum-sepolia.infura.io/ws/v3/fa9cae809b5140959aa332484eace960") as ws:
            subscription_request = {
                "jsonrpc": "2.0",
                "method": "eth_subscribe",
                "params": [
                    "logs",
                    {
                        "address": contract_address,
                        "topics": [None]
                    }
                ],
                "id": 1
            }

            await ws.send_json(subscription_request)
            print(f"Escuchando eventos del contrato {contract_address}")

            while True:
                response = await ws.receive_json()

                if "params" in response and "result" in response["params"]:
                    log = response["params"]["result"]
                    decoded_event = decode_event(log)
                    if decoded_event:
                        print("Evento decodificado:", decoded_event)
                    else:
                        print("Evento no reconocido.")
                        print(log)

                if response.get("error"):
                    print(f"Error: {response['error']}")
                    break
