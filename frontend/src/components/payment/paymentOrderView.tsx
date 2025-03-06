// import GetContract from '../blockchain/contractsAbi';
import { FormatCurrency } from '../currencyConverter';

interface PaymentOrderViewProps {
  investmentAmount: number; 
  tokenPrice: string;
  selectedPaymentMethod: string | null;
}

export const PaymentOrderView = ({
  investmentAmount,
  tokenPrice,
  selectedPaymentMethod,
}:PaymentOrderViewProps) => {
  const investmentValue = investmentAmount; // Ya es un número, no es necesario parsearlo
  const fee = investmentValue * 0.005; 

  return (
    <form className="p-5 border rounded-lg bg-white">
      <h4 className="font-bold text-xl mb-4">Order View</h4>
      <div className="flex items-center justify-center mb-4">
        <h3 className="font-bold text-3xl text-[#C8E870]"><FormatCurrency amount={2200000} /></h3>
      </div>
      <ul className="space-y-2">
       
        <li className="flex justify-between py-2 border-b">
          <span className="font-bold text-sm">Fee (0.5%)</span>
          <span className="text-gray-500">{"11,000"} USDC</span>
        </li>
        <li className="flex justify-between py-2">
          <span className="font-bold text-sm">Invest With</span>
          <span className="text-gray-500">{selectedPaymentMethod}</span>
        </li>
      </ul>

      <div className="flex items-center mt-4">
        <input type="checkbox" id="terms" className="mr-2" required />
        <label htmlFor="terms" className="text-gray-600 text-sm">
            I have read and I agree to TSSRCT Terms of Use and I authorize the debit of the above amount through the chosen payment method.
        </label>
      </div>
    </form>
  );
};
