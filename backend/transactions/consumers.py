# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class InvestmentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Usamos un grupo simple, no relacionado con el usuarioooo
        self.group_name = "investment_group"
        user_id = self.scope["user"].id  # Suponiendo que el usuario está autenticado y tiene un ID

        print(user_id)

        # Unir al grupo de WebSocket
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        # Aceptamos la conexión
        await self.accept()

    async def disconnect(self, close_code):
        # Dejar el grupo de WebSocket cuando el cliente se desconecta
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def investment_tokenToToken(self, event):
        # Recibimos el mensaje del canal (grupo)
        message = event['message']  # Aquí ya tenemos el diccionario con la clave 'message'

        # Enviar el mensaje al WebSocket
        await self.send(text_data=json.dumps({
            'type': 'tokenToToken',  # Tipo de mensaje
            'message': message.get('message', 'No message available'),  # Acceder de manera segura a la clave
            'property_tokens': message.get('property_tokens', 0),  # Tokens a utilizar
            'target_asset_address': message.get('target_asset_address', 'No address available'),  # Dirección de la propiedad
            'from_asset_address': message.get('from_asset_address', 'No address available'),
            'target_asset_ipfs': message.get('target_asset_ipfs', 'No ipfs available'),
            'batch_id': message.get('batch_id', 'No batch available'),
            'utility_tokens': message.get('utility_tokens', 0), 
            'pt_to_receive': message.get('pt_to_receive', 0)
        }))

    async def investment_usdcTrade(self, event):
        """
        Maneja mensajes de éxito en la inversión.
        """
        message = event['message']  # Aquí ya tenemos el diccionario con la clave 'message'
        
        # Enviar el mensaje al WebSocket
        await self.send(text_data=json.dumps({
            'type': 'usdcTrade', 
            'message': message.get('message', 'No message available'),  
            'from_asset_address': message.get('from_asset_address', 'No address available')
        }))
    

    async def investment_error(self, event):
        """
        Maneja mensajes de error en la inversión.
        """
        error_message = event['message']  # Aquí recibimos el mensaje de error
        
        # Enviar el mensaje de error al WebSocket
        await self.send(text_data=json.dumps({
            'type': 'error',  # Tipo de mensaje de error
            'message': error_message,  # El mensaje de error que recibimos
        }))
