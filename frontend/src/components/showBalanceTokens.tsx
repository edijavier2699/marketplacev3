import { Card } from "./ui/card";

export interface TokensProps {
  name: string;
  image: string;
  amount: number;
  token_value: number;
  batch_value?: number; 
}

interface Props {
  totalUTValue: number;
  utDistribution: TokensProps[];
  ptDistribution: TokensProps[];
}

const TokenTable = ({ distribution, type }: { distribution: TokensProps[]; type: string }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
              Token Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
              Value per Token
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
              Batch Value
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {distribution.map((token, index) => {
            const batchValue = token.batch_value || token.amount * token.token_value;
            return (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 min-w-[100px] py-4">
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-12 h-12 rounded-full shadow-md"
                  />
                </td>
                <td className="px-6 py-4 min-w-[300px] text-sm font-medium text-gray-900">
                  {token.name}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  <span className="inline-block min-w-[120px]">
                    {token.amount.toFixed(8).replace(/\.0+$/, "")}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  ${token.token_value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>
                      ${batchValue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {distribution.length === 0 && (
        <div className="p-6 text-center text-gray-500">No {type} tokens available</div>
      )}
    </div>
  );
};

const ShowBalanceTokens = ({ totalUTValue, utDistribution, ptDistribution }: Props) => {
  return (
    <Card className="p-6 mb-6 space-y-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Portfolio Summary</h2>
          </div>
          <div className="bg-[#C8E870] p-2 rounded-lg">
            <p className="text-lg font-semibold">
              Total Value
              ${totalUTValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>


      <p className="text-sm font-bold text-gray-500">Total assets tokens value</p>
      <TokenTable distribution={ptDistribution} type="property token" />
      <p className="text-sm font-bold text-gray-500">Total utility token value</p>
      <TokenTable distribution={utDistribution} type="utility token" />

    </Card>
  );
};

export default ShowBalanceTokens;