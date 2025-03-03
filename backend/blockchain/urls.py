from django.urls import path
from .views import TokenListView

urlpatterns = [
    
 #TRANSACTIOS GET AND POST
    path('tokens/list/', TokenListView.as_view(), name='all-token-list'),
]
