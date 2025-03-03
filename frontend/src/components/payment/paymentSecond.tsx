import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FaArrowRightLong } from "react-icons/fa6";
import cardIcon from "../../assets/cardIcon.svg";
import tokenIcon from "../../assets/token.svg";

// Interfaces
interface InvestmentDetails {
  investMethodTitle: string;
  assetTokenPrice:number
}

interface RootState {
  investAsset: InvestmentDetails;
}

interface PaymentSecondProps {
  goNext: () => void;
  tokenPrice: string;
  totalTokens: number;
  investmentAmount: string;
  setInvestmentAmount: (amount: string) => void;
  setTotalAmountInUSDC: (amount: number) => void;
}

// Helper component for token info display
const TokenInfoDisplay: React.FC<{
  icon: string;
  title: string;
  tokenPrice: string;
  amount: string;
  usdcAmount: string;
  equityPercentage: string;
}> = ({ icon, title, tokenPrice, amount, usdcAmount, equityPercentage }) => (
  <div className="flex p-2 justify-between items-center w-[80%] mx-auto">
    <span className="flex items-center">
      <img alt="token-icon" src={icon} className="h-8" />
      <span className="flex pl-2 flex-col">
        <span className="font-bold text-medium">{title}</span>
        <span className="text-sm">Token Price £ {tokenPrice}</span>
        <span className="text-gray-500 text-sm">{amount} Tokens</span>
      </span>
    </span>

    <div className="flex flex-col">
      <span>{usdcAmount}</span>
      <span className="text-gray-500 text-sm">{equityPercentage}% Equity</span>
    </div>
  </div>
);

// Custom hook for investment calculations
const useInvestmentCalculations = (
  amount: string,
  tokenPrice: string,
  totalTokens: number
) => {
  const numericAmount = useMemo(() => Number(amount) || 0, [amount]);
  const numericTokenPrice = useMemo(() => Number(tokenPrice) || 0, [tokenPrice]);

  const usdcAmount = useMemo(() => numericAmount * numericTokenPrice, [numericAmount, numericTokenPrice]);
  
  const equityPercentage = useMemo(() => {
    if (totalTokens <= 0) return 0;
    return (numericAmount / totalTokens) * 100;
  }, [numericAmount, totalTokens]);

  const formattedUSDCAmount = useMemo(() => 
    usdcAmount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }), [usdcAmount]);

  const formattedEquity = useMemo(() => 
    equityPercentage.toFixed(2), [equityPercentage]);

  return {
    numericAmount,
    formattedUSDCAmount,
    formattedEquity,
  };
};



export const PaymentSecond: React.FC<PaymentSecondProps> = ({
  goNext,
  tokenPrice,
  totalTokens,
  investmentAmount,
  setInvestmentAmount,
  setTotalAmountInUSDC,
}) => {
  const [amount, setAmount] = useState(investmentAmount);
  const inputRef = useRef<HTMLInputElement>(null);
  const { investMethodTitle , assetTokenPrice } = useSelector((state: RootState) => state.investAsset);
  
  const {
    numericAmount,
    formattedUSDCAmount,
    formattedEquity,
  } = useInvestmentCalculations(amount, tokenPrice, totalTokens);

  // Sync with parent component
  useEffect(() => {
    setTotalAmountInUSDC(numericAmount * (Number(tokenPrice) || 0));
  }, [numericAmount, tokenPrice, setTotalAmountInUSDC]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
    setInvestmentAmount(value);
  };

  const handleInputBlur = () => {
    if (!amount) {
      setAmount('0');
      setInvestmentAmount('0');
    }
  };

  return (
    <article className="flex flex-col items-center space-y-4 p-4 border rounded-md w-full">
      <h4 className="text-xl font-semibold">Token Amount</h4>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          ref={inputRef}
          value={amount}
          onFocus={() => setAmount(prev => prev === '0' ? '' : prev)}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          className="rounded-md w-full text-5xl text-center border-0 outline-none focus:ring-0"
          placeholder="0"
          inputMode="numeric"
        />
      </div>

      <TokenInfoDisplay
        icon={tokenIcon}
        title="Buy"
        tokenPrice={tokenPrice}
        amount={amount}
        usdcAmount={formattedUSDCAmount}
        equityPercentage={formattedEquity}
      />

      {/* {investMethodTitle  !== "usdc_token"  && (
        <>
          <h4 className="text-left text-gray-600">{investMethodTitle} information</h4>
          <TokenInfoDisplay
            icon={tokenIcon}
            title="Additional Info"
            tokenPrice={assetTokenPrice}
            amount={amount}
            usdcAmount={formattedUSDCAmount}
            equityPercentage={formattedEquity}
          />
        </>
      )} */}

      <div
        onClick={goNext}
        className="flex p-2 rounded-lg hover:bg-[#C8E870] duration-300 justify-between items-center w-[80%] mx-auto cursor-pointer"
      >
        <span className="flex items-center">
          <img alt="payment-method-icon" src={cardIcon} className="h-8" />
          <span className="flex pl-2 flex-col">
            <span className="font-bold text-medium">Invest With</span>
            <span className="text-gray-400">
              {investMethodTitle === "usdc_token" 
                ? "USDC Wallet" 
                : investMethodTitle || "Please select investment method"}
            </span>
          </span>
        </span>
        <FaArrowRightLong />
      </div>
    </article>
  );
};