# backend/asgi.py
import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from django.urls import path
from transactions.consumers import InvestmentConsumer
from notifications.consumers import NotificationConsumer  # Importa el consumer de notificaciones


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Maneja las solicitudes HTTP
    "websocket": AuthMiddlewareStack(  # Usa el middleware de autenticación para WebSocket
        URLRouter([
            path('ws/investments/', InvestmentConsumer.as_asgi()), 
            path('ws/notifications/', NotificationConsumer.as_asgi()),  # WebSocket de notificaciones
        ])
    ),
})
