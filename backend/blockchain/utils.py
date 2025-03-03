import requests
from web3 import Web3
import json
import os
from decimal import Decimal, ROUND_DOWN


def get_token_contract(token_address, abi_path):
    """
    Inicializa y devuelve una instancia del contrato de Utility Tokens.
    """
    w3 = Web3(Web3.HTTPProvider('https://arbitrum-sepolia.infura.io/v3/fa9cae809b5140959aa332484eace960'))
    base_dir = os.path.dirname(os.path.abspath(__file__))
    abi_file_path = os.path.join(base_dir, f"../contracts/{abi_path}.json")
    with open(abi_file_path, "r") as abi_file:
        abi = json.load(abi_file)
    return w3.eth.contract(address=Web3.to_checksum_address(token_address), abi=abi)



def get_usdc_balance(wallet_address):
    usdc_address = "0xBb9FfBB3698422EEF326c7680b817D741e6A7a54"  # Dirección oficial de USDC en Ethereum
    usdc_contract = get_token_contract(usdc_address, "mockUsdc_abi")

    try:
        # Obtener el balance de USDC de la billetera
        balance = usdc_contract.functions.balanceOf(Web3.to_checksum_address(wallet_address)).call()

        # Obtener el número de decimales del token USDC
        decimals = usdc_contract.functions.decimals().call()

        # Ajustar el balance por los decimales del token
        adjusted_balance = balance / (10 ** decimals)

        return adjusted_balance
    except Exception as e:
        print(f"Error al obtener el balance de USDC: {e}")
        return None


def get_token_value_and_balance(wallet_address, token_address):
    """
    Obtiene el valor total de los Utility Tokens en la billetera del usuario.
    """
    # Obtener la instancia del contrato
    token_contract = get_token_contract(token_address, "utilityToken_abi")
    decimals = token_contract.functions.decimals().call()

    # Obtener los batches
    batch_ids, amounts, metadatas = token_contract.functions.getBatchesByAccount(Web3.to_checksum_address(wallet_address)).call()

    total_value = Decimal(0)  # Asegurar que sea Decimal
    for batch_id, amount, metadata in zip(batch_ids, amounts, metadatas):

        # Obtener información desde IPFS
        response = requests.get(f"https://plum-tricky-roadrunner-936.mypinata.cloud/ipfs/{metadata}/")
        if response.status_code == 200:
            data = response.json()
            token_value = next((attr["value"] for attr in data["attributes"] if attr["trait_type"] == "Token Value"), None)

            if token_value is None:
                continue  # Saltar batch sin Token Value

            # Convertir valores
            adjusted_amount = Decimal(amount) / (10 ** decimals)
            token_value_decimal = Decimal(token_value)


            # Calcular total
            total_value += token_value_decimal * adjusted_amount
        else:
            continue

    # Redondear y retornar
    total_value = total_value.quantize(Decimal('0.01'), rounding=ROUND_DOWN)
    return total_value




    


def select_utility_tokens(wallet_address, token_address, required_amount):
    """
    Selecciona los Utility Tokens necesarios para cubrir la cantidad requerida.
    Prioriza los tokens con mayor valor, usa tokens completos y calcula la fracción del token restante si es necesario.
    Devuelve la suma total de las cantidades de los tokens seleccionados.
    """
    # Obtener la instancia del contrato
    token_contract = get_token_contract(token_address, "utilityToken_abi")

    # Obtener el número de decimales del token
    decimals = token_contract.functions.decimals().call()

    # Obtener los batches asociados a la billetera
    batch_ids, amounts, metadatas = token_contract.functions.getBatchesByAccount(Web3.to_checksum_address(wallet_address)).call()

    # Crear una lista de lotes con su valor por token
    batches = []
    for batch_id, amount, metadata in zip(batch_ids, amounts, metadatas):
        response = requests.get(f"https://plum-tricky-roadrunner-936.mypinata.cloud/ipfs/{metadata}/")
        if response.status_code == 200:
            data = response.json()
            token_value = next(
                (attribute["value"] for attribute in data["attributes"] if attribute["trait_type"] == "Token Value"), 
                None
            )
            if token_value is None:
                raise ValueError(f'No se encontró el valor "Token Value" en el batch {batch_id}.')
            batches.append({
                "batch_id": batch_id,
                "amount": Decimal(amount) / (10 ** decimals),  # Ajustar por decimales
                "token_value": token_value,
                "total_value": token_value * (Decimal(amount) / (10 ** decimals))  # Ajustar por decimales
            })
        else:
            raise Exception(f"Error: Estado HTTP {response.status_code} para el batch {batch_id}")

    # Ordenar los lotes por valor por token (de mayor a menor)
    batches.sort(key=lambda x: x["token_value"], reverse=True)

    # Seleccionar los tokens necesarios
    remaining_amount = Decimal(str(required_amount))  # Convertir a Decimal
    total_amount = Decimal('0.0')  # Inicializar la suma total

    for batch in batches:
        if remaining_amount <= 0:
            break

        # Calcular la cantidad de tokens necesarios de este batch
        tokens_needed = remaining_amount / Decimal(str(batch["token_value"]))

        # Asegurarse de no exceder la cantidad disponible en el batch
        tokens_to_use = min(tokens_needed, batch["amount"])

        # Redondear a 8 decimales
        tokens_to_use_rounded = tokens_to_use.quantize(Decimal('0.00000001'), rounding=ROUND_DOWN)

        if tokens_to_use_rounded > 0:
            remaining_amount -= tokens_to_use_rounded * Decimal(str(batch["token_value"]))
            total_amount += tokens_to_use_rounded  # Sumar al total

    # Devolver la suma total
    return float(total_amount)  # Convertir a float para facilitar su uso



def get_token_value_and_balance_all(wallet_address, token_address):
    """
    Obtiene el valor total de los Utility Tokens en la billetera,
    incluyendo metadata de cada batch (name, image), y optimiza el rendimiento.
    """
    token_contract = get_token_contract(token_address, "utilityToken_abi")
    decimals = token_contract.functions.decimals().call()
    divisor = 10 ** decimals  # Precalculamos para optimizar

    # Obtenemos batches del contrato
    batches = token_contract.functions.getBatchesByAccount(
        Web3.to_checksum_address(wallet_address)
    ).call()
    
    batch_ids, amounts, metadatas = batches
    total_value = Decimal(0)
    batch_values = []
    
    with requests.Session() as session:  # Reutilizamos conexiones HTTP
        for batch_id, amount, metadata in zip(batch_ids, amounts, metadatas):
            # Fetch metadata desde IPFS
            ipfs_url = f"https://plum-tricky-roadrunner-936.mypinata.cloud/ipfs/{metadata}/"
            response = session.get(ipfs_url)
            response.raise_for_status()  # Lanza error para códigos 4xx/5xx
            
            data = response.json()
            
            # Extraemos campos requeridos
            try:
                name = data['name']
                image = data['image']
                token_value = next(
                    attr['value'] 
                    for attr in data['attributes'] 
                    if attr['trait_type'] == 'Token Value'
                )
            except (KeyError, StopIteration) as e:
                raise ValueError(f"Metadata incompleta en batch {batch_id}: {str(e)}")

            # Cálculos precisos con Decimal
            adjusted_amount = Decimal(amount) / divisor
            token_value_decimal = Decimal(token_value)
            batch_value = (adjusted_amount * token_value_decimal).quantize(Decimal('0.01'), rounding=ROUND_DOWN)

            batch_values.append({
                'name': name,
                'image': image,
                'amount': adjusted_amount,
                'token_value': token_value_decimal,
                'batch_value': batch_value
            })
            
            total_value += batch_value

    return {
        'batch_values': batch_values,
        'total_value': total_value.quantize(Decimal('0.01'), rounding=ROUND_DOWN)
    }
