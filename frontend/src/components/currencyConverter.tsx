import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface CurrencyConverterProps {
  amountInUSD: number | string; // Aceptar también cadenas por seguridad
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ amountInUSD }) => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [amountInGBP, setAmountInGBP] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Convertir `amountInUSD` a número de forma segura
  const usdAmount = typeof amountInUSD === "number" ? amountInUSD : parseFloat(amountInUSD);

  const getExchangeRate = async () => {
    try {
      const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
      const rate = response.data.rates.GBP;
      setExchangeRate(rate);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  useEffect(() => {
    getExchangeRate();
  }, []);

  useEffect(() => {
    if (exchangeRate !== null && !isNaN(usdAmount)) {
      setAmountInGBP(usdAmount * exchangeRate);
    } else {
      setAmountInGBP(null);
    }
  }, [exchangeRate, usdAmount]);

  const toggleVisibility = (e: React.MouseEvent) => {
    setIsVisible(!isVisible);
    e.stopPropagation();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          {amountInGBP !== null ? (
            isVisible ? (
              <p className="font-semibold text-lg">
                ${usdAmount.toFixed(2)} USD
                <span className="text-sm text-muted-foreground">
                  = £{amountInGBP.toFixed(2)} GBP
                </span>
              </p>
            ) : (
              <p className="font-semibold text-lg">********</p>
            )
          ) : (
            <p className="text-muted-foreground">Loading...</p>
          )}
        </div>
        <button
          className="ml-4 text-gray-500 hover:text-gray-700"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide amounts" : "Show amounts"}
        >
          {isVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      </div>
    </div>
  );
};



interface FormatCurrencyProps {
    amount: number;
}

export const FormatCurrency: React.FC<FormatCurrencyProps> = ({ amount }) => {
    // Usar Intl.NumberFormat para formatear como moneda
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0, // No mostrar decimales por defecto
        maximumFractionDigits: 2, // Mostrar hasta 2 decimales si son necesarios
    });

    const formattedAmount = formatter.format(amount);

    return <>{formattedAmount}</>;
};
