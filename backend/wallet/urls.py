
from django.urls import path
from .views import SaveWalletInBackend,AddFundsWallet,CheckWalletBalance,WalletListApiView

urlpatterns = [
    path('save-wallet/',SaveWalletInBackend.as_view(), name="save-wallet" ),
    path('fund-wallet/',AddFundsWallet.as_view(), name="fund-wallet" ),
    path('balance-wallet/',CheckWalletBalance.as_view(), name="balance-wallet" ), 
    path('overview/',WalletListApiView.as_view(), name="wallet-overview" ), 
]