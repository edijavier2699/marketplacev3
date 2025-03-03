# orderbooks/routing.py

from django.urls import re_path

from .consumers import OrderBookConsumer

websocket_urlpatterns = [
    re_path(r'ws/orderbook/$', OrderBookConsumer.as_asgi()),  # Ruta para WebSssocket
]
