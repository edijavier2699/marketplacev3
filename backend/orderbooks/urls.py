from django.urls import path
from .views import OrderListView, UserOrderListView, OrderDetailView,TradeExecutedBlockchain,TradeListView

urlpatterns = [
    # GET ALL ORDERS
    path('order/', OrderListView.as_view(), name='orderbook-orders'),

    # GET ORDERS BY USER AND TYPE
    path('order/type/<str:order_type>/', UserOrderListView.as_view(), name='user-orders-by-type'),

    # CREATE A NEW ORDER FOR A PROPERTY
    path('order/property/<str:itemId>/', OrderDetailView.as_view(), name='orderbook-property-orders'),

    #UPDATE STATUS OF A ORDER
    path('order/<str:referenceNumber>/status/<str:order_status>/', OrderDetailView.as_view(), name='update-order-status'),

    #URL TO UPDATE THE STATUS OF THE ORDERS  AND CREATE A TRADE ROW RECEIVING THE EVENT FORM THE SMART CONTRACT
    path('blockhain/trade-executed/', TradeExecutedBlockchain.as_view(), name="trade-executed-blockchain"),

    # DELETE AN ORDER
    path('order/delete/<str:referenceNumber>/', OrderDetailView.as_view(), name='order-delete'),

    path('trades/', TradeListView.as_view(), name="trades-list-view")
]
