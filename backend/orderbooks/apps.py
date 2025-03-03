from django.apps import AppConfig

class OrderbooksConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'orderbooks'

    def ready(self):
        from .signals import order_created_or_updated, trade_created