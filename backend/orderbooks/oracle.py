from web3 import Web3
import requests
import os
import json
import time

# Conexión al nodo de la blockchain
w3 = Web3(Web3.HTTPProvider("https://sepolia.infura.io/v3/fa9cae809b5140959aa332484eace960"))

# Verificar conexión
if w3.is_connected():
    print("Conexión exitosa a la red Ethereum")
else:
    print("Error al conectar a la red Ethereum")
    exit()

    

# Dirección del contrato
contract_address = "0x2ed4441cFA236455056EeA1D904Dc1bddd55f648"

# Función para cargar el ABI desde un archivo
def load_abi():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    abi_file_path = os.path.join(script_dir, "..", "contracts", "property_scrow_abi.json")

    if not os.path.exists(abi_file_path):
        print(f"Archivo ABI no encontrado: {abi_file_path}")
        exit()

    with open(abi_file_path, "r") as abi_file:
        return json.load(abi_file)

# Cargar ABI
abi = load_abi()

# Crear el contrato en Web3
contract = w3.eth.contract(address=contract_address, abi=abi)

# Función para escuchar eventos TradeExecuted
def listen_for_trade_executed():
    print("Escuchando eventos TradeExecuted...")

    while True:
        try:
            # Obtener los eventos TradeExecuted desde el bloque más reciente
            events = contract.events.TradeExecuted.get_logs(
                from_block="latest"  # Escuchar desde el último bloque
            )
            
            # Procesar los eventos obtenidos
            for event in events:
                event_args = event['args']  # Decodificar los argumentos del evento
                print(f"Evento TradeExecuted recibido: {event_args}")
                # Procesar en el backend
                update_order_in_backend(event_args)
        except Exception as e:
            print(f"Error al procesar eventos: {str(e)}")
        
        time.sleep(2)


# Función para actualizar el backend con los datos del evento
def update_order_in_backend(event_args):
    data = dict(event_args)


    try:
        response = requests.post(
            "http://localhost:8000/orderbooks/blockhain/trade-executed/",
            json=data
        )

        if response.status_code == 201:
            print("Orden actualizada y trade creado correctamente.")
        else:
            print(f"Error al actualizar la orden: {response.text}")
    except Exception as e:
        print(f"Error en la solicitud al backend: {str(e)}")

if __name__ == "__main__":
    listen_for_trade_executed()




    # path('order/<str:referenceNumber>/status/<str:order_status>/', OrderDetailView.as_view(), name='update-order-status'),


# Evento TradeExecuted recibido: AttributeDict({'sellOfferId': 3, 'buyOfferId': 3, 'buyer': '0xD8C09b3D5073C4EF27a776c7240B6D4358200185', 'seller': '0xaC7fa2bD2994E7dD472514DA12B85fE10B9A493B', 'totalPrice': 117, 'tokensTransferred': 1})