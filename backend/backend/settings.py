"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 5.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
from datetime import datetime, timedelta
from decouple import config
import os
from django.core.cache import cache
from urllib.parse import urlparse
import ssl


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
DEBUG = config('DEBUG', default=True, cast=bool)


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-7rd+ggxl@zmwna&zce-n20qv!s-&jacl9eu8ivyo-#d*$kk9me'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    'octopus-app-zlell.ondigitalocean.app',
    '127.0.0.1',
    'localhost',
    'localhost:5173',
    'localhost:5174',
    "tokunize.com",
    "web-app-dev-omega.vercel.app"
    "octopus-app-i532o.ondigitalocean.app"
]




# Application definition

INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "property",
    'rest_framework', #Django REST Framework
    'corsheaders', #CORS]
    'django_filters',
    'users',
    'wallet',
    'notifications',
    'orderbooks',
    'channels',
    'blockchain',
    'transactions',
    'django_celery_results',
    'event_listener'
]



CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://octopus-app-zlell.ondigitalocean.app",
    "https://dev-2l2jjwfm5ekzae3u.us.auth0.com",
    "http://localhost:5174",
    "https://www.tokunize.com",
    "https://web-app-dev-omega.vercel.app",
    "http://127.0.0.1:5173", 
    "https://octopus-app-i532o.ondigitalocean.app"
]


CSRF_TRUSTED_ORIGINS = [
    "https://octopus-app-zlell.ondigitalocean.app",
    "http://localhost:5173",
    "https://www.tokunize.com",
    "https://web-app-dev-omega.vercel.app",
    "https://octopus-app-i532o.ondigitalocean.app"
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]



ROOT_URLCONF = 'backend.urls'

CORS_ALLOW_CREDENTIALS = True  # Si estás usando cookies o autenticación

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]





AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]



# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

AUTH_USER_MODEL = 'users.customuser'


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SECRET_KEY = 'your-secret-key'  
ALGORITHM = 'RS256'

# settings.py

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'users.authentication.Auth0JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 5, 

    'DEFAULT_THROTTLE_CLASSES': [
        'throttling.CustomAnonRateThrottle',  # Sin espacios extra
        'rest_framework.throttling.UserRateThrottle',  # Limita a los usuarios autenticados
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/minute',  # Limita a 5 solicitudes por minuto para usuarios anónimos
        'user': '100/minute',  # Limita a 10 solicitudes por minuto para usuarios autenticados
    },
}


X_FRAME_OPTIONS = 'DENY'  # Esto evitará que tu página se cargue dentro de un iframe en cualquier otro dominio



import cloudinary

# Configura tus credenciales de Cloudinary
cloudinary.config(
    cloud_name='dhyrv5g3w',
    api_key='577211589791536',
    api_secret='LhkuFGSvQWYkISi9a0PONdfj27o'
)


WSGI_APPLICATION = 'backend.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DATABASE_NAME'),
        'USER': config('DATABASE_USER'),
        'PASSWORD': config('DATABASE_PWD'),
        'HOST': config('DATABASE_HOST'),
        'PORT': config('DATABASE_PORT', cast=int),
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}


ASGI_APPLICATION = 'backend.asgi.application'

# # Cargar variables de entorno
# REDIS_URL = os.environ.get('REDIS_URL')
# REDIS_PORT = os.environ.get('REDIS_PORT')
# REDIS_PWD = os.environ.get('REDIS_PWD')
# REDIS_HOST = os.environ.get('REDIS_HOST')


# # Parsear la URL de Redis
# url = urlparse(REDIS_URL)


# # Configuración de CACHES
# CACHES = {
#     'default': {
#         'BACKEND': 'django_redis.cache.RedisCache',
#         'LOCATION': REDIS_URL,
#         'OPTIONS': {
#             'CLIENT_CLASS': 'django_redis.client.DefaultClient',
#         },
#     }
# }
# # Configuración de CHANNEL_LAYERS

# CHANNEL_LAYERS = {
#     'default': {
#         'BACKEND': 'channels_redis.core.RedisChannelLayer',
#         'CONFIG': {
#             'hosts': [(REDIS_HOST, REDIS_PORT)],
#             'password': REDIS_PWD,
#             'ssl': True,
#             'ssl_cert_reqs': ssl.CERT_NONE,  
#         },
#     },
# }
# # Celery Configuración
# CELERY_BROKER_URL = f"{REDIS_URL}"
# CELERY_RESULT_BACKEND = f"{REDIS_URL}"
# CELERY_ACCEPT_CONTENT = ['json']
# CELERY_TASK_SERIALIZER = 'json'
# CELERY_TIMEZONE = 'UTC'

# settings.py

# Configuración de Redis como caché
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",  # Base de datos 1 en Redis
    }
}

# Configuración de Channels con Redis
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}

# Configuración de Celery con Redis
CELERY_BROKER_URL = "redis://127.0.0.1:6379/2"  # Base de datos 2 en Redis
CELERY_RESULT_BACKEND = "redis://127.0.0.1:6379/2"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"



# Configuración de Auth0
AUTH0_DOMAIN = config('AUTH0_DOMAIN')
AUTH0_CLIENT_ID = config('AUTH0_CLIENT_ID')
AUTH0_CLIENT_SECRET = config('AUTH0_CLIENT_SECRET')


#WEB3 PROVIDER VARIBALES 
PROVIDER_TOKEN_URL = config('PROVIDER_TOKEN_URL')
PROVIDER_CLIENT_ID = config('PROVIDER_CLIENT_ID')
PROVIDER_CLIENT_SECRET = config('PROVIDER_CLIENT_SECRET')
PROVIDER_WALLET_URL = config('PROVIDER_TOKEN_URL')
PROVIDER_USERS_VAULT = config('PROVIDER_USERS_VAULT')


