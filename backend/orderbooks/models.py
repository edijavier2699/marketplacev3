from django.db import models

# Create your models here.
from django.db import models
import uuid  
from users.models import CustomUser 
from property.models import Property

class Order(models.Model):
    ORDER_TYPE_CHOICES = [
        ('buy', 'Buy'),
        ('sell', 'Sell'),
    ]
    ORDER_STATUS_CHOISES = [
        ('expired', 'Expired'),
        ('valid', 'Valid'),
        ('canceled', 'Canceled'),
        ('processed', 'Processed')
    ]

    order_status = models.CharField(
        max_length=10, 
        choices=ORDER_STATUS_CHOISES, 
        help_text="the status of the order", 
        default="valid"
    )

    order_reference_number = models.UUIDField(
        default=uuid.uuid4,  
        editable=False,    
        unique=True,     
        help_text="Unique reference number for the order."
    )
    order_type = models.CharField(
        max_length=4,
        choices=ORDER_TYPE_CHOICES,
        help_text="The type of order: Buy or Sell."
    )
    order_price = models.PositiveIntegerField(
        help_text="The price per unit for the order."
    )
    order_quantity = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        help_text="The quantity of the asset in the order."
    )
    order_owner = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE,  # Si el usuario es eliminado, también se eliminarán sus órdenes
        related_name="orders",     # Para acceder a todas las órdenes de un usuario con user.orders
        help_text="The user who owns this order."
    )   
    order_blockchain_identifier = models.CharField( null=True, blank=True)
    property =  models.ForeignKey(Property, on_delete=models.CASCADE, related_name="property_orders_trading", help_text="the property linked to the orders")
    created_at = models.DateTimeField(auto_now_add=True, help_text="The time when the order was created.")

   
    def __str__(self):
        return f"created"
    
    class Meta:
        ordering = ['-created_at'] 
        indexes = [
            models.Index(fields=['order_type']),  # Índice para el tipo de orden (buy/sell)
            models.Index(fields=['order_status']),  # Índice para el estado de la orden (valid, expired, etc.)
            models.Index(fields=['order_price']),  # Índice para el precio de la orden
            models.Index(fields=['order_type', 'order_price']),  # Índice combinado para consultas por tipo y precio
        ]

   
class Trade(models.Model):
    seller_address = models.CharField(
        max_length=42,
        null=True,
        blank=True,
        help_text="The address of the user who put the sell order."
    )
    buyer_address = models.CharField(
        max_length=42,
        null=True,
        blank=True,
        help_text="The address of the user who put the buy order."
    )
    related_sell_order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="trades_as_sell_order",  # Relación inversa única para sell orders
        help_text="The sell order ID associated with this trade."
    )
    related_buy_order = models.ForeignKey(
        Order,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="trades_as_buy_order",  # Relación inversa única para buy orders
        help_text="The buy order ID associated with this trade."
    )
    trade_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="The price at which the trade was executed."
    )
    trade_quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="The quantity traded."
    )
    executed_at = models.DateTimeField(
        auto_now_add=True,
        help_text="The time when the trade was executed."
    )

    def __str__(self):
        return f"Trade - {self.trade_quantity} @ {self.trade_price}"

    class Meta:
        ordering = ['-executed_at']  # Ordena por fecha de ejecución de más reciente a más antiguo.
