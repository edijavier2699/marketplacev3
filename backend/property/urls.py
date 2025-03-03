from django.urls import path
from .views import (
    PropertyListView,
    PropertyCreateUpdateView,
    UserInvestmentSummaryAPIView,
    MarketplaceListView,
    PropertyDetailLandingPage,
    PropertyManagmentListView,
    AdminOverviewListView,
    InvestorAssetsGetView,
    PropertySmartContract,
    PropertyTradeSellListView,
    InvestorInvestedProperties,
    AssetToAssetProperties,
    PropertyInvestmentView,
    SearchPropertyApiView
)

urlpatterns = [
    # Property related URLs
    path('properties/private/', PropertyListView.as_view(), name='property-list'),
    path('create/', PropertyCreateUpdateView.as_view(), name='property-create-update'),
    
# -------------------------------------------------------

    #NEW URLS IMPROVED THE VIEWS AND SERIALIZER

    #MARKETPLACE PROPERTY URLS 
    path("marketplace-list/",MarketplaceListView.as_view(), name="marketplace-property-list" ),
    path('single/<str:reference_number>/', PropertyDetailLandingPage.as_view(), name='single-property-details'),
    path('all/list/', AssetToAssetProperties.as_view(), name='asset-to-asset-details'),
    path('investment/<str:reference_number>/', PropertyInvestmentView.as_view(), name="property-investment-details"),

    #DASHBOARD ADMIN URLS 
    path("property-managment/",PropertyManagmentListView.as_view(), name="property-managment-admin" ),
    path("overview-dashboard-admin/",AdminOverviewListView.as_view(), name="overview-dashboard-admin" ),

    #INVESTORS
    path('investment-summary/', UserInvestmentSummaryAPIView.as_view(), name='investor-overview'),
    path('investor-assets/', InvestorAssetsGetView.as_view(), name="investor-assets"),
    path('search/<str:referenceNumber>/', SearchPropertyApiView.as_view(), name="search-property-ref-number"),


    #BLOCKCHAIN
    path('smart-contract/<str:referenceNumber>/', PropertySmartContract.as_view(), name="property-pool-address"),
    #ALL SOLD PROPERTIES FOR BUY TAB ON THE TRADING ACCORDION
    path('sold/', PropertyTradeSellListView.as_view(), name="sold-properties"),
    #PROPERTIES OWNED BY AND INVESTOR , ALL THE INVESTED PROPERTIES
    path('invested-properties/', InvestorInvestedProperties.as_view(), name="investor-invested-properties"),


]   
