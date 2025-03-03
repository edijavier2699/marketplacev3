

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Order,Trade
from .serializers import OrderSerializer,CreateOrderSerlizer,OrderSerializerOrderbook,TradeSerializer,TradeListViewSerializer
from users.authentication import Auth0JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny,BasePermission
from property.models import Property
from django.shortcuts import get_object_or_404
from django.db.models import Q,F,Case,When,IntegerField
from django.db import transaction
from property.models import PropertyToken



class OrderListView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializerOrderbook

    # GET ALL ORDERS
    def get(self, request):
        try:
            # Anotar las prioridades de ordenamiento y filtrar por tipo al serializar
            valid_orders = Order.objects.filter(order_status="valid").annotate(
                sort_priority=Case(
                    When(order_type="buy", then=-1),  # Prioridad más alta para "buy"
                    When(order_type="sell", then=1),  # Prioridad más baja para "sell"
                    default=0,
                    output_field=IntegerField()
                )
            ).order_by('sort_priority', 'order_price')  # Ordenar por prioridad y precio

            # Serializar directamente las órdenes de compra y venta
            serializer_buy = self.serializer_class(
                valid_orders.filter(order_type="buy"), many=True
            )
            serializer_sell = self.serializer_class(
                valid_orders.filter(order_type="sell"), many=True
            )

            # Construir la respuesta
            response_data = {
                "buyOrders": serializer_buy.data,
                "sellOrders": serializer_sell.data,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            # Manejo de errores con un mensaje claro
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserOrderListView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    # GET ORDERS BY USER AND TYPE
    def get(self, request, order_type):
        try:
            user_id = request.user.id
            if order_type.lower() not in ['sell', 'buy']:
                return Response(
                    {"error": "Invalid order type. Please use 'sell' or 'buy'."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user_orders = Order.objects.filter(order_owner=user_id, order_type=order_type.lower(), order_status="valid")
            serializer = self.serializer_class(user_orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class OrderDetailView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]


    @transaction.atomic
    def post(self, request, itemId=None):
        try:
            user_id = request.user.id
            if not itemId:
                return Response(
                    {"error": "Property reference number is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Verificar si la propiedad existe
            try:
                property_obj = Property.objects.get(reference_number=itemId)
            except Property.DoesNotExist:
                return Response(
                    {"error": f"Property with reference number {itemId} does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Crear el serializer con los datos
            serializer = CreateOrderSerlizer(data={**request.data, "order_owner": user_id, "property": property_obj.id})

            if serializer.is_valid():
                order = serializer.save()
                if(order.order_type == "sell"):
                    # Actualización atómica de los tokens
                    tokens_updated = PropertyToken.objects.filter(
                        owner_user_code=user_id, 
                        property_code=property_obj
                    ).filter(
                        number_of_tokens__gt=0  # Filtra solo si hay tokens disponibles
                    ).update(
                        number_of_tokens=F('number_of_tokens') - order.order_quantity
                    )

                    if tokens_updated == 0:
                        # Si no se actualizaron tokens, significa que no hay suficientes
                        return Response(
                            {"error": "Insufficient tokens for sell order."},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                # Devuelve la respuesta con el ID de la nueva oferta de compra
                buy_offer_id = order.id
                return Response(
                    {"buyOfferId": buy_offer_id},
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


    def put(self, request, referenceNumber, order_status):
        try:
            user_id = request.user.id
            # Get the order to update
            order_to_update = Order.objects.get(order_reference_number=referenceNumber)

            # Check if the logged-in user is the owner of the order
            if order_to_update.order_owner.id != user_id:
                return Response(
                    {"error": "You are not authorized to update this order"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Check if the order status is valid
            if order_status not in [status[0] for status in Order.ORDER_STATUS_CHOISES]:
                return Response(
                    {"error": "Invalid order status value."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update the order's status
            order_to_update.order_status = order_status
            order_to_update.save()

            # Return a simple 200 OK response to indicate the update was successful
            return Response({"message": "Order status updated successfully"}, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response(
                {"error": "Order with reference number does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            


    def delete(self, request, referenceNumber):
        try:
            user_id = request.user.id
            order_to_delete = Order.objects.get(order_reference_number=referenceNumber)

            if order_to_delete.order_owner.id != user_id:
                return Response(
                    {"error": "You are not authorized to delete this order."},
                    status=status.HTTP_403_FORBIDDEN
                )

            order_to_delete.delete()
            return Response(
                {"message": f"Order with reference number has been successfully deleted."},
                status=status.HTTP_200_OK
            )
        except Order.DoesNotExist:
            return Response(
                {"error": f"Order with reference number  does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )




class TradeListView(APIView):
    """
    List all trades for authenticated users.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            trades = Trade.objects.all()
            if not trades.exists():
                return Response(
                    {"message": "No trades found."},
                    status=status.HTTP_204_NO_CONTENT
                )

            serializer = TradeListViewSerializer(trades, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            # Loguear el error aquí si tienes un sistema de logs
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TradeExecutedBlockchain(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        trade_data = request.data

        # Extraer datos del evento recibido
        sell_offer_id = trade_data.get("sellOfferId")
        buy_offer_id = trade_data.get("buyOfferId")
        seller_address = trade_data.get("seller")
        buyer_address = trade_data.get("buyer")
        trade_price = trade_data.get("totalPrice")
        trade_quantity = trade_data.get("tokensTransferred")

        # Validar que los datos requeridos están presentes
        if not all([sell_offer_id, buy_offer_id, seller_address, buyer_address, trade_price, trade_quantity]):
            return Response({"error": "Datos incompletos en el evento recibido"}, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"sell_offer_id: {sell_offer_id}, buy_offer_id: {buy_offer_id}")

        try:
            # Buscar las órdenes relacionadas
            sell_order = get_object_or_404(Order, order_blockchain_identifier=sell_offer_id)
            print(sell_order)
            buy_order = get_object_or_404(Order, id=buy_offer_id, order_type="buy")

            print(buy_order)
            Order.objects.filter(order_blockchain_identifier=sell_offer_id).update(order_status="processed")
            Order.objects.filter(id=buy_offer_id, order_type="buy").update(order_status="processed")


            # Crear un registro de la transacción
            trade = {
                "seller_address": seller_address,
                "buyer_address": buyer_address,
                "related_sell_order": sell_order.id,
                "related_buy_order": buy_order.id,
                "trade_price": trade_price,
                "trade_quantity": trade_quantity
            }
            serializer = TradeSerializer(data=trade)

            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Transacción registrada con éxito", "trade": serializer.data}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        





# class OrderDetailView(APIView):
#     authentication_classes = [Auth0JWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def post(self, request, itemId=None):
#         try:
#             user_id = request.user.id
#             if not itemId:
#                 return Response(
#                     {"error": "Property reference number is required."},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#             # Verificar si la propiedad existe
#             try:
#                 property_obj = Property.objects.get(reference_number=itemId)
#             except Property.DoesNotExist:
#                 return Response(
#                     {"error": f"Property with reference number {itemId} does not exist."},
#                     status=status.HTTP_404_NOT_FOUND
#                 )

#             # Crear el serializer con los datos
#             serializer = CreateOrderSerlizer(data={**request.data, "order_owner": user_id, "property": property_obj.id})

#             if serializer.is_valid():
#                 order = serializer.save()

#                 # Verificar si la orden es de tipo "sell" y proceder a descontar los tokens
#                 if order.order_type == "sell":
#                     # Obtener el usuario que realizó la orden
#                     user = CustomUser.objects.get(id=user_id)

#                     # Verificar si el usuario tiene suficientes tokens
#                     required_tokens = 10  # Definir los tokens necesarios para la venta (puedes cambiarlo según tu lógica)
                    
#                     if user.tokens < required_tokens:
#                         return Response(
#                             {"error": "Insufficient tokens to complete the sell order."},
#                             status=status.HTTP_400_BAD_REQUEST
#                         )
                    
#                     # Descontar los tokens
#                     user.tokens -= required_tokens
#                     user.save()

#                 # El id de la orden es el buyOfferId que se crea automáticamente al guardar
#                 buy_offer_id = order.id

#                 return Response(
#                     {"buyOfferId": buy_offer_id},
#                     status=status.HTTP_201_CREATED
#                 )
#             else:
#                 return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
#         except Exception as e:
#             return Response(
#                 {"error": str(e)},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )
