import React, { useState } from 'react';
import { Button } from '../ui/button';
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';


interface TokenPurchaseFormProps {
    token_price: number;
    property_id: number
}

export const TokenPurchaseForm: React.FC<TokenPurchaseFormProps> = ({ token_price, property_id }) => {
    const { getAccessTokenSilently } = useAuth0(); // Acceso al método para obtener el token
    const [amount, setAmount] = useState<number>(0);
    const [message, setMessage] = useState<string | null>(null);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setAmount(value);
        showTotalAmount(value);
    };

    const handlePurchase = async () => {
        if (amount <= 0) {
            setMessage('Please, specify the amount of tokens you want to buy');
        } else {
            try {
                const accessToken = await getAccessTokenSilently(); // Obtener token de acceso
                const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/transactions/`; 

                const data = {
                    token_amount: amount,
                    property_id: property_id
                };

                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                };

                const response = await axios.post(apiUrl, data, config);

                console.log(response.data);
                setMessage(`You've just bought ${amount} tokens.`);
            } catch (error) {
                console.error(error);
                setMessage('An error occurred while processing your purchase.');
            }
        }
    };

    const showTotalAmount = (token_amount: number) => {
        const total = token_amount * token_price;
        setTotalAmount(total); // Establecer el total calculado
    };

    return (
        <div>
            <label htmlFor="token-amount" className="block text-sm font-medium text-gray-700 mb-2">
                Tokens Amount
            </label>
            <input
                id="token-amount"
                type="number"
                value={amount}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                min="1"
                placeholder="Enter the amount"
            />
            <Button variant="default" onClick={handlePurchase} className="w-full mt-5">Confirm buy Order</Button>
            {message && <p className="mt-4 text-center text-green-600">{message}</p>}

            <p className="mt-4">The total amount is ${totalAmount.toFixed(2)}</p>
        </div>
    );
};
