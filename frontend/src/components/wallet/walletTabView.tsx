import InternalWallet from "./internalWallet";

interface Props {
  balance:number;
  walletAddress:string;
  isEnabled:boolean;
}

const WalletTabView = ({balance,walletAddress,isEnabled}:Props) => {

  return (
    <div className="p-4 w-full border mb-5 rounded-lg">
         < InternalWallet walletType="personal" isEnabled={isEnabled} blockchain="Arbitrum" walletName="Personal Wallet" address={walletAddress} balance={balance}/>
    </div>
  );
};

export default WalletTabView;
