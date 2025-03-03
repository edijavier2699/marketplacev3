import { useDispatch } from 'react-redux';
import { clearUserData } from "../../redux/userSlice"; // Importa las acciones de Redux
import { setWalletAddress } from "@/redux/walletSlice"; // Importa la acción para limpiar la wallet
import { persistor } from "@/redux/store"; // Importa el persistor
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from '../ui/button';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const { logout } = useAuth0();

  const handleLogout = async () => {
    // Limpia el estado de Redux
    dispatch(clearUserData()); // Elimina los datos del usuario de Redux
    dispatch(setWalletAddress(null)); // Elimina la dirección de la wallet de Redux

    await persistor.purge(); // Purga el estado persistido de Redux

    // Realiza el logout con Auth0
    logout(); // Redirige a la página principal después de logout
  };

  return (
    <Button
      variant="outline"
      className="duration-300 w-full"
      onClick={handleLogout} // Llama a la función handleLogout cuando se haga clic en el botón
    >
      Log Out
    </Button>
  );
};


export default LogoutButton;