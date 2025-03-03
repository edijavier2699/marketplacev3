import  { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { PaymentFirst } from './paymentFirst';
import { PaymentSecond } from './paymentSecond';
import { PaymentType } from './paymentType';
import { PaymentOrderView } from './paymentOrderView';
import { PaymentSummary } from './paymentSummary';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import { LoadingSpinner } from '../loadingSpinner';
import { useGetAxiosRequest } from '@/hooks/getAxiosRequest';
import PaymentMyAssets from './paymentMyAssets';
import { selectInvestMethodTitle, selectAssetPoolAddress } from '@/redux/selectors';
import tokenToTokenPoolAbi from "../../contracts/tokenToTokenPoolAbi.json"; 
import { GlobalModal } from '../customModal';
import { useSelector } from 'react-redux';
import { useModalContext } from "@/context/modalContext";
import { PropertyDataPayment } from '@/types';
import  useSmartContract  from '@/hooks/useSmartContract';
import { usePostAxiosRequest } from '@/hooks/postAxiosRequest';
import { ApproveTransactionHook } from '../blockchain/ApproveTransaction';


interface Props {
  property_id: string;
}

interface InvestingProps {
  fromPoolAddress?: string;
  poolAddress: string;
  propertyId?: number;
  propertyTokens?: number;
  utilityTokens?: number;
  investmentType:string;
  cidUrl?: string;
  investedUsdcAmount?: number;
  ptToReceive?:number;
  investmentAmount?:string;
  investmentAmountUSDC?:number;
}

const PaymentFlow = ({ property_id }:Props) => {
    const { setState } = useModalContext(); 
    const [investDataLoaded, setInvestDataLoaded] = useState(false);
    const navigate = useNavigate();
    const investMethodTitle = useSelector(selectInvestMethodTitle); // Utiliza el selector memoizadoooo
    const assetPoolAddress = useSelector(selectAssetPoolAddress); // Utiliza el selector memoizado
    const [step, setStep] = useState(1);
    const [investmentAmount, setInvestmentAmount] = useState<string>("0"); // New state for amount
    const [investmentAmountUSDC,setInvestmentAmountUSDC] = useState<number>(0)
    const {toast} = useToast()

    const openModal = async () => {
      try {
        if (!investDataLoaded) {
          setInvestDataLoaded(true);
        }
       setState(true); // Abre el modal
      } catch (error) {
        console.error("Error al inicializar el contrato en openModal:", error);
      }
    };
    
  
  const { data: propertyData, loading, error } = useGetAxiosRequest<PropertyDataPayment>(
    investDataLoaded ? `${import.meta.env.VITE_APP_BACKEND_URL}property/investment/${property_id}/` : "",
    true
  );

  const [{loading: postLoading, error: postError }, postData] = usePostAxiosRequest<PropertyDataPayment, any>(
    `${import.meta.env.VITE_APP_BACKEND_URL}transaction/investment/property/${property_id}/`
  );

  const [{error: afterError }, afterData] = usePostAxiosRequest<PropertyDataPayment, any>(
    `${import.meta.env.VITE_APP_BACKEND_URL}transaction/investment/property/post-trade/${property_id}/`
  );



  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => {
    if (step === 5 && investMethodTitle) {
      setStep(2); 
    } else {
      setStep((prev) => Math.max(prev - 1, 1)); 
    }
  };


  useEffect(() => {  
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/investments/');

    socket.onmessage = async (event) => { // <-- Make this async
      const data = JSON.parse(event.data); 
      console.log(data);
      
      if(data.type === "error"){
        toast({
          title: "Transaction Failedd!",
          description: data.message,
          variant: "destructive",
        });
      }

      else if (data.type === 'usdcTrade') {
        if (investmentAmountUSDC && !isNaN(investmentAmountUSDC)) {
          const amountToApprove = investmentAmountUSDC * 10 ** 6;
          const tokensToReceiveInWei = parseFloat(investmentAmount) * 10 ** 8;
          
          try {
            await ApproveTransactionHook({ tokenAmount: amountToApprove , toApproveAddress:data.from_asset_address!, tokenType: "USDC" });
             await investInContract({
              investmentType: "usdcTrade",
              poolAddress: data.from_asset_address!,
              investedUsdcAmount: amountToApprove,
              ptToReceive: tokensToReceiveInWei,
            });
          } catch (error) {
            console.error('Error during approval or investment:', error);
          }
        }
      }
      else if(data.type === "tokenToToken"){
        if(data){
          try{
            await ApproveTransactionHook({ tokenAmount: data.utility_tokens , toApproveAddress:data.from_asset_address! , tokenType: "UTILITY" });
            const amountToApprove = investmentAmountUSDC * 10 ** 6;

            await investInContract({
              investmentType: "tokenToToken",
              fromPoolAddress: data.from_asset_address,
              poolAddress: data.target_asset_address,
              utilityTokens: data.utility_tokens,
              propertyId: data.batch_id,
              cidUrl: data.target_asset_ipfs,
              propertyTokens: data.property_tokens,
              ptToReceive: data.pt_to_receive,
              investedUsdcAmount: amountToApprove,
            });

          }catch(err){
            console.error("Error during approval or investment:", err);
          }
        }      
      }
    };

    return () => {
      socket.close();
    };
  }, [investmentAmount, investmentAmountUSDC]); 

 
  const handlePurchase = async () => {
    const data = {
      wantedTokensAmount: investmentAmount,
      equivalentUsdcAmount : investmentAmountUSDC,
      collateralizedAsset: assetPoolAddress,
      investmentType: investMethodTitle
    };

    await postData(data);
    if (postError) {
      toast({
        title: "Transaction Failed!",
        description: postError,
        variant: "destructive",
      });
    }
  };

  const handleAfterTrade = async ({fromPoolAddress, poolAddress, propertyId, cidUrl, propertyTokens, utilityTokens, investedUsdcAmount, ptToReceive, investmentType}:InvestingProps) => {
    const data = {
      fromPoolAddress,
      poolAddress,
      propertyId,
      cidUrl,
      propertyTokens,
      utilityTokens,
      investedUsdcAmount,
      ptToReceive,
      investmentType,
    };

    await afterData(data);

    if (postError) {
      toast({
        title: "Transaction Failed!",
        description: afterError,
        variant: "destructive",
      });
    }
};

  

  const investInContract = async ({fromPoolAddress, poolAddress, propertyId, cidUrl, propertyTokens, utilityTokens, investedUsdcAmount, ptToReceive, investmentType}:InvestingProps) => {
    try {      
        let transaction;

        if (investmentType === "usdcTrade") {
            const tokenToTokenContract = await useSmartContract(poolAddress, tokenToTokenPoolAbi);      
            transaction = await tokenToTokenContract.usdcToAssetTrade(poolAddress, investedUsdcAmount, ptToReceive, {
                gasLimit: 4000000,
            });
        } else {
            if (!fromPoolAddress) throw new Error("fromPoolAddress is required for tokenToToken trade");
            const tokenToTokenContract = await useSmartContract(fromPoolAddress, tokenToTokenPoolAbi);      
            transaction = await tokenToTokenContract.tokenToTokenTrade(poolAddress, propertyTokens, ptToReceive, propertyId, cidUrl, utilityTokens, {
                gasLimit: 9000000,
            });
        }
        const receipt = await transaction.wait();

        if (receipt.status === 1) {
            handleAfterTrade({fromPoolAddress, poolAddress, propertyId, cidUrl, propertyTokens, utilityTokens, investedUsdcAmount, ptToReceive, investmentType })
            setStep(6);
            toast({
                title: "Transacción exitosa",
                description: "La transacción se completó correctamente.",
                variant: "default",
            });
        } else {
            toast({
                title: "Transacción fallida",
                description: "Hubo un error en la transacción.",
                variant: "destructive",
            });
        }

    }catch (err: unknown) {
      console.error("Error en la transacción:", err);
      // Verificar si err es una instancia de Error
      if (err instanceof Error) {
          let errorMessage = err.message;  // Accede a los detalles del mensaje
  
          // Si tienes alguna lógica personalizada, como el revert, manejalo aquí
          console.log("Error capturado:", errorMessage);
      } else {
          // Si err no es una instancia de Error, muestra su tipo
          console.log("Error desconocido", err);
      }
  }
    
};


  const renderStep = () => {
    if (loading) return <LoadingSpinner/>
    if (error) return <div>Error: {error}</div>;
    if (!propertyData) return <div>No property data available.</div>;

    
    switch (step) {
      case 1:
        return <PaymentFirst propertyData={propertyData} />;
      case 2:
        return (
          <PaymentSecond 
            goNext={() => setStep(3)} 
            tokenPrice={propertyData.tokens[0].token_price}  
            totalTokens={propertyData.tokens[0].total_tokens}  
            investmentAmount={investmentAmount} 
            setInvestmentAmount={setInvestmentAmount} 
            setTotalAmountInUSDC={setInvestmentAmountUSDC}
          />
        );
      case 3:
        return <PaymentType goNext={()=> setStep(4)} />;
      case 4: 
        return <PaymentMyAssets />

      case 5:
        return <PaymentOrderView 
                  tokenPrice={propertyData.tokens[0].token_price}
                  selectedPaymentMethod={investMethodTitle} 
                  investmentAmount={investmentAmountUSDC}
                  />
      case 6:
        return <PaymentSummary  investmentAmount={investmentAmountUSDC}  />;
      default:
        return null;
    }
  };

  return (
    <>
      <GlobalModal>
            {renderStep()}
            <div className="flex space-x-5 mt-5">
              {step > 1 && step < 6 && (
                <Button variant="outline" onClick={goBack}>
                  Back
                </Button>
              )}
              {step === 1 && (
                <Button className="w-full" onClick={goNext}>
                  Continue
                </Button>
              )}
              {step === 2 && (
                <Button 
                  className="w-full" 
                  onClick={() => investMethodTitle && setStep(5)} 
                  disabled={!investMethodTitle}
                >
                  Overview
                </Button>
              )}
              {step === 5 && (
                <Button onClick={handlePurchase}  disabled={!investmentAmountUSDC}>
                   {postLoading ? "Loading..." : "Invest"} 
              </Button>
              )}
              {step === 6 && (
                <Button className="w-full" onClick={() =>{
                  setState(false);
                  navigate("/app/transactions/")
                }}>
                  Check My Wallet
                </Button>
              )}
            </div>
      </GlobalModal>
      <Button className="w-full" onClick={openModal}>Invest</Button>
    </>

  );
};


export default PaymentFlow;

