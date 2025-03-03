import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { setUserData, setLoading } from "@/redux/userSlice";

export const useAuth = () => {
  const { user, isAuthenticated, getIdTokenClaims, isLoading } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (isAuthenticated && user) {
        try {
          const claims = await getIdTokenClaims();
          const userRole = claims?.["https://tokunize.com/role"] || "user";
          dispatch(setUserData({ role: userRole, isAuthenticated: true }));
        } catch (error) {
          console.error("Error fetching user claims:", error);
        }
      }
      dispatch(setLoading(false)); // Finaliza la carga
    };

    fetchUserRole();
  }, [isAuthenticated, user, getIdTokenClaims, dispatch]);

  return { isLoading, isAuthenticated }; // 🔹 Agregamos isAuthenticated en el return
};
