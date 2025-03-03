# orderbook/consumers.py

from channels.generic.websocket import AsyncWebsocketConsumer
import json
from uuid import UUID  # Importar UUID
from .models import Order
from channels.db import database_sync_to_async

from decimal import Decimal
from datetime import datetime

class OrderBookConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Definir el grupo de WebSocket para la orden de libros
        self.room_group_name = 'orderbooks'

        # Unirse al grupo de WebSocket
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        try:
            # Obtener las órdenes activas desde la base de datos
            orders_data = await self.get_order_data()

            # Aceptar la conexión WebSocket antes de enviar cualquier mensaje
            await self.accept()

            # Enviar los datos iniciales de las órdenes activas cuando se conecta
            await self.send(text_data=json.dumps({
                'type': 'initial_data',
                'orders': orders_data  # Enviar las órdenes activas al cliente
            }))
        except Exception as e:
            # Si hay un error en la obtención de las órdenes, manejarlo
            await self.send(text_data=json.dumps({
                'error': str(e)
            }))
            await self.close()

    async def disconnect(self, close_code):
        # Dejar el grupo cuando se desconecte
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """ Lógica para recibir mensajes del cliente WebSocket (si es necesario) """
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Responder al cliente (si es necesario)
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def send_order_update(self, event):
        """ Método llamado para enviar actualizaciones cuando una orden cambia """
        order_data = event['order_data']
        # Convertir UUID, Decimal y datetime a cadenas o números antes de enviar
        order_data = self.convert_uuids_and_decimals_and_datetimes_to_strings(order_data)
        await self.send(text_data=json.dumps({
            'order_data': order_data
        }))

    async def send_trade_update(self, event):
        """ Método llamado para enviar actualizaciones cuando un trade se ejecuta """
        trade_data = event['trade_data']
        # Convertir UUID, Decimal y datetime a cadenas o números antes de enviar
        trade_data = self.convert_uuids_and_decimals_and_datetimes_to_strings(trade_data)
        await self.send(text_data=json.dumps({
            'trade_data': trade_data
        }))

    @database_sync_to_async
    def get_order_data(self):
        """ Lógica para obtener las órdenes activas, puedes personalizar la consulta según tus necesidades """
        orders = Order.objects.filter(order_status="valid")  # Obtén solo las órdenes activas
        orders_data = list(orders.values())  # Retorna las órdenes como una lista de diccionarios
        # Convertir UUID, Decimal y datetime a cadenas o números
        return [self.convert_uuids_and_decimals_and_datetimes_to_strings(order) for order in orders_data]

    def convert_uuids_and_decimals_and_datetimes_to_strings(self, data):
        """ Convierte valores UUID, Decimal y datetime en un diccionario o lista a strings o números """
        if isinstance(data, dict):
            # Recorrer el diccionario y convertir valores UUID, Decimal y datetime
            return {key: self.convert_value(value) for key, value in data.items()}
        elif isinstance(data, list):
            # Si es una lista, aplicar la conversión a cada elemento
            return [self.convert_uuids_and_decimals_and_datetimes_to_strings(item) for item in data]
        return data  # Si no es un diccionario ni lista, devolver tal cual

    def convert_value(self, value):
        """ Convierte el valor a string, float o isoformat según su tipo """
        if isinstance(value, UUID):
            return str(value)  # Convertir UUID a string
        elif isinstance(value, Decimal):
            return float(value)  # Convertir Decimal a float
        elif isinstance(value, datetime):
            return value.isoformat()  # Convertir datetime a string en formato ISO 8601
        return value  # Devolver el valor tal cual si no es UUID, Decimal ni datetime