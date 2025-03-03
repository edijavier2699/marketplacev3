import { useState, useEffect } from "react";
import { useBalance } from "wagmi";
import { useAccount } from 'wagmi';
import { CurrencyConverter } from "../currencyConverter";

interface Props {
    className?: string;
}

const ExternalWallet = ({ className }: Props) => {
    const { address } = useAccount();
    const [ethPrice, setEthPrice] = useState<number>(0); // Para almacenar el precio de ETH en USD

    // Obtener el balance en ETH
    const { data, isLoading, isError } = useBalance({
        address: address,
    });

    useEffect(() => {
        const fetchEthPrice = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
                const data = await response.json();
                setEthPrice(data.ethereum.usd); // Establecemos el precio de ETH en USD
            } catch (error) {
                console.error("Error fetching ETH price:", error);
            }
        };

        fetchEthPrice(); // Llamada para obtener el precio de ETH
    }, []);

    // Verificar si el balance y el precio están disponibles
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching balance</div>;

    console.log(ethPrice);
    

    // Convertir balance de ETH a USD
    const balanceInUSD = data ? parseFloat(data.formatted) * ethPrice : 0;

    return (
        <div
            id="tour-wallet-card"
            className={`${className} text-animated-gradient text-white rounded-xl shadow-lg p-6 w-full max-w-md `}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 id="tour-wallet-name" className="text-2xl font-bold">
                    Personal Wallet
                </h3>
                <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-400 uppercase">Arbitrum</span>
                </div>
            </div>
            {address ? (
                <>
                <div className="mb-4">
                    <p className="text-sm text-gray-500">Wallet Address</p>
                    <p id="tour-wallet-address" className="text-sm font-mono text-gray-200 truncate">
                        {address.slice(0, 4)}...{address.slice(-4)}
                    </p>
                </div>

                <div id="tour-wallet-balance" className="mb-6">
                    <p className="text-sm text-gray-500">Balance</p>    
                    <CurrencyConverter amountInUSD={balanceInUSD} />
                </div>
                </>
            ):(
                <p>Wallet not connected</p>
            )}            
        </div>
    );
};

export default ExternalWallet;
