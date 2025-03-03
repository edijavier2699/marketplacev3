from rest_framework import serializers
from property.serializers import TradingTablesPropertyInfo
from .models import Order,Trade


class CreateOrderSerlizer(serializers.ModelSerializer):
        
        class Meta:
            model = Order
            fields = [
                "order_type",
                "order_price",
                "order_quantity",
                "order_owner",
                "property",
                "order_status",
                "order_blockchain_identifier"
            ]

class OrderSerializerOrderbook(serializers.ModelSerializer):
     
     class Meta:
          model = Order
          fields = [
                "order_type",
                "order_price",
                "order_quantity",
                "order_status"
          ]

# class OrderSerializerTableRows(serializers.ModelSerializer):

#     class Meta:
#         model = Order
#         fields = [
#             "order_type",
#             "order_price",
#             "order_quantity",
#             "created_at",
#             "order_reference_number",
#             "order_owner",
#             "order_status",
#         ]



class OrderSerializer(serializers.ModelSerializer):
    # Usamos 'TradingTablesPropertyInfo' para serializar la propiedad relacionada
    property = TradingTablesPropertyInfo(read_only=True)

    class Meta:
        model = Order
        fields = [
            "order_blockchain_identifier",
            "order_type",
            "order_price",
            "order_quantity",
            "created_at",
            "order_reference_number",
            "order_owner",
            "property",
            "order_status",
        ]

    def to_representation(self, instance):
        # Obtenemos la representación original
        representation = super().to_representation(instance)
        
        # Transformamos los datos para el formato requerido
        property_data = representation.get("property", {})
        
        # Estructura personalizada según lo que necesitas
        transformed_data = {
            "bcId":representation.get("order_blockchain_identifier"),
            "title": property_data.get("title", ""),
            "image": property_data.get("first_image", ""),
            "location": property_data.get("location", ""),
            "created_at": representation.get("created_at", ""),
            "orderStatus": representation.get("order_status", ""),
            "referenceNumber": representation.get("order_reference_number"),
            # "totalTokens": property_data.get("tokens", [{}])[0].get("total_tokens", 0),
            # "availableTokens": property_data.get("tokens", [{}])[0].get("tokens_available", 0),
            "orderTokenPrice": representation.get("order_price", 0),
            "orderQuantity": representation.get("order_quantity", ""),
            "propertyScrowAddress": property_data.get("property_scrow_address", "")
        }

        return transformed_data



class TradeSerializer(serializers.ModelSerializer):
     
     class Meta():
        model = Trade
        fields = [
               "seller_address",
               "buyer_address",
               "related_sell_order",
               "related_buy_order",
               "trade_price",
               "trade_quantity"
          ]
        
#SERIALIZER FOR THE TRADES

class TradeListViewSerializer(serializers.ModelSerializer):
     
     class Meta():
          model = Trade
          fields = '__all__'