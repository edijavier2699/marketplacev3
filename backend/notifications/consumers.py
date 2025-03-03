# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Aquí obtienes el usuario desde la sesión
        self.group_name = "notifications"

        # Unir al canal del usuario
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        # Aceptar la conexión WebSocket
        await self.accept()

    async def disconnect(self, close_code):
        # Dejar el grupo del usuario cuando se desconecta
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Enviar mensaje al WebSocket
    async def send_notification(self, event):
        message = event['message'] 

        await self.send(text_data=json.dumps({
            'type': "investment_in",
            'message': message
        }))
