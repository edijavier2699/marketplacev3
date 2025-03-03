
import { useState } from "react";
import { TransactionTable } from "@/components/transactionsTable";
import { DatePickerWithRange } from "@/components/dashboard/DatePickerRange";
import { Download } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { DownloadCSV } from "@/components/downloads/DownloadCSV";
import { TransactionAsset, Wallet } from "@/types";

type ApiResponse = {
  results: {
    transactions: TransactionAsset[];
    wallet: Wallet;
    utility_tokens: any;
    property_tokens:any;
    overall_total_value: number;
  };
};

const Transactions = () => {
  const [position, setPosition] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Use the custom hook to fetch transactions
  const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}transaction/user/all/`;

  const { data, loading, error } = useGetAxiosRequest<ApiResponse>(apiUrl, true);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  // Ensure `data` and `data.results` are not null or undefined
  if (!data || !data.results) return <div>No data available</div>;
  
  const filteredTransactions = data.results.transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.transaction_date);
    const isDateInRange =
      (!startDate || transactionDate >= startDate) &&
      (!endDate || transactionDate <= endDate);

    const isEventMatch =
      position === "all" || transaction.event.toLowerCase() === position.toLowerCase();

    return isDateInRange && isEventMatch;
  });

  const handleDownload = () => {
    DownloadCSV(filteredTransactions, "my-assets.csv");
  };

  return (
    <div className="w-full">    
      <Button onClick={handleDownload}>
        Download CSV
        <Download className="ml-4" />
      </Button>

      <div className="flex flex-col sm:flex-row justify-between mt-4 mb-4">
        <DatePickerWithRange
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="max-w-md mt-5 sm:mt-0" variant="outline">Transaction Type</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Select one</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="sell">Sell</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="buy">Buy</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="deposit">Deposit</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="withdraw">Withdraw</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredTransactions.length > 0 ? (
        <TransactionTable transactions={filteredTransactions} />
      ) : (
        <div className="text-center mt-8">
          <i className="fas fa-exclamation-circle text-yellow-500 text-3xl mb-4"></i>
          <p className="text-lg font-semibold text-gray-500">No transactions yet</p>
        </div>
      )}
    </div>
  );
};

export default Transactions;