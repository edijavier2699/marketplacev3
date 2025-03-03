from django.urls import path
from .views import SyncUserView, UserDetailView, UserListView, UserProfileView,hola_view,ResendEmailVerification,EmailCheckView

urlpatterns = [
    # Ruta para sincronizar o crear un usuario basado en el JWT
    path('sync-user/', SyncUserView.as_view(), name='sync-user'),

    # Ruta para obtener, actualizar o eliminar un usuario específico
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    # Ruta para listar todos los usuarios
    path('users/', UserListView.as_view(), name='user-list'),

    # Ruta para obtener el perfil del usuario autenticado
    path('profile/', UserProfileView.as_view(), name='user-profile'),

    path('resend-email/', ResendEmailVerification.as_view(), name='resend_email'),


    path('hola/', hola_view, name='hola'), 
 

    #corrected  urls for better optimization
    path('check/email/<str:email>/', EmailCheckView.as_view(), name='resend_email'),

]
