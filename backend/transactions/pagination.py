# pagination.py

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from collections import OrderedDict

class CustomPagination(PageNumberPagination):
    page_size = 1  # Número de elementos por página (puedes configurarlo)
    page_size_query_param = 'page_size'  # Parámetro de consulta para definir el tamaño de la página
    max_page_size = 100  # Tamaño máximo de la página (puedes configurarlo)
    
