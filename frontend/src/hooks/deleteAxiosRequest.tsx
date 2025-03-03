import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

// Define el estado del hook con un tipo genérico
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface DeleteResponse {
  message?: string;
  error?: string;
}

// Hook para solicitudes DELETE
export const useDeleteAxiosRequest = (
  url: string
): [FetchState<DeleteResponse>, () => Promise<void>] => {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState<DeleteResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Obtiene el token de acceso
      const accessToken = await getAccessTokenSilently();

      // Configuración de los headers
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      };

      // Realiza la solicitud DELETE
      const response = await axios.delete<DeleteResponse>(url, config);

      // Guarda los datos obtenidos
      setData(response.data);
      console.log(response.data);
      console.log(data);
      
      
    } catch (err) {
      // Manejo de errores
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Error en la respuesta del servidor.'
        : 'Error inesperado al hacer la solicitud.';
      setError(errorMessage);
      console.error('Error deleting data:', err);
    } finally {
      setLoading(false);
    }
  }, [url, getAccessTokenSilently]);

  return [{ data, loading, error }, deleteData];
};
