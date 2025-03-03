import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

// Estado del hook con tipo genérico
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Primero, ajusta el hook para aceptar la URL como un argumento adicional
export const usePatchAxiosRequest = <T, U>(
    url: string,
    onSuccess?: (data: T) => void,
    onError?: (error: string) => void
  ): [FetchState<T>, (data?: U, url?: string) => Promise<void>] => {
    const { getAccessTokenSilently } = useAuth0();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    const patchData = useCallback(async (dataToPut?: U, urlParam?: string) => {
      setLoading(true);
      setError(null);
  
      try {
        const accessToken = await getAccessTokenSilently();
        const config: AxiosRequestConfig = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        };
  
        // Usa la URL proporcionada por el parámetro urlParam
        const response = await axios.patch<T>(urlParam || url, dataToPut || {}, config); 
        setData(response.data);
        if (onSuccess) {
          onSuccess(response.data);
        }
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || 'Error en la respuesta del servidor.'
          : 'Error inesperado al hacer la solicitud.';
  
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
        console.error('Error patching data:', err);
      } finally {
        setLoading(false);
      }
    }, [url, getAccessTokenSilently, onSuccess, onError]);
  
    return [{ data, loading, error }, patchData];
  };
  