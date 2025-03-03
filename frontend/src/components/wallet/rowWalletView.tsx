import InternalWallet from "./internalWallet";
import ExternalWallet from "./externalWallet";

interface Props {
    balance: number;
    walletAddress:string;
    isEnabled:boolean;
}

const RowWalletview = ({balance, walletAddress, isEnabled }: Props) =>{
    
    return(
        <div className="flex w-full flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 space-x-0  justify-between ">
            <InternalWallet   isEnabled={isEnabled} walletName="Tokunize Wallet" walletType="tokunize"  address={walletAddress} blockchain="Arbitrum" balance={balance}/>
            <ExternalWallet/>
        </div>
    )
}

export default RowWalletview;