# your_project/routing.py
from django.urls import path
from transactions.consumers import InvestmentConsumer

websocket_urlpatterns = [
    path('ws/investment/', InvestmentConsumer.as_asgi()),  # Ruta para WebSocket
]
