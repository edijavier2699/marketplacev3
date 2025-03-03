from django.urls import path
from .views import TransactionListview,TransactionVolumeMarketplaceProperty,TransactionPostTradeListview

urlpatterns = [
 #TRANSACTIOS GET AND POST
    path('user/all/', TransactionListview.as_view(), name='transactions-list'),
    path('investment/property/<str:reference_number>/', TransactionListview.as_view(), name='investmetn-transaction'),
    path('investment/property/post-trade/<str:reference_number>/', TransactionPostTradeListview.as_view(), name='investment-transaction-post-trade'),
    path('all/',TransactionListview.as_view(), name="user-transaction-list" ),
    path('property/marketplace/<str:reference_number>/', TransactionVolumeMarketplaceProperty.as_view(), name='single-property-transactions-public'),
]   
