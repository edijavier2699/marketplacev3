import { HistoricalPrice } from "../../components/graphs/historicalGraph";
import { PropertyUpdate } from "@/types";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { format } from "date-fns";
import { FormatCurrency } from "@/components/currencyConverter";

interface Props {
  data: {
    property_updates: PropertyUpdate[];
    transactions: { semana: string; volumen_total: number }[];
    total_volumen: number;
  };
  loading: boolean;
  error: string | null;
}

interface PropertyUpdateItemProps {
  update: PropertyUpdate;
}

const PropertyUpdateItem = ({ update }: PropertyUpdateItemProps) => {
  const formattedDate = format(new Date(update.update_date), "MMMM dd, yyyy");

  return (
    <li className="border-b pb-4 last:border-b-0">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xl">{update.update_title}</span>
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>
      <div className="text-sm pl-5 text-gray-700 space-y-1">
        <p><strong>Type:</strong> {update.update_type}</p>
        <p><strong>Cost:</strong> £{update.update_cost}</p>
        <p>{update.update_description}</p>
      </div>
    </li>
  );
};

const PropertyUpdatesSection = ({ updates }: { updates: PropertyUpdate[] | undefined }) => (
  <div>
    <h4 className="text-2xl font-bold mb-6">Property Updates</h4>
    {/* Comprobamos que 'updates' es un array y que no está vacío */}
    {Array.isArray(updates) && updates.length > 0 ? (
      <ul className="space-y-6">
        {updates.map((update, index) => (
          <PropertyUpdateItem key={index} update={update} />
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No updates yet</p>
    )}
  </div>
);


const Activity = ({ data, loading, error }: Props) => {

  // Verificar si 'data' o 'data.transactions' son válidos antes de renderizar
  const transactions = Array.isArray(data?.transactions) ? data.transactions : [];

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error</div>;

  return (
    <section>
      <div className="space-y-6">
        <div>
          <h4 className="text-2xl font-bold mb-4">Trade Volume</h4>
          <p className="text-gray-700 mb-4">
            The number of tokens traded over the past weeks. You can check the liquidity and activity level of this property.
          </p>
          <span className="text-2xl font-bold">
            <FormatCurrency amount={data.total_volumen} />
          </span>
          <span className="block text-gray-500 text-sm">Past Month</span>
          
          {/* Verificar si hay transacciones antes de renderizar el gráfico */}
          {transactions.length > 0 ? (
            <HistoricalPrice data={transactions} />
          ) : (
            <div>No transaction data available</div> // O cualquier mensaje que desees
          )}
        </div>
        <PropertyUpdatesSection updates={data.property_updates} />
      </div>
    </section>
  );
};
 export default Activity;