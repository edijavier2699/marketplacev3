# mi_app/contracts.py
import json
from web3 import Web3
from .web3_setup import w3

# Cargar los ABI de tus contratos
def load_abi(filename):
    with open(filename, 'r') as abi_file:
        return json.load(abi_file)

# ABI y direcciones de tus contratos
usdc_abi = load_abi('mi_app/contracts/usdc_abi.json')
property_token_abi = load_abi('mi_app/contracts/property_token_abi.json')
investment_abi = load_abi('mi_app/contracts/investment_abi.json')

usdc_address = 'DIRECCION_DE_TU_CONTRATO_USDC'
property_token_address = 'DIRECCION_DE_TU_CONTRATO_PROPERTY_TOKEN'
investment_address = 'DIRECCION_DE_TU_CONTRATO_INVESTMENT'

# Funciones para interactuar con el contrato USDC
def get_usdc_contract():
    return w3.eth.contract(address=usdc_address, abi=usdc_abi)

# Puedes añadir funciones similares para los otros contratos

def get_usdc_balance(address):
    contract = get_usdc_contract()
    balance = contract.functions.balanceOf(address).call()
    return balance
