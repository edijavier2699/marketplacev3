import { useState } from "react";
import InternalWallet from "./internalWallet";
import ExternalWallet from "./externalWallet";
interface Props {
  balance: number;
  walletAddress:string;
  isEnabled:boolean;
}

const ListWalletView = ({ balance ,walletAddress,isEnabled}: Props) => {
  // Estado para controlar qué tarjeta está al frente
  const [isTokunizeFront, setIsTokunizeFront] = useState(true);

  // Función para intercambiar tarjetas al hacer clic
  const handleClick = () => {
    setIsTokunizeFront(!isTokunizeFront);
  };

  return (
    <div className="relative w-full h-[350px]">
      {/* Primera WalletCard */}
      <div onClick={handleClick}  className={`absolute cursor-pointer transition-all w-full duration-300 ${isTokunizeFront ? "top-[0px] z-10" : "top-[60px] z-20" }`} >
        <InternalWallet address={walletAddress} isEnabled={isEnabled} walletName="Tokunize Wallet" walletType="tokunize"  blockchain="Arbitrum" balance={balance}/>
      </div>

      {/* Segunda WalletCard */}
      <div onClick={handleClick}  className={`absolute cursor-pointer w-full transition-all duration-300 ${isTokunizeFront ? "top-[60px] z-20" : "top-[0px] z-10"}`}>
        <ExternalWallet className="min-h-[250px]" />
      </div>
    </div>
  );
};

export default ListWalletView;
