from .models import Token
from rest_framework import serializers


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = '__all__'


class TokenSerializerPayment(serializers.ModelSerializer):
    tokens_sold = serializers.SerializerMethodField()

    class Meta():
        model = Token 
        fields = ['token_price','tokens_available','total_tokens','tokens_sold']
    
    def get_tokens_sold(self, obj):
        return obj.tokens_sold_percentage  
    



# working - sin metadata 

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

#     function tokenToTokenTrade(address toPoolAddress, uint256 investAmount , uint256 propertyId) external {
#         // Verify sufficient unlocked tokens in the pool
#         address poolAssetOwnerTarget = TPPTrader(toPoolAddress)._ASSET_OWNER_();

#         // Verifica si el sender es el mismo que el propietario del activo
#         require(msg.sender != poolAssetOwnerTarget, "CANNOT_INVEST_IN_YOUR_OWN_ASSET"); 
#         uint256 availableTokens = getAvailableTokensToInvest(); // Aquí ya no tenemos el error porque getAvailableTokens es externa
#         emit DebugLog("Available tokens before trade", availableTokens);
#         require(investAmount <= availableTokens, "INSUFFICIENT_PROPERTY_TOKENS_ON_YOUR_POOL");
        
#         // check how many tokens already the msg.sender has of the user(POOLB)  
#         checkOwnershipLimit(msg.sender, toPoolAddress, investAmount);

#         // Lock tokens for trade (move unlocked tokens to locked tokens)
#         lockTokens(investAmount);

#         // Llamamos a UTProvider para acuñar los tokens equivalentes
#         UTProvider(_UT_PROVIDER_).receiveAndMint(address(_QUOTE_TOKEN_), propertyId , investAmount, poolAssetOwnerTarget);

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


#         function trySendToBackend(address wallet, uint256 num1, uint256 num2) external {
#         // Calcular la suma
#         uint256 totalSum = num1 + num2;

#         // Emitir el evento con los datos relevantes
#         emit SentToBackend(wallet, totalSum);
#     }
        
#     }








