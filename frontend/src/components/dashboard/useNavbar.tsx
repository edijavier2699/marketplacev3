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
import LogoutButton from '../buttons/logoutBtn';
const Notifications = React.lazy(() => import('../notifications/notifications'));


export const UserNavbar = () => {
  const { user } = useAuth0();
  const navigate = useNavigate(); 


  const handleShortcuts = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      navigate("/"); 
    }
  };

  useEffect(() => {
    // Agrega el evento al montar
    window.addEventListener("keydown", handleShortcuts);

    // Limpia el evento al desmontar
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, []);

  const userNavLinkDropDown = [
    { name: "Dashboard", url: "/", shortCutLetter: "B" },
  ];

  return (
    <div className="flex items-center space-x-4">
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
            <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>
      <ConnectButton showBalance={false} />
    </div>
  );
};
