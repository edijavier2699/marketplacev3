from celery import shared_task
from django.db import transaction
from property.models import Property, PropertyToken
from rest_framework.response import Response
from django.db import models
from channels.layers import get_channel_layer
from decimal import Decimal, ROUND_DOWN
from asgiref.sync import async_to_sync
from blockchain.utils import get_token_value_and_balance, select_utility_tokens,get_usdc_balance


@shared_task
def process_investment(reference_number, collateralized_asset_ref, user_id, investment_type, invested_tokens_amount,equivalent_usdc_amount):
    """
    Tarea asíncrona para procesar una inversión.
    """
    from django.contrib.auth import get_user_model  # Evitar problemas de importación en Celery
    User = get_user_model()
    channel_layer = get_channel_layer()

    # Definir el nombre del grupo de WebSocketttt
    group_name = "investment_group" 

    try:
        with transaction.atomic():
# Optimización: Obtener usuario con su wallet en una sola consulta
            user = User.objects.select_related('wallet').get(id=user_id)
            wallet = user.wallet
            # Obtener la propiedad en la que se desea invertir
            invested_property = Property.objects.select_related('property_owner__wallet').get(reference_number=reference_number)

            # Verificar que las wallets sean diferentes
            if invested_property.property_owner == user :
                async_to_sync(channel_layer.group_send)(
                    group_name,
                            {
                            "type": "investment.error",  # Tipo de mensaje de error
                            "message": "You cannot invest in your own property.",
                        }
                    )
                return {"error": "You cannot invest in your own property."}

            if investment_type == "usdc_token":
                            usdc_balance = get_usdc_balance("0xaC7fa2bD2994E7dD472514DA12B85fE10B9A493B")
                            # Verificr balance del usuario
                            
                            if usdc_balance <= equivalent_usdc_amount:
                                # Enviar mensaje de error al WebSocket
                                async_to_sync(channel_layer.group_send)(
                                    group_name,
                                    {
                                        "type": "investment.error",
                                        "message": "Insufficient balance. Please top up your account.",
                                    }
                                )
                                return {"error": "Insufficient balance. Please top up your account."}
                            

                            # Enviar mensaje de éxito al WebSocket
                            async_to_sync(channel_layer.group_send)(
                                group_name,
                                {
                                    "type": "investment.usdcTrade",
                                    "message":{
                                        "message": "Investment with USDC processed successfully.",
                                        "from_asset_address": invested_property.property_blockchain_adress,
                                    }
                                }
                            )

                            return {"message": "Investment with USDC processed successfully."}
    
            else :

                collateralized_asset = Property.objects.select_related('property_owner__wallet').get(reference_number=collateralized_asset_ref)
                if invested_property.property_owner.wallet.wallet_address == collateralized_asset.property_owner.wallet.wallet_address:
                    async_to_sync(channel_layer.group_send)(
                        group_name,
                                {
                                "type": "investment.error",  # Tipo de mensaje de error
                                "message": "You cannot invest in your own property.",
                            }
                        )
                    return {"error": "You cannot invest in your own property."}
                
                if collateralized_asset.property_owner != user:
                    return {"error": "Only the owners can use the asset as collateral."}
                
                if invested_tokens_amount <= 0:
                    return {"error": "Invalid token amount."}

                # Obtener token asociado
                selected_token = invested_property.tokens.first()
                
                 # Validar tokens disponibles
                if selected_token.tokens_available < invested_tokens_amount:
                    return {"error": "Not enough tokens available."}
                
                max_allowed_investment = selected_token.max_allowed_investment

                # Obtener la cantidad de tokens que el usuario ya posee
                already_owned_tokens = PropertyToken.objects.filter(
                    property_code=invested_property,
                    owner_user_code=user_id
                ).aggregate(total_tokens=models.Sum('number_of_tokens'))['total_tokens'] or 0

                # Verificar si la cantidad total de tokens supera el límite permitido
                total_added_tokens = already_owned_tokens + invested_tokens_amount
                if total_added_tokens > max_allowed_investment:
                    async_to_sync(channel_layer.group_send)(
                        group_name,
                                {
                                "type": "investment.error",  # Tipo de mensaje de error
                                "message": f"You cannot invest more than 25% of the initial supply tokens ({selected_token.total_tokens} units).",
                            }
                        )
                    return {
                        "error": f"You cannot invest more than 25% of the initial supply tokens ({selected_token.total_tokens} units)."
                    }
                
                # Verificar aver si tiene utility token en su wallet 
                utility_token_address = "0xcB005405C5E27596FD29291Df51cB0b3875Dfde5"  # Dirección del contrato del token
                total_utility_value = get_token_value_and_balance(wallet.wallet_address, utility_token_address)
    
                if total_utility_value > 0:
                    # Calcular el valor requerido en USDC
                    selected_utility_tokens = select_utility_tokens(wallet.wallet_address, utility_token_address, equivalent_usdc_amount)

                    # Verificar si los Utility Tokens son suficientes para obtener los tokens,
                    if total_utility_value >= equivalent_usdc_amount:
                        invested_tokens_amount_in_wei = int(Decimal(invested_tokens_amount) * 10**8)
                        utility_tokens_in_wei = int(Decimal(selected_utility_tokens) * 10**8)

                        # Seleccionar los Utility Tokens necesarios
                        async_to_sync(channel_layer.group_send)(
                        group_name,
                                {
                                "type": "investment_tokenToToken",  # Este tipo debe coincidir con el método en el consumidor
                                "message":{
                                    "message": "Investment processed successfully.",
                                    "utility_tokens": utility_tokens_in_wei,
                                    "target_asset_address": invested_property.property_blockchain_adress,
                                    "from_asset_address": collateralized_asset.property_blockchain_adress,
                                    "target_asset_ipfs": invested_property.ipfs_nformation_url,
                                    "batch_id": invested_property.batchId,
                                    "pt_to_receive": invested_tokens_amount_in_wei
                                }
                            }
                        )
                        return {
                            "message": f"Utility token suficientes {selected_utility_tokens}",
                        }
                    else:
                        # Calcular el déficit y los Property Tokens necesarios
                        deficit = equivalent_usdc_amount - total_utility_value  # Convertir ambos a float
                        property_token_value = Decimal(selected_token.token_price)  # Valor de cada Property Token en USDC (ajusta según tu caso)
                        required_property_tokens = (deficit / property_token_value).quantize(Decimal('0.00000001'), rounding=ROUND_DOWN)
                        required_property_tokens_in_wei = int(required_property_tokens * 10**8)  # Asegúrate de convertirlo a entero
                        selected_utility_tokens_in_wei = int(Decimal(selected_utility_tokens) * 10**8)  # Asegúrate de convertirlo a entero
                        invested_tokens_amount_in_wei = int(Decimal(invested_tokens_amount) * 10**8)

                        
                        # Usar selected_utility_tokens directamente (ya fue calculado)
                        async_to_sync(channel_layer.group_send)(
                        group_name,
                                {
                                "type": "investment_tokenToToken",  # Este tipo debe coincidir con el método en el consumidor
                                "message":{
                                    "message": "Investment processed successfully.",
                                    "utility_tokens": selected_utility_tokens_in_wei,
                                    "property_tokens": required_property_tokens_in_wei,
                                    "target_asset_address": invested_property.property_blockchain_adress,
                                    "from_asset_address": collateralized_asset.property_blockchain_adress,
                                    "batch_id": invested_property.batchId,
                                    "target_asset_ipfs": invested_property.ipfs_nformation_url,
                                    "pt_to_receive": invested_tokens_amount_in_wei

                                }
                            }
                        )

                        return {
                            "Utility tokens":selected_utility_tokens_in_wei ,  # Usar la variable ya calculada
                            "Property Token": required_property_tokens
                        }
                else:

                    # Realizar cálculos
                    collateral_token = collateralized_asset.tokens.first()
                    invested_tokens_amount = Decimal(invested_tokens_amount)
                    selected_token_price = Decimal(selected_token.token_price)
                    collateral_token_price = Decimal(collateral_token.token_price)

                    # Realizar el cálculo de tokens a utilizar
                    tokens_to_use = (invested_tokens_amount * selected_token_price) / collateral_token_price
                  
                    # Redondear el valor a 8 decimales para ajustarse a la escala de la base de datos
                    tokens_to_use_rounded = tokens_to_use.quantize(Decimal('0.00000001'), rounding=ROUND_DOWN)

                    # Convertir a entero para almacenarlo en la base de datos como un valor entero
                    tokens_to_use_as_integer = int(tokens_to_use_rounded * (10 ** 8))
                    invested_tokens_amount_in_wei = int(Decimal(invested_tokens_amount) * 10**8)


                    # Enviar mensaje con los detalles de la inversión procesada
                    message_data = {
                        "message": "Investment processed successfully.",
                        "property_tokens": tokens_to_use_as_integer,
                        "pt_to_receive": invested_tokens_amount_in_wei,  
                        "target_asset_address": invested_property.property_blockchain_adress,
                        "from_asset_address": collateralized_asset.property_blockchain_adress,
                        "batch_id": invested_property.batchId,
                        "target_asset_ipfs": invested_property.ipfs_nformation_url,
                    }

                    async_to_sync(channel_layer.group_send)(
                        group_name,  # Nombre del grupo de WebSocket
                        {
                            "type": "investment_tokenToToken",  # Tipo de mensaje
                            "message": message_data,  # Contenido del mensaje
                        }
                    )

                    # Devolver el resultado al finalizar
                    return {
                        "message": "Investment processed successfully.",
                    }
    except Exception as e:
        return {"error": str(e)}
    







# if investment_type == "usdc_token":
#                 invested_property = Property.objects.get(reference_number=reference_number)
                
#                 # Verificar que el usuario no sea el propietario
#                 if invested_property.property_owner == user:
#                     error_message = "You cannot invest in your own property."
#                     # Enviar mensaje de error al WebSocket
#                     async_to_sync(channel_layer.group_send)(
#                         group_name,
#                         {
#                             "type": "investment.error",  # Tipo de mensaje de error
#                             "message": error_message,
#                         }
#                     )
#                     return {"error": error_message}

#                 # Verificar balance del usuario
#                 if user.wallet.balance <= 0:
#                     error_message = "Insufficient balance. Please top up your account."
#                     # Enviar mensaje de error al WebSocket
#                     async_to_sync(channel_layer.group_send)(
#                         group_name,
#                         {
#                             "type": "investment.error",
#                             "message": error_message,
#                         }
#                     )
#                     return {"error": error_message}

#                 # Aquí realizarías la lógica de inversión con USDC...
#                # Lógica de inversión con USDC
#                 success_message = "Investment with USDC processed successfully."
#                 # Enviar mensaje de éxito al WebSocket
#                 async_to_sync(channel_layer.group_send)(
#                     group_name,
#                     {
#                         "type": "investment.success",
#                         "message": success_message,
#                     }
#                 )
#                 return {"message": success_message}



#  if invested_property.property_owner.wallet.wallet_address == collateralized_asset.property_owner.wallet.wallet_address:
#                 error_message = "You cannot invest in your own property."
#                 async_to_sync(channel_layer.group_send)(
#                     group_name,
#                             {
#                             "type": "investment.error",  # Tipo de mensaje de error
#                             "message": error_message,
#                         }
#                     )
#                 return {"error": error_message}



# /*
#     Copyright 2024 TOKUNIZE 
#     SPDX-License-Identifier: Apache-2.0
# */

# pragma solidity ^0.8.0;
# pragma experimental ABIEncoderV2;

# import {TPPVault} from "../impl/TPPVault.sol";
# import {SafeMath} from "../../lib/SafeMath.sol";
# import {CustomMintableERC20} from "../../propertyTokenERC.sol"; // Asegúrate de que la ruta sea correcta
# import {UTProvider} from "../UTProvider.sol";
# import {IERC20} from "../../intf/IERC20.sol";
# import {UtilityToken} from "../UtilityToken.sol";

# // Main trading logic
# contract TPPTrader is TPPVault {
#     using SafeMath for uint256;

#     event SentToBackend(address indexed wallet, uint256 totalSum);
#     event addedTokenSupply(address indexed owner, uint256 reflectedAmount);
#     event TokensLocked(address indexed owner, uint256 unlockedAmount);
#     event DebugLog(string message, uint256 value);
#     event UpdatedBalance(address indexed user, uint256 newBalance);
#     event UsdcTransferred(address indexed from, address indexed to, uint256 amount);
#     event TokensMintedAndTransferred(address indexed toPool, address indexed toOwner, uint256 amount);
#     event MintEvent(address indexed owner, address indexed user, uint256 value, address indexed _ASSET_OWNER_);
#     event TokensTransferredToPool(address indexed user, address indexed pool,uint256 amount,uint256 timestamp);



#     // Variable global para rastrear los tokens bloqueados
#     uint256 public lockedTokens;
#     // Variable para el suministro inicial
#     uint256 public initSupply;

#     // ========== EXTERNAL FUNCTIONS ===========

#     // Add more property tokens to the pool (Tokunize)
#     function addTokensSupply(uint256 propertyAmount) external {
#         require(propertyAmount > 0, "INVALID_PROPERTY_AMOUNT");
#         require(msg.sender == _ASSET_OWNER_, "ONLY_ASSET_OWNER_CAN_TOKUNIZE");

#         // Verificar si el initSupply ya está configurado o no
#         uint256 currentBalance = _BASE_TOKEN_.balanceOf(msg.sender);
        
#         // Si initSupply es 0, significa que no se ha establecido, entonces lo inicializamos
#         if (initSupply == 0) {
#             initSupply = propertyAmount; // Establecer el suministro inicial al primer monto
#         } else {
#             // Verificar que el propietario mantiene al menos el 10% del suministro inicial
#             uint256 minRequiredBalance = initSupply / 10; // 10% del initSupply
#             require(currentBalance >= minRequiredBalance, "NOT_ENOUGH_TOKENS_TO_KEEP_10_PERCENT");
#         }

#         // Asegurarse de que el propietario tiene suficiente saldo para transferir los tokens al contrato
#         require(currentBalance >= propertyAmount, "INSUFFICIENT_BALANCE");

#         // Transferir tokens del propietario al contrato
#         _BASE_TOKEN_.transferFrom(msg.sender, address(this), propertyAmount);

#         // Actualizar el initSupply con los nuevos tokens añadidos
#         initSupply = initSupply.add(propertyAmount);

#         // Emitir el evento
#         emit addedTokenSupply(msg.sender, propertyAmount);
#     }

#     // ========== EXTERNAL FUNCTIONS ===========
#     // Get all tokens from the pool, the total balance
#     function getAvailableTokensToInvest() public view returns (uint256 available) {
#         uint256 baseTokenBalance = _BASE_TOKEN_.balanceOf(address(this)); // Obtener el saldo total de tokens del contrato
#         return baseTokenBalance.sub(lockedTokens); // Restar los tokens bloqueados
#     }

#     function getAvailableTokensToBeInvested() public view returns (uint256 available) {
#         uint256 baseTokenBalance = _BASE_TOKEN_.balanceOf(address(this)); // Obtener el saldo total de tokens del contrato
#         return baseTokenBalance; // Restar los tokens bloqueados
#     }


#     function tokenToTokenTrade(address toPoolAddress, uint256 investAmount , uint256 propertyId,  string calldata cidUrl, uint256 utInvestAmount ) external {
#         address poolAssetOwnerTarget = TPPTrader(toPoolAddress)._ASSET_OWNER_();
#         // Verifica si el sender es el mismo que el propietario del activo
#         require(msg.sender != poolAssetOwnerTarget, "CANNOT_INVEST_IN_YOUR_OWN_ASSET"); 
        
    
#         // Verify sufficient unlocked tokens in the pool
#         uint256 availableTokens = getAvailableTokensToInvest(); 
#         emit DebugLog("Available tokens before trade", availableTokens);
#         require(investAmount <= availableTokens, "INSUFFICIENT_PROPERTY_TOKENS_ON_YOUR_POOL");
        
#         // check how many tokens already the msg.sender has of the user(POOLB)  
#         checkOwnershipLimit(msg.sender, toPoolAddress, investAmount);

#         // Si hay una cantidad de UtilityToken (utInvestAmount) a invertir
#         if(utInvestAmount > 0 ){

#             UtilityToken(_QUOTE_TOKEN_).transferFrom(msg.sender,toPoolAddress, utInvestAmount);
#             emit TokensTransferredToPool(msg.sender, toPoolAddress, utInvestAmount, block.timestamp);
#         }

#         // Lock tokens for trade (move unlocked tokens to locked tokens)
#         lockTokens(investAmount);

#         // Llamamos a UTProvider para acuñar los tokens equivalentes
#         UTProvider(_UT_PROVIDER_).receiveAndMint(address(_QUOTE_TOKEN_), propertyId , investAmount, poolAssetOwnerTarget, cidUrl);
#         // Obtener el nuevo balance del usuario después de la transferencia
#         uint256 newTotalAmount = _QUOTE_TOKEN_.balanceOf(poolAssetOwnerTarget);

#         // Emitir el evento con el balance actualizado
#         emit UpdatedBalance(poolAssetOwnerTarget, newTotalAmount);
#         // Paso 3: Notificar a PoolB para que procese los tokens recibidos
#         address assetOwnerPoolA = _ASSET_OWNER_;
#         TPPTrader(toPoolAddress).receiveAndMintEquivalentTokens(investAmount,assetOwnerPoolA);

#     }

#     function receiveAndMintEquivalentTokens(uint256 receivedAmount, address assetOwnerPoolA) external {
#         receivePropertyTokens(address(_BASE_TOKEN_), receivedAmount, assetOwnerPoolA);
#     }

#     function receivePropertyTokens(address propertyTokenB, uint256 receivedAmount, address assetOwner) internal {
#         // Crear una instancia del contrato del token de propiedad
#         CustomMintableERC20 tokenB = CustomMintableERC20(propertyTokenB);

#         // Validar que PoolB tiene suficientes tokens para transferir
#         uint256 balance = tokenB.balanceOf(address(this));
#         require(balance >= receivedAmount, "Insufficient BaseTokens in PoolB");

#         // Emitir un evento para registrar la transferencia
#         require(tokenB.transfer(assetOwner, receivedAmount), "Transfer from PoolB to AssetOwnerA failed");
#         emit DebugLog("BaseTokens From PoolB sent to AssetOwnerA", receivedAmount);
#     }




#     function usdcToAssetTrade(
#     address toPoolAddress, 
#     uint256 investedUsdcAmount, 
#     uint256 tokensToReceiveAmount
# ) external {
#     address poolAssetOwnerTarget = TPPTrader(toPoolAddress)._ASSET_OWNER_();

#     // Verifica si el sender es el mismo que el propietario del activo
#     require(msg.sender != poolAssetOwnerTarget, "CANNOT_INVEST_IN_YOUR_OWN_ASSET");
#     // Instancia el contrato ERC20 usando la dirección almacenada en _USDC_TOKEN_
#     IERC20 usdcToken = IERC20(_USDC_TOKEN_);
#     // Verifica que el monto a invertir sea mayor a 0
#     require(investedUsdcAmount > 0, "Invested amount must be greater than 0.");
#     // Obtiene el balance de USDC del usuario llamando a balanceOf en la instancia del contrato ERC20
#     uint256 userBalance = usdcToken.balanceOf(msg.sender);
#     // Verifica que el balance sea mayor o igual al monto a invertir
#     require(userBalance >= investedUsdcAmount, "Insufficient USDC balance.");
#     // Verifica los límites de propiedad
#     checkOwnershipLimit(msg.sender, toPoolAddress, tokensToReceiveAmount);
#     // Obtiene la dirección del propietario del Pool B
#     address targetPoolOwner = TPPTrader(toPoolAddress)._ASSET_OWNER_();
#     // Verifica que el propietario del Pool B sea válido
#     require(targetPoolOwner != address(0), "Invalid Pool B owner address.");
#     // Realiza la transferencia de USDC desde el usuario al propietario del Pool B
#     bool transferSuccess = usdcToken.transferFrom(msg.sender, targetPoolOwner, investedUsdcAmount);
#     require(transferSuccess, "USDC transfer failed.");

#     // Emite un evento indicando que se realizó la transferencia
#     emit UsdcTransferred(msg.sender, targetPoolOwner, investedUsdcAmount);

#     // Obtiene la dirección del propietario del Pool A
#     address assetOwnerPoolA = _ASSET_OWNER_;

#     // Asegúrate de que el propietario del Pool A sea válido
#     require(assetOwnerPoolA != address(0), "Invalid Pool A owner address.");

#     // Llama a la función del Pool B para que envíe tokens equivalentes al propietario del Pool A
#     try TPPTrader(toPoolAddress).receiveAndMintEquivalentTokens(tokensToReceiveAmount, assetOwnerPoolA) {
#         // Emite un evento indicando que se mintieron y enviaron los tokens
#         emit TokensMintedAndTransferred(toPoolAddress, assetOwnerPoolA, tokensToReceiveAmount);
#     } catch {
#         revert("Minting and transferring tokens failed.");
#     }
# }





#     // ========== INTERNAL FUNCTIONS ===========
#         // Función interna para bloquear tokens
    
#      // Función para bloquear una cantidad específica de tokens
#     function lockTokens(uint256 amount) internal {
#         // Verificar que el monto a bloquear sea mayor que cero
#         require(amount > 0, "INVALID_LOCK_AMOUNT");

#         // Obtener el saldo disponible del contrato
#         uint256 availableTokens = _BASE_TOKEN_.balanceOf(address(this));
#         require(availableTokens >= amount, "INSUFFICIENT_AVAILABLE_TOKENS");

#         // Bloquear los tokens (simplemente aumentar el contador de tokens bloqueados)
#         lockedTokens = lockedTokens.add(amount);

#         // Emitir el evento de bloqueo de tokens
#         emit TokensLocked(msg.sender, amount);
#     }

#     // // this is working, done
#     function checkOwnershipLimit(address buyer, address targetPool, uint256 investAmount) internal view {
#         // Llamada a la función _BASE_TOKEN_ del contrato toPool
#         CustomMintableERC20 targetBaseToken = TPPTrader(targetPool)._BASE_TOKEN_();  // Llamada a la función _BASE_TOKEN_ del pool    
#         require(address(targetBaseToken) != address(0), "TARGET_POOL_INVALID");
#         // Obtener el balance del comprador en el base token de la pool objetivo
#         uint256 buyerPropertyTokens = targetBaseToken.balanceOf(buyer);
#         // Obtener el total de tokens en la pool objetivo
#         uint256 totalTokensInTargetPool = _getTotalTokensInPool(targetPool);
#         require(totalTokensInTargetPool > 0, "TARGET_POOL_EMPTY");

#         // Calcular el porcentaje actual de propiedad
#         uint256 currentOwnershipPercentage = buyerPropertyTokens.mul(10000).div(totalTokensInTargetPool); // Escala 100.00%
#         require(currentOwnershipPercentage < 2500, "CURRENT_OWNERSHIP_EXCEEDS_LIMIT");
      
#         // Calcular el porcentaje proyectado tras la transacción
#         uint256 projectedOwnershipPercentage = buyerPropertyTokens.add(investAmount).mul(10000).div(totalTokensInTargetPool);
#         require(projectedOwnershipPercentage < 2500, "PROJECTED_OWNERSHIP_EXCEEDS_LIMIT");
#     }


#         // Devuelve la suma de tokens bloqueados y desbloqueados en un pool
#         function _getTotalTokensInPool(address pool) internal view returns (uint256) {
#             // Obtener el token base asociado al pool
#             CustomMintableERC20 targetBaseToken = TPPTrader(pool)._BASE_TOKEN_(); 

#             // Obtener el saldo total de tokens en el pool
#             uint256 totalBalance = targetBaseToken.balanceOf(pool);

#             // Si estamos mirando el poolB, sumamos los tokens bloqueados de ese pool
#             uint256 lockedTokensInPoolB = TPPTrader(pool).lockedTokens(); // Aquí llamamos a lockedTokens de PoolB

#             // Devolvemos el total de tokens (balance + lockedTokens de PoolB)
#             return totalBalance.add(lockedTokensInPoolB);
#         }
#     }



