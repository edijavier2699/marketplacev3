import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import NotificationsSkeleton from "../skeletons/notificationsSkeleton";
import { usePatchAxiosRequest } from "@/hooks/usePatchAxiosRequest";

interface Notification {
  id: number;
  message: string;
  created_at: string;
  is_read: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Variable para manejar el error

  // Hook para marcar notificación como leída
  const [_, markAsRead] = usePatchAxiosRequest<
    Notification,
    { is_read: boolean }
  >(
    `${import.meta.env.VITE_APP_BACKEND_URL}notifications/`, // Base URL, se complementará en cada llamada
    (updatedNotification) => {
      // Actualiza el estado localmente para reflejar el cambio sin recargar la página
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === updatedNotification.id ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0)); // Disminuye el contador de no leídas
    },
    (error) => {
      // Si ocurre un error, guardamos el mensaje de error
      setErrorMessage(error); 
    }
  );

    useEffect(() => {  
      const socket = new WebSocket('ws://127.0.0.1:8000/ws/notifications/');
      socket.onmessage = async () => { 
      setUnreadCount(prev => prev + 1);
      };
      return () => {
        socket.close();
      };
    }, []); 

  // Obtener notificaciones desde la API
  const { loading } = useGetAxiosRequest<Notification[]>(
    `${import.meta.env.VITE_APP_BACKEND_URL}notifications/mynotifications/`,
    true,
    (data) => {
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    },
    (error) => {
      setErrorMessage(error); // Al obtener error de la API, mostramos el error
    }
  );

  // Marcar una notificación como leída al hacer clic
  const handleClickNotification = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead({ is_read: true }, `${import.meta.env.VITE_APP_BACKEND_URL}notifications/mynotifications/${notification.id}/mark_as_read/`);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.is_read);
    if (unreadNotifications.length === 0) return;

    try {
      await Promise.all(
        unreadNotifications.map((notification) =>
          markAsRead({ is_read: true }, `${import.meta.env.VITE_APP_BACKEND_URL}notifications/${notification.id}/mark_as_read/`)
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      setErrorMessage("Error al marcar las notificaciones como leídas.");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="focus:outline-none items-center flex">
          <FaBell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="relative flex">
              <span className="absolute inline-flex -top-3 h-4 w-4 rounded-full bg-[#C8E870] opacity-75 animate-ping"></span>
              <span className="relative inline-flex -top-3 h-4 w-4 rounded-full bg-[#C8E870] text-white text-[10px] font-semibold items-center justify-center">
                {unreadCount}
              </span>
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        className="mt-2 p-0 max-h-80 bg-white shadow-lg rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>You have {unreadCount} unread messages.</CardDescription>
          </CardHeader>

          {/* Mostrar error si existe */}
          {errorMessage && (
            <div className="text-red-500 text-sm text-center p-2">
              {errorMessage}
            </div>
          )}

          <CardContent className="grid w-auto gap-4 min-w-[300px] max-w-[400px]">
            <hr />
            <div>
              {loading ? (
                <>
                  <NotificationsSkeleton />
                  <NotificationsSkeleton />
                  <NotificationsSkeleton />
                </>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`mb-4 grid grid-cols-[25px_1fr] items-start pb-4  cursor-pointer ${
                      notification.is_read ? "opacity-50" : "hover:bg-gray-100 py-3 px-2 rounded-lg duration-300"
                    }`}
                    onClick={() => handleClickNotification(notification)}
                  >
                    <span
                      className={`flex h-2 w-2 translate-y-1 rounded-full ${
                        notification.is_read ? "bg-gray-300" : "bg-[#C8E870]"
                      }`}
                    />
                    <div className="space-y-1">
                      <p className="text-sm leading-none">{notification.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  No new notifications.
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button onClick={handleMarkAllAsRead} className="w-full">
              <Check /> Mark All As Read
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
