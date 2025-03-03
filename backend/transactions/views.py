from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.views.decorators.cache import cache_page
from rest_framework.views import APIView
from .models import Transaction
from rest_framework.pagination import PageNumberPagination
from users.authentication import Auth0JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import TransactionSerializer
from notifications.models import ActivityLog
from .tasks import process_investment
from django.utils.timezone import now
from datetime import timedelta, datetime
from django.db.models.functions import TruncWeek
from django.db.models import Sum
from property.models import Property,PropertyToken
from django.utils import timezone
from blockchain.models import Token
from decimal import Decimal
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from django.db.models import F
from notifications.services import create_investment_notification


# Create your views here.

def log_activity(event_type, involved_address, contract_address=None, payload=None):
    """
    Registra un evento en el log de actividad.

    :param event_type: Tipo de evento (e.g., 'transaction', 'new_property', etc.)
    :param involved_address: Dirección involucrada en el evento.
    :param contract_address: (Opcional) Dirección del contrato involucrado.
    :param payload: (Opcional) Datos adicionales en formato JSON.
    """
    ActivityLog.objects.create(
        event_type=event_type,
        contract_address=contract_address,
        involved_address=involved_address,
        payload=payload
    )


class TransactionListview(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    pagination_class = PageNumberPagination  

    def get(self, request):
        user_id = request.user.id
        
        # Obtener las transacciones del usuario
        transactions = Transaction.objects.filter(transaction_owner_code=user_id).select_related('transaction_owner_code')

        # Aplicar la paginación
        paginator = self.pagination_class()
        paginated_transactions = paginator.paginate_queryset(transactions, request)
        transaction_serializer = TransactionSerializer(paginated_transactions, many=True)
  
        # Construir la respuesta con las transacciones, property tokens, y wallet (si es la primera página)
        response_data = {
            "transactions": transaction_serializer.data,
        }

        # Responder con la paginación estándar de DRF
        return paginator.get_paginated_response(response_data)

    
    @transaction.atomic
    def post(self, request, reference_number):
        # Obtener el asset que se desea usar como colateral
        investment_type = request.data.get("investmentType")
        invested_tokens_amount = int(request.data.get("wantedTokensAmount"))
        equivalent_ssdc_amount = (request.data.get("equivalentUsdcAmount"))
        user_id = request.user.id
        collateralized_asset_ref = request.data.get("collateralizedAsset")
        print("aquiiiiiiiii")

        try:
            # Llamar a la tarea de Celery para procesar la inversión
            process_investment.apply_async(
                args=[reference_number, collateralized_asset_ref, user_id, investment_type, invested_tokens_amount, equivalent_ssdc_amount],
                queue='investment_queue'  # La cola de la tarea asíncrona
            )
            # Responder con un mensaje
            return Response({"message": "Investment will be processed shortly."}, status=200)
        
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        

class TransactionPostTradeListview(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer

    def _convert_amount(self, amount, decimals):
        """Helper para conversiones de decimales"""
        return Decimal(amount) / Decimal(10**decimals)
    
    def _get_property(self, lookup_field, value):
        """Obtiene Property con manejo de errores"""
        try:
            return Property.objects.get(**{lookup_field: value})
        except Property.DoesNotExist:
            raise ValidationError(f"Property with {lookup_field} {value} not found")
    
    def _get_token(self, property_code):
        """Obtiene Token relacionado a una Property"""
        try:
            return Token.objects.get(property_code=property_code)
        except Token.DoesNotExist:
            raise ValidationError(f"Token for property {property_code} not found")
    
    def _update_property_tokens(self, user, property_code, token_code, amount):
        """Actualización atómica usando F() + select_for_update en la transacción principal"""
        try:
            # Usamos select_for_update dentro de la transacción existente del post
            prop_token, created = PropertyToken.objects.select_for_update().get_or_create(
                property_code=property_code,
                token_code=token_code,
                owner_user_code=user,
                defaults={"number_of_tokens": amount}
            )

            if not created:
                # Actualización atómica con F() para evitar race conditions
                PropertyToken.objects.filter(pk=prop_token.pk).update(
                    number_of_tokens=F('number_of_tokens') + Decimal(amount)
                )
                prop_token.refresh_from_db()

            return prop_token

        except IntegrityError as e:
            raise ValidationError("Error de concurrencia en actualización de tokens")
        

    def _create_transaction(self, property, user, token, amount, token_amount, trans_type):
        """Crea una transacción en la base de datos"""
        return Transaction.objects.create(
            property_id=property,
            transaction_owner_code=user,
            token_code=token,
            transaction_amount=amount,
            transaction_tokens_amount=token_amount,
            transaction_type=trans_type,
            transaction_date=timezone.now(),
        )

    def _send_notification(self, user, message):
        """Envía notificación a través del channel layer"""
        channel_layer = get_channel_layer()
        user_name = user.name if user.is_authenticated else 'Guest'
        async_to_sync(channel_layer.group_send)(
            "notifications",
            {
                "type": "send_notification",
                "message": f"{message} {user_name}"
            }
        )
    
    def _handle_usdc_trade(self, user, data, reference_number):
        """Maneja lógica para transacciones USDC"""
        # Validación de datos
        invested_usdc = int(data.get('investedUsdcAmount', 0))
        pt_to_receive = int(data.get('ptToReceive', 0))
        
        # Conversiones
        converted_usdc = self._convert_amount(invested_usdc, 6)
        pt_decimal = self._convert_amount(pt_to_receive, 8)
        
        # Obtener entidades
        property = self._get_property('reference_number', reference_number)
        token = self._get_token(property)
        
        # Actualizar tokens
        self._update_property_tokens(user, property, token, pt_decimal)
        
        # Actualizar disponibilidad de tokens
        token.tokens_available -= pt_decimal
        token.save(update_fields=['tokens_available'])
        
        # Crear transacción
        self._create_transaction(
            property=property,
            user=user,
            token=token,
            amount=converted_usdc,
            token_amount=pt_decimal,
            trans_type=Transaction.TransactionType.BUY
        )
        
        return {"message": "USDC investment successfully processed"}

    def _handle_token_trade(self, user, data, reference_number):
        """Maneja lógica para intercambio token-token"""
        # Validación de datos
        print("dentro del token to token")
        from_pool = data.get('fromPoolAddress')
        to_pool = data.get('poolAddress')
        property_tokens = int(data.get('propertyTokens', 0))
        
        # Conversiones
        pt_used = self._convert_amount(property_tokens, 8)
        pt_received = self._convert_amount(int(data.get('ptToReceive', 0)), 8)
        
        # Obtener propiedades
        from_property = self._get_property('property_blockchain_adress', from_pool)
        to_property = self._get_property('property_blockchain_adress', to_pool)
        
        # Obtener tokens
        from_token = self._get_token(from_property)
        to_token = self._get_token(to_property)
        
        # Bloquear tokens en origen
        from_token.lock_Tokens(pt_used)
        
        # Actualizar tokens en destino
        self._update_property_tokens(user, to_property, to_token, pt_received)
        to_token.tokens_available -= pt_received
        to_token.save(update_fields=['tokens_available'])
        
        # Crear transacción
        self._create_transaction(
            property=from_property,
            user=user,
            token=from_token,
            amount=self._convert_amount(int(data.get('investedUsdcAmount', 0)), 6),
            token_amount=pt_received,
            trans_type=Transaction.TransactionType.BUY
        )
        # verySecurePass2610@
        return {"message": "Token exchange successfully processed"}

    @transaction.atomic
    def post(self, request, reference_number):
        handlers = {
            'usdcTrade': self._handle_usdc_trade,
            'tokenToToken': self._handle_token_trade
        }

        investment_type = request.data.get('investmentType')

        if investment_type not in handlers:
            return Response({"error": "Invalid investment type"}, status=400)

        try:
            handler = handlers[investment_type]
            result = handler(request.user, request.data, reference_number)
             # Create notification, the user that has to receive the notification is the owner of property B in this case
            to_property_owner = Property.objects.select_related('property_owner').get(reference_number=reference_number)
            notification = create_investment_notification(
                user=to_property_owner.property_owner,
                investment_type=investment_type,
            )
            self._send_notification(to_property_owner.property_owner, "New investment from")
            return Response(result, status=200)
            
        except ValidationError as e:
            return Response({"error": str(e)}, status=400)
        
        
    


# GET all the  Transactions for a single property for the marketplace, VOLUMEN ACTIVITY
class TransactionVolumeMarketplaceProperty(APIView):
    permission_classes = [AllowAny]

    def get(self, request, reference_number):
        # Obtener la fecha actual y calcular 10 semanas atrás
        fecha_fin = now()  # Fecha actual
        fecha_inicio = fecha_fin - timedelta(weeks=10)  # Últimas 10 semanas

        try:
            # Obtener la propiedad usando el reference_number
            property_instance = Property.objects.get(reference_number=reference_number)
        except Property.DoesNotExist:
            return Response({"error": "Property not found"}, status=404)

        # Filtrar transacciones por propiedad y por rango de fechas
        transactions = (
            Transaction.objects
            .filter(property_id=property_instance, transaction_date__gte=fecha_inicio)
            .annotate(week=TruncWeek('transaction_date'))  # Agrupar por semana
            .values('week')  # Solo necesitamos la fecha truncada por semana
            .annotate(volumen_total=Sum('transaction_amount'))  # Sumar transacciones por semana
            .order_by('week')  # Ordenar cronológicamente
        )

        # Devolver los resultados de las transacciones por semana
        return Response(list(transactions), status=status.HTTP_200_OK)



        
# class TransactionPostTradeListview(APIView):
#     authentication_classes = [Auth0JWTAuthentication]
#     permission_classes = [IsAuthenticated]
#     serializer_class = TransactionSerializer


#     @transaction.atomic
#     def post(self, request, reference_number):
#         user = request.user
#         from_pool_address = request.data.get('fromPoolAddress', None)
#         pool_address = request.data.get('poolAddress', None)
#         property_tokens = request.data.get('propertyTokens', 0)
#         utility_tokens = request.data.get('utilityTokens', 0)
#         invested_usdc_amount = int(request.data.get('investedUsdcAmount', 0))  # Convertir a int
#         pt_to_receive = int(request.data.get('ptToReceive', 0))  # Convertir a int
#         investment_type = request.data.get('investmentType', None)
#         channel_layer = get_channel_layer()
        
#         # convert pt_to_receive as a decimal number i.e 1,254545454
#         pt_to_receive_decimal = Decimal(pt_to_receive) / Decimal(10**8)
      
#         try:
#             if investment_type == "usdcTrade":
#                 to_property= Property.objects.get(reference_number=reference_number)
#                 converted_usdc_to_receive = Decimal(invested_usdc_amount) / Decimal(10**6)

#                 to_ptoken = Token.objects.get(property_code=to_property)
#                 # token.lock_Tokens(pt_to_receive_decimal)
#                 # restar aqui para que refleje en la psicina de from Pool property , para descontar cusntos tokens estam available porque han comprado tokens
#                 # Verificar si el PropertyToken ya existe para este usuario y propiedad
#                 property_token, created = PropertyToken.objects.get_or_create(
#                     property_code=to_property,
#                     token_code=to_ptoken,
#                     owner_user_code=request.user,
#                     defaults={"number_of_tokens": pt_to_receive_decimal}  # Si es nuevo, asignamos el número de tokens
#                 )

#                 if not created:
#                     property_token.number_of_tokens += pt_to_receive_decimal  # Si ya existe, sumamos tokens
#                     property_token.save()

#                 to_ptoken.tokens_available -= pt_to_receive_decimal 
#                 to_ptoken.save()

#                 # Crear la transacción
#                 Transaction.objects.create(
#                     property_id=to_property,
#                     transaction_owner_code=request.user,
#                     token_code=to_ptoken,
#                     transaction_amount=converted_usdc_to_receive,
#                     transaction_tokens_amount=pt_to_receive_decimal,
#                     transaction_type=Transaction.TransactionType.BUY,
#                     transaction_date=timezone.now(),
#                 )

#                 message = f"New investment  for {user.name if user.is_authenticated else 'Guest'}"
                
#                 # Enviar el mensaje al grupo 'notifications'
#                 async_to_sync(channel_layer.group_send)(
#                     "notifications",  # Nombre del grupo
#                     {
#                         "type": "send_notification", 
#                         "message": message
#                     }
#                 )


#                 return Response({"message": "Investment and transaction successfully saved."}, status=200)
            
#             elif(investment_type == "tokenToToken"):
#                 converted_usdc_to_receive = Decimal(invested_usdc_amount) / Decimal(10**6)
#                 converted_pt_used = Decimal(property_tokens)/ Decimal(10**8)

#                 #FROM PROPERTY INSTANCE
#                 property = Property.objects.get(property_blockchain_adress=from_pool_address)
#                 from_user_ptoken = Token.objects.get(property_code=property)
#                 from_user_ptoken.lock_Tokens(converted_pt_used)

#                 #TARGET PROPERTY INSTANCE
#                 to_property = Property.objects.get(property_blockchain_adress=pool_address)
#                 to_user_ptoken = Token.objects.get(property_code=to_property)

                
#                 to_user_ptoken.tokens_available -= pt_to_receive_decimal 
#                 to_user_ptoken.save()

#                 #CHECK IF THE USER ALREADY HAS THOSE PROPERTY TOKENS, OTHERWISE CREATE AN INTANCE 
#                 property_token, created = PropertyToken.objects.get_or_create(
#                     property_code=to_property,
#                     token_code=to_user_ptoken,
#                     owner_user_code=request.user,
#                     defaults={"number_of_tokens": pt_to_receive_decimal}  
#                 )

#                 if not created:
#                     property_token.number_of_tokens += pt_to_receive_decimal  # Si ya existe, sumamos tokens
#                     property_token.save()
                
#                  # CREATE THE TRANSACTION
#                 Transaction.objects.create(
#                     property_id=property,
#                     transaction_owner_code=request.user,
#                     token_code=from_user_ptoken,
#                     transaction_amount=converted_usdc_to_receive,
#                     transaction_tokens_amount=pt_to_receive_decimal,
#                     transaction_type=Transaction.TransactionType.BUY,
#                     transaction_date=timezone.now(),
#                 )


#                 message = f"New notification for {user.name if user.is_authenticated else 'Guest'}"
                
#                 # Enviar el mensaje al grupo 'notifications'
#                 async_to_sync(channel_layer.group_send)(
#                     "notifications",  # Nombre del grupo
#                     {
#                         "type": "send_notification", 
#                         "message": message
#                     }
#                 )

#                 return Response({"message": "We can proceed."}, status=200)
            
#             else:
#                 return Response({"error": "Invalid investment type."}, status=400)
                        

#         except Property.DoesNotExist:
#             return Response({"error": "Property not found."}, status=400)
#         except Token.DoesNotExist:
#             return Response({"error": "Token not found."}, status=400)
#         except Exception as e:
#             return Response({"error": str(e)}, status=400)


























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

#     function tokenToTokenTrade(address toPoolAddress, uint256 investAmount , uint256 propertyId,  string calldata cidUrl ) external {
#         address poolAssetOwnerTarget = TPPTrader(toPoolAddress)._ASSET_OWNER_();
#         // Verifica si el sender es el mismo que el propietario del activo
#         require(msg.sender != poolAssetOwnerTarget, "CANNOT_INVEST_IN_YOUR_OWN_ASSET"); 
        
#         // Verify sufficient unlocked tokens in the pool
#         uint256 availableTokens = getAvailableTokensToInvest(); 
#         emit DebugLog("Available tokens before trade", availableTokens);
#         require(investAmount <= availableTokens, "INSUFFICIENT_PROPERTY_TOKENS_ON_YOUR_POOL");
        
#         // check how many tokens already the msg.sender has of the user(POOLB)  
#         checkOwnershipLimit(msg.sender, toPoolAddress, investAmount);

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


#         function trySendToBackend(address wallet, uint256 num1, uint256 num2) external {
#         // Calcular la suma
#         uint256 totalSum = num1 + num2;

#         // Emitir el evento con los datos relevantes
#         emit SentToBackend(wallet, totalSum);
#     }
        
#     }

