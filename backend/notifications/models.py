
from django.db import models
from users.models import CustomUser

class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    notification_type = models.CharField(max_length=20, null=True, default="user_action" ,blank=True,  choices=[
        ('user_action', 'User Action'),
        ('admin_broadcast', 'Admin Broadcast')
    ])

    def __str__(self):
        return f'Notification for {self.user.username}: {self.message}'

    class Meta():
        ordering = ['-created_at']  




class ActivityLog(models.Model):
    EVENT_TYPES = [
        ('transaction', 'Transactions'),
        ('rent_payout', 'Rent Payout'),
        ('new_property', 'New Property'),
        ('kyc_status', 'KYC Status'),
    ]
    
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES, db_index=True)  # Agregar índice
    contract_address = models.CharField(max_length=42, null=True, blank=True)  
    involved_address = models.EmailField( db_index=True)  # Agregar índice
    payload = models.JSONField(null=True, blank=True)  # Detalles del evento en formato JSON
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)  # Agregar índice para optimizar ordenamiento y búsquedas

    class Meta:
        indexes = [
            models.Index(fields=['timestamp']),  # Índice para timestamp
            models.Index(fields=['event_type', 'timestamp']),  # Índice compuesto
            models.Index(fields=['involved_address']),  # Índice para involved_address
        ]
        ordering = ['-timestamp']  # Ordenar por fecha descendente por defecto

    def __str__(self):
        return f"{self.event_type} - {self.timestamp}"
