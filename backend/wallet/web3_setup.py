# # mi_app/web3_setup.py
# from web3 import Web3
# import json

# # Conectar a tu nodo Ethereum
# # Cambia 'URL_DE_TU_NODO_ETHEREUM' por la URL de tu nodo (por ejemplo, Infura o Alchemy)
# w3 = Web3(Web3.HTTPProvider('https://eth-sepolia.g.alchemy.com/v2/lSlhzHIy1ObjB-wLyHNm4SQVTNsqbQmN'))

# # https://arbitrum-sepolia.infura.io/v3/fa9cae809b5140959aa332484eace960

# # Verifica si la conexión fue exitosa
# if not w3.is_connected():
#     print("Error: No se pudo conectar a la blockchain.")
# else:
#     print("Conexión exitosa a la blockchain.")

# address ="0xaC7fa2bD2994E7dD472514DA12B85fE10B9A493B" 
# balance = w3.eth.get_balance(address)
# print(f'Balance de {address}: {w3.from_wei(balance, "ether")} ETH')

# abi_file_path = "../contracts/property_investment_abi.json"  # Sube un nivel al directorio

# with open(abi_file_path,"r") as abi_file:
#     abi = json.load(abi_file)

# contract_address="0x15a6776EA0968F69303258B0698BAA9833d99Ea8"

# contract = w3.eth.contract(address=contract_address, abi=abi)

# try:
#     result = contract.functions.goal().call()  # Cambia getName por el nombre de la función que deseas llamar
#     print(f'Resultado de la función: {result}')
# except Exception as e:
#     print(f'Error al llamar a la función: {e}')




from web3 import Web3
import json

# Conectar a tu nodo Ethereum
w3 = Web3(Web3.HTTPProvider('https://arbitrum-sepolia.infura.io/v3/fa9cae809b5140959aa332484eace960'))
import requests

pinataUrl ="https://plum-tricky-roadrunner-936.mypinata.cloud/ipfs/bafkreifp6mqrjt6nnp56cittnof6bqvrylh6d3n67s5nrwoyheprjibfxm"


# Verifica si la conexión fue exitosa
if not w3.is_connected():
    print("Error: No se pudo conectar a la blockchain.")
    exit()
else:
    print("Conexión exitosa a la blockchain.")

# Dirección de la wallet y contrato
wallet_address = "0xaC7fa2bD2994E7dD472514DA12B85fE10B9A493B"
token_address = "0x58Cd514D064C1F6334C51847AE907D0b158CcDF2"  # Reemplaza con la dirección del contrato del token
abi_file_path = "../contracts/utilityToken_abi.json"  # Ruta al archivo ABI

try:
    # Hacer un GET request
    response = requests.get(pinataUrl)

    # Verificar el estado de la respuesta
    if response.status_code == 200:
        # Parsear el contenido JSON (si el contenido es JSON)
        data = response.json()
    # Acceder directamente al valor de "Token Value"
        token_value = next(
            (attribute["value"] for attribute in data["attributes"] if attribute["trait_type"] == "Token Value"), 
            None
        )
        
        if token_value is not None:
            print(f'El valor de "Token Value" es: {token_value}')
        else:
            print('No se encontró el valor "Token Value".')
    else:
        print(f"Error: Estado HTTP {response.status_code}")
except requests.exceptions.RequestException as e:
    print(f"Error al hacer el request: {e}")


# Cargar el ABI desde el archivo
with open(abi_file_path, "r") as abi_file:
    abi = json.load(abi_file)  # Cargar el contenido del archivo JSON como un diccionario

# Crear una instancia del contrato
token_contract = w3.eth.contract(address=Web3.to_checksum_address(token_address), abi=abi)

# Obtener el balance del token
raw_balance = token_contract.functions.balanceOf(Web3.to_checksum_address(wallet_address)).call()

# Obtener los decimales del token
decimals = token_contract.functions.decimals().call()

# Convertir el balance al formato correcto
formatted_balance = raw_balance / (10 ** decimals)



print(f"El balance de la wallet {wallet_address} es: {formatted_balance} {raw_balance} tokens")
