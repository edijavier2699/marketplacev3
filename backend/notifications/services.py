from django.db import transaction
from .models import Notification
from .serializers import NotificationSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import logging

logger = logging.getLogger(__name__)

@transaction.atomic
def create_investment_notification(user, investment_type, ):
    """
    Crea notificación de inversión en base de datos
    """
    try:
        return Notification.objects.create(
            user=user,
            message=f"New {investment_type} investment completed",
            notification_type="user_action"
        )
    except Exception as e:
        logger.error(f"Error creating notification: {str(e)}")
        raise

def send_realtime_notification(notification):
    """
    Envía notificación via WebSocket
    """
    try:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{notification.user.id}",
            {
                "type": "send.notification",
                "notification": NotificationSerializer(notification).data
            }
        )
    except Exception as e:
        logger.error(f"Error sending realtime notification: {str(e)}")