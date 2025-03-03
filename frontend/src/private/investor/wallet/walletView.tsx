import WalletTabView from "@/components/wallet/walletTabView";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { Wallet } from "@/types";
import ShowBalanceTokens from "@/components/showBalanceTokens";

type ApiResponse = {
  wallet: Wallet;
  utility_tokens: any;
  property_tokens:any;
  overall_total_value: number;
  
};

const WalletView = () => {
  const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}wallet/overview/`;
  const { data, loading, error } = useGetAxiosRequest<ApiResponse>(apiUrl, true);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  if (!data) return <div>No data available</div>;
  
  return (
    <div className="w-full">
      <WalletTabView 
        walletAddress={data.wallet.wallet_address} 
        isEnabled={data.wallet.is_enabled} 
        balance={data.wallet.balance} 
      />
        <ShowBalanceTokens 
          ptDistribution={data.property_tokens}
          utDistribution={data.utility_tokens.batch_values} 
          totalUTValue={data.overall_total_value}
        />
    </div>
  );
};

export default WalletView;
