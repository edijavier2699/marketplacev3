import { IoWalletOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux'; // Para despachar las acciones
import { setInvestMethodTitle} from "../../redux/investSelectAsset"

interface PaymentTypeProps {
  goNext: () => void;
}

export const PaymentType = ({goNext }:PaymentTypeProps) => {
  const { investMethodTitle } = useSelector((state: any) => state.investAsset); 
  const dispatch = useDispatch();

  const handleAssetSelect = (investMethodTitle: string) => {      
        dispatch(setInvestMethodTitle(investMethodTitle));
    };

  return (
    <article className="space-y-5">
      <h4 className="font-bold text-xl">Select Payment Type</h4>
        <button
          className={`flex items-center  hover:bg-[#C8E870] w-full duration-300 p-2 rounded-lg ${investMethodTitle != 'usdc_token' ? 'bg-[#C8E870]' : ''}`}
          >
          <span className="bg-black rounded-full p-3"><IoWalletOutline className="text-white text-xl"/></span>
          <p className="pl-4">Credit/Debit Card</p>
        </button>
  
      <button
        className={`flex items-center hover:bg-[#C8E870] w-full  p-2 duration-300 rounded-lg ${investMethodTitle === 'usdc_token' ? 'bg-[#C8E870]' : ''}`}
        onClick={() => handleAssetSelect("usdc_token")}
      >
          <span className="p-3 bg-[#FDB022] rounded-full"><IoWalletOutline className="text-xl"/></span>
          <p className="pl-4">Wallet (USDC)</p>
      </button>
    </article>
  );
};
