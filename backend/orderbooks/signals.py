# orderbook/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Order, Trade

@receiver(post_save, sender=Order)
def order_created_or_updated(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    print(f"Signal triggered for Order ID {instance.id}")  # Debugging line

    # Convertir UUID a string explícitamente
    order_data = {
        'order_type': instance.order_type,
        'order_price': instance.order_price,
        'order_quantity': str(instance.order_quantity),
        'order_status': instance.order_status,
        'order_owner': str(instance.order_owner.id), 
        'property': str(instance.property.reference_number),  # Convertir UUID a string
    }

    # Enviar la actualización de la orden al grupo
    async_to_sync(channel_layer.group_send)(
        'orderbook_orderbook', 
        {
            'type': 'send_order_update',
            'order_data': order_data,
        }
    )

@receiver(post_save, sender=Trade)
def trade_created(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()

        # Convertir UUID a string explícitamente si es necesario
        trade_data = {
            'trade_id': str(instance.id),  # Convertir UUID o ID a string
            'trade_price': instance.trade_price,
            'trade_quantity': str(instance.trade_quantity),
            'executed_at': instance.executed_at,
            'buyer': str(instance.buyer_address),  # Convertir UUID a string si es necesario
            'seller': str(instance.seller_address),  # Convertir UUID a string si es necesario
        }

        # Enviar la actualización del trade al grupo
        async_to_sync(channel_layer.group_send)(
            'orderbook_orderbook',
            {
                'type': 'send_trade_update',
                'trade_data': trade_data,
            }
        )
