from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Notification,ActivityLog
from .serializers import NotificationSerializer,ActivityLogSerializer
from users.authentication import Auth0JWTAuthentication
from users.models import CustomUser
from rest_framework import generics


class NotificationAPIView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

    def post(self, request):
        request.data['user'] = request.user.id 

        # Determinar el tipo de notificación
        notification_type = request.data.get('notification_type', 'user_action')  # Por defecto, 'user_action'
        request.data['notification_type'] = notification_type

        serializer = NotificationSerializer(data=request.data)

        if serializer.is_valid():
            user_notification = serializer.save()  # Guarda la notificación del usuario

            if notification_type == 'user_action':
                # Notificar al administrador
                admin = CustomUser.objects.filter(rol='admin').first()
                if admin:
                    admin_notification_data = {
                        'user': admin.id,
                        'message': f"New action by {request.user.name}: New property submitted'",
                        'is_read': False,
                        'notification_type': 'admin_broadcast'
                    }
                    admin_serializer = NotificationSerializer(data=admin_notification_data)

                    if admin_serializer.is_valid():
                        admin_serializer.save()

            elif notification_type == 'admin_broadcast':
                # Notificar a todos los usuarios excepto al remitente
                users_to_notify = CustomUser.objects.exclude(id=request.user.id)  # Excluir al remitente
                for user in users_to_notify:
                    user_notification_data = {
                        'user': user.id,
                        'message': request.data.get('message'),  # Mensaje a enviar
                        'is_read': False,
                        'notification_type': 'admin_broadcast'
                    }
                    user_serializer = NotificationSerializer(data=user_notification_data)

                    if user_serializer.is_valid():
                        user_serializer.save()

            return Response(NotificationSerializer(user_notification).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id, user=request.user)
            notification.is_read = True
            notification.save()
            serializer = NotificationSerializer(notification)
            return Response(serializer.data)
        except Notification.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)



class ActivityLogListCreateView(generics.ListCreateAPIView):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]  # Asegúrate de que solo los usuarios autenticados puedan acceder a esta vista

    def perform_create(self, serializer):
        # Aquí puedes agregar lógica adicional al crear un nuevo registro
        serializer.save()

