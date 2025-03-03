from django.db import models
import uuid
from decimal import Decimal


class Token(models.Model):

    # Definimos las opciones para el tipo de token utilizando TextChoicesssssss
    class TokenType(models.TextChoices):
        PROPERTY_TOKEN = 'PropertyToken', 'Property Token'
        UTILITY_TOKEN = 'Utility Token', 'Utility Token'

    token_blockchain_address = models.CharField(max_length=42, unique=True, db_index=True)  # Indexado para consultas rápidas
    token_code = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)  # UUID generado automáticamente y único
    property_code = models.ForeignKey("property.Property", on_delete=models.CASCADE, related_name='tokens')  # Renombrado para claridad
    total_tokens = models.DecimalField(max_digits=18, decimal_places=8)  # Usamos DecimalField para fracciones de token (hasta 8 decimales)
    locked_tokens = models.DecimalField(max_digits=18, decimal_places=8, null=True, blank=True)  # Para manejar tokens bloqueados con decimales
    tokens_available = models.DecimalField(max_digits=18, decimal_places=8) 
    token_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Mejor para precios
    token_type = models.CharField(max_length=20, choices=TokenType.choices, default=TokenType.PROPERTY_TOKEN)  # Tipo de token
    created_at = models.DateTimeField(auto_now_add=True)  # Se establece solo cuando se crea el token.

    @property
    def tokens_sold_percentage(self):
        """
        Calcula el porcentaje de tokens vendidos.
        El porcentaje de tokens vendidos se calcula como:
        (tokens vendidos / tokens totales) * 100
        """
        if self.total_tokens == 0:  # Previene la división por cero
            return 0
        tokens_sold = self.total_tokens - self.tokens_available
        return (tokens_sold / self.total_tokens) * 100
    
    def lock_Tokens(self, invested_tokens_amount):
        """
        Lock the tokens that the user wants to collateralize in order 
        to invest using asset-to-asset process.
        """

        if self.locked_tokens is None:
            self.locked_tokens = Decimal(0)  # Asegurar que locked_tokens no sea None

        if self.tokens_available < invested_tokens_amount:
            raise ValueError("Not enough available tokens to lock.")  # Evitar saldo negativo

        self.locked_tokens += Decimal(invested_tokens_amount)
        self.save()  # Guardar cambios en la base de datos


    
    @property
    def get_user_available_tokens(self):
        """
        Get the available tokens for a user 
        subtracting the locked tokens
        """

        return self.tokens_available - self.locked_tokens
    
    max_allowed_investment = models.DecimalField(
        max_digits=20, 
        decimal_places=8, 
        default=0
    )
    
    def save(self, *args, **kwargs):
        # Calcular el límite de inversión permitido (por ejemplo, 25% del total)
        self.max_allowed_investment = Decimal(self.total_tokens) * Decimal('0.25')
        super().save(*args, **kwargs)  # Llama al método original para guardar
    


    def __str__(self):
        return str(self.token_code)

    class Meta:
        indexes = [
            models.Index(fields=['token_blockchain_address']),
            models.Index(fields=['token_code']),
        ]
        verbose_name = "Token"
        verbose_name_plural = "Tokens"







# // SPDX-License-Identifier: MIT
# pragma solidity ^0.8.0;

# import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
# import "@openzeppelin/contracts/access/Ownable.sol";

# contract UtilityToken is ERC20, Ownable {
#     address public utProvider;
#     uint8 private _tokenDecimals;  // Variable para almacenar el número de decimales

#     // Evento para rastrear cambios de proveedor
#     event ProviderChanged(address indexed oldProvider, address indexed newProvider);
    
#     // Evento para cuando se acuñen tokens
#     event Minted(address indexed to, uint256 amount);

#     // Constructor para inicializar el contrato ERC20 y Ownable
#     constructor(address initialOwner, uint8 initialDecimals) ERC20("wUSDC", "wUSDC") Ownable(initialOwner) {
#         _tokenDecimals = initialDecimals;  // Establecer el número de decimales al momento de la creación
#         transferOwnership(initialOwner);  // Establecer al propietario del contrato
#     }

#     // Sobrescribir la función decimals para que retorne los decimales configurados
#     function decimals() public view virtual override returns (uint8) {
#         return _tokenDecimals;  // Retorna el número de decimales establecido
#     }

#     // Función para establecer la dirección inicial del UTProvider
#     function setUTProvider(address _utProvider) external onlyOwner {
#         require(utProvider == address(0), "UTProvider is already set");
#         utProvider = _utProvider;
#         emit ProviderChanged(address(0), _utProvider);
#     }

#     // Función para cambiar el UTProvider (solo puede ser llamado por el owner)
#     function setNewProvider(address _newProvider) external onlyOwner {
#         require(_newProvider != address(0), "New provider cannot be the zero address");
#         require(_newProvider != utProvider, "New provider must be different");

#         address oldProvider = utProvider;
#         utProvider = _newProvider;

#         emit ProviderChanged(oldProvider, _newProvider);
#     }

#     // Función para acuñar nuevos tokens (solo puede ser llamado por UTProvider)
#     function mint(address to, uint256 amount) external {
#         require(msg.sender == utProvider, "Only UTProvider can mint tokens");

#         // Acuñar tokens ERC-20
#         _mint(to, amount);

#         // Emitir evento de mint
#         emit Minted(to, amount);
#     }
# }





# // SPDX-License-Identifier: MIT
# pragma solidity ^0.8.0;

# import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
# import "@openzeppelin/contracts/access/Ownable.sol";

# contract UtilityTokenERC1155 is ERC1155, Ownable {
#     address public utProvider;
#     uint8 public decimals = 8; // Definir decimales (8 decimales)
#     uint256 public scale = 10 ** uint256(decimals); // Factor de escala para 8 decimales
#     mapping(uint256 => string) private tokenURIs;
#     mapping(uint256 => string) public propertyCIDs;

#     event ProviderChanged(address indexed oldProvider, address indexed newProvider);
#     event Minted(address indexed to, uint256 indexed tokenId, uint256 amount);
#     event PropertyCIDSet(uint256 indexed propertyId, string indexed cid);

#     constructor(string memory initialBaseURI, address initialOwner) ERC1155(initialBaseURI) Ownable(initialOwner) {}

#     function setUTProvider(address _utProvider) external onlyOwner {
#         require(utProvider == address(0), "UTProvider is already set");
#         utProvider = _utProvider;
#         emit ProviderChanged(address(0), _utProvider);
#     }

#     function setNewProvider(address _newProvider) external onlyOwner {
#         require(_newProvider != address(0), "New provider cannot be the zero address");
#         require(_newProvider != utProvider, "New provider must be different");

#         address oldProvider = utProvider;
#         utProvider = _newProvider;

#         emit ProviderChanged(oldProvider, _newProvider);
#     }

#     function setPropertyCID(uint256 propertyId, string memory cid) external onlyOwner {
#         propertyCIDs[propertyId] = cid;
#         emit PropertyCIDSet(propertyId, cid);
#     }

#     // Acuñar tokens para un usuario y propiedad específicos
#     function mint(
#         address to,
#         uint256 propertyId,
#         uint256 amount // amount debe ser en su forma escalada
#     ) external {
#         require(msg.sender == utProvider, "Only UTProvider can mint tokens");
#         uint256 tokenId = propertyId;
#         string memory metadataURI = propertyCIDs[tokenId];
#         require(bytes(metadataURI).length > 0, "CID for property not set");
#         if (bytes(tokenURIs[tokenId]).length == 0) {
#             tokenURIs[tokenId] = metadataURI;
#         }
        
#         // Acuñar los tokens
#         _mint(to, tokenId, amount, "");

#         emit Minted(to, tokenId, amount);
#     }

#     function uri(uint256 tokenId) public view override returns (string memory) {
#         require(bytes(tokenURIs[tokenId]).length > 0, "Token metadata URI not set");
#         return tokenURIs[tokenId];
#     }

#     function getTokenMetadataURL(uint256 tokenId) public view returns (string memory) {
#         require(bytes(propertyCIDs[tokenId]).length > 0, "CID for property not set");
#         return string(abi.encodePacked("https://gateway.pinata.cloud/ipfs/", propertyCIDs[tokenId]));
#     }

#     function uint2str(uint256 _i) internal pure returns (string memory) {
#         if (_i == 0) return "0";
#         uint256 j = _i;
#         uint256 len;
#         while (j != 0) {
#             len++;
#             j /= 10;
#         }
#         bytes memory bstr = new bytes(len);
#         uint256 k = len;
#         while (_i != 0) {
#             k = k - 1;
#             uint8 temp = uint8(48 + (_i % 10));
#             bytes1 b1 = bytes1(temp);
#             bstr[k] = b1;
#             _i /= 10;
#         }
#         return string(bstr);
#     }
# }





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

#     function tokenToTokenTrade(address toPoolAddress, uint256 investAmount, uint256 propertyId) external {
#         // Obtener la dirección del propietario del activo (supongo que esta es una variable del contrato)
#         address poolAssetOwnerTarget = TPPTrader(toPoolAddress)._ASSET_OWNER_();

#         // Verifica si el sender es el mismo que el propietario del activo
#         require(msg.sender != poolAssetOwnerTarget, "CANNOT_INVEST_IN_YOUR_OWN_ASSET");
#         // Verify sufficient unlocked tokens in the pool
#         uint256 availableTokens = getAvailableTokensToInvest(); 
#         require(investAmount <= availableTokens, "INSUFFICIENT_PROPERTY_TOKENS_ON_YOUR_POOL");

#         // Check how many tokens already the msg.sender has of the user(POOLB)  
#         checkOwnershipLimit(msg.sender, toPoolAddress, investAmount);
#         // Lock tokens for trade (move unlocked tokens to locked tokens)
#         lockTokens(investAmount);
#         // Crear instancia de UTProvider usando _UT_PROVIDER_
#         UTProvider utProvider = UTProvider(_UT_PROVIDER_);
#         // Llamamos a UTProvider para acuñar los tokens equivalentes
#         UTProvider(_UT_PROVIDER_).receiveAndMint(address(_QUOTE_TOKEN_), propertyId ,investAmount, poolAssetOwnerTarget)
#         // utProvider.receiveAndMint(address(_QUOTE_TOKEN_), propertyId ,investAmount, poolAssetOwnerTarget);
#         // Obtener el nuevo balance del usuario después de la transferencia
#         uint256 newTotalAmount = _QUOTE_TOKEN_.balanceOf(poolAssetOwnerTarget);
#         // Emitir el evento con el balance actualizado
#         emit UpdatedBalance(poolAssetOwnerTarget, newTotalAmount);
#         // Paso 3:Notify PoolB that the owner of the PoolB Received the utility tokens so send the property tokens to Owner of the PoolA
#         // address assetOwnerPoolA = _ASSET_OWNER_;
#         // TPPTrader(toPoolAddress).receiveAndMintEquivalentTokens(investAmount,assetOwnerPoolA);
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
#     address assetOwnerAddress = _ASSET_OWNER_; 
#         // Verifica si el sender es el mismo que el propietario del activo
#      address poolAssetOwnerTarget = TPPTrader(toPoolAddress)._ASSET_OWNER_();

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

