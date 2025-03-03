from __future__ import absolute_import, unicode_literals
from django.conf import settings  # Importación correcta de settings

# Esto se asegura de que Django se haya configurado antes de que se importe Celery
import os

from celery import Celery

# Establece el valor por defecto para el 'DJANGO_SETTINGS_MODULE'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Crea una instancia de Celery
app = Celery('backend')

# Carga la configuración desde el archivo de configuración de Django
app.config_from_object('django.conf:settings', namespace='CELERY')
# Configura el reintento de la conexión al broker en el inicio
app.conf.broker_connection_retry_on_startup = True


# Autodiscover las tareas en todos los archivos tasks.py de las aplicaciones
# app.autodiscover_tasks(['wallet'])
app.autodiscover_tasks()
# Rutas personalizadas de tareas
app.conf.task_routes = {
    'investments.tasks.process_investment': {'queue': 'investment_queue'},
}
