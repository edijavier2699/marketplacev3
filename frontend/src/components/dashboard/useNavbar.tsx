import React, { Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth0 } from '@auth0/auth0-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Cargar de manera perezosa los componentes
const Notifications = React.lazy(() => import('../notifications/notifications'));
const LogoutButton = React.lazy(() => import('../buttons/logoutBtn'));

export const UserNavbar = () => {
  const { user } = useAuth0();
  const navigate = useNavigate(); // Inicia el hook navigate

  // Función de manejo de atajos de teclado
  const handleShortcuts = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
      event.preventDefault();
      navigate("/app/dashboard/"); // Usar navigate para redirigir
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      navigate("/"); // Redirige al inicio
    }
  };

  useEffect(() => {
    // Agrega el evento al montar
    window.addEventListener("keydown", handleShortcuts);

    // Limpia el evento al desmontar
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, []);

  const userNavLinkDropDown = [
    { name: "Marketplace", url: "/", shortCutLetter: "Z" },
    { name: "Dashboard", url: "/app/dashboard/", shortCutLetter: "B" },
  ];

  return (
    <div className="flex items-center space-x-4">
      {/* Suspense para manejar la carga perezosa de Notifications */}
      <Suspense fallback={<div>Loading notifications...</div>}>
        <Notifications />
      </Suspense>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.picture} alt="@user" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {userNavLinkDropDown.map((link, index) => (
              <DropdownMenuItem key={index} onClick={() => navigate(link.url)}>
                {link.name}
                <DropdownMenuShortcut>⌘{link.shortCutLetter}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {/* Suspense para manejar la carga perezosa de LogoutButton */}
          <Suspense fallback={<div>Loading logout button...</div>}>
            <LogoutButton />
          </Suspense>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConnectButton showBalance={false} />
    </div>
  );
};
