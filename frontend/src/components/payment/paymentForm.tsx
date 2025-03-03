import { useCallback, useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

// Cargar la clave pública de Stripe fuera del componente
const stripePromise = loadStripe("pk_test_51Q2roYRqFZlL52ejvDj7VFzt4zFQWGszC1u8EBfu2P7hfzPbcmHaHRB6YFNItDxOjfb1ZzAlSUnWnEvG9vWJJ4sX00wcaLrbhW");

export const CheckoutForm = () => {
  const [clientSecret, setClientSecret] = useState(null);

  // Método para obtener el client secret desde el servidor
  const fetchClientSecret = useCallback(() => {
    return fetch("/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

  const options = { clientSecret };

  // Asegúrate de que stripePromise esté disponible antes de renderizar el checkout
  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise} 
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
