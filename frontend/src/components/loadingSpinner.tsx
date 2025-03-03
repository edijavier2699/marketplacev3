// LoadingSpinner.tsx
import React, { useEffect } from 'react';
import loadingSpinner from '../assets/spinner.png'; // Asegúrate de que la ruta sea correcta
export const LoadingSpinner: React.FC = () => {
  useEffect(() => {
    // Cambiar la opacidad después de 2 segundos
    const timer = setTimeout(() => {
    }, 500);
    // Limpieza del timer
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center mt-4">
      <div className="loader">
        <img src={loadingSpinner} alt="spinner-loading" className="spinner h-6 animate-spin" />
      </div>
    </div>
  );
};

