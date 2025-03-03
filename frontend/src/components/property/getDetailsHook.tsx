import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';


interface Token {
  total_tokens: number;
  tokens_available: number;
  token_price:number
}

interface FinancialsDetails {
  projected_annual_yield: number;
  projected_rental_yield: number;
}
interface PropertyDetails {
  title: string;
  location: string;
  property_type: string;
  image: string[];
  price: number;
  financials_details: FinancialsDetails;
  tokens: Token[];
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useFetchPropertyDetails = (property_id: number, viewType: string): FetchState<PropertyDetails> => {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError(null);  


      try {
        const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/${property_id}/landing-page/?view=${viewType}`;

        const config: AxiosRequestConfig = {
          headers: {
            'Content-Type': 'application/json',
          }
        };

        const response = await axios.get<PropertyDetails>(apiUrl, config);  
        console.log(response.data);
              
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch property details.');
        console.error('Error fetching property details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [property_id, viewType, getAccessTokenSilently]);

  return { data, loading, error };
};

export default useFetchPropertyDetails;
