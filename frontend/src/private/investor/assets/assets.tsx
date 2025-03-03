import { PieGraph } from "@/components/graphs/pieGraph";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { Card } from "@/components/ui/card";
import { DataAccordion } from "@/components/dataAccordion/DataAccordion";
import { DataTable } from "@/components/dataTable/components/data-table";
import { MyAssetsColumns } from "@/components/dataTable/components/columns/MyAssetsColumns";
import { propertyType } from "@/components/dataTable/data/data";
import { TabItem } from "@/types";
import { DashboardDetailCard } from "@/components/dashboard/dashboardDetailCard";
import { MyAssetsTable } from "@/components/dashboard/myAssetsTable";
import { RowData, AssetSmallTable} from "@/types";


interface ApiResponse {
    invested_properties: RowData[];
    property_types: { item: string; percentage: number; fill: string }[];
    upcoming_rent_payments: AssetSmallTable[];
    user_owned_properties: RowData[];
    total_owned_value: number;
}

const Assets = () => {
  const filterOptions = [
    { column: "propertyType", title: "Property Type", options: propertyType },
  ];

  const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/investor-assets/`;
  const { data, loading, error } = useGetAxiosRequest<ApiResponse>(apiUrl, true);
  
  if (loading) return <div><LoadingSpinner /></div>;
  if (error) return <p>Error: {error}</p>;

  const {
    invested_properties = [],
    property_types = [],
    upcoming_rent_payments = [],
    user_owned_properties = [],
    total_owned_value = 0
  } = data || {}; 

  
  const tabs: TabItem[] = [{ type: "text", content: "My Assets" },{ type: "text", content: "Invested Assets" }];
  const tabComponents = [
    <DataTable<RowData, unknown>
      isDownloadable={true}
      columns={MyAssetsColumns}
      filterOptions={filterOptions}
      data={user_owned_properties}
    />,
    <DataTable<RowData, unknown>
      isDownloadable={true}
      columns={MyAssetsColumns}
      filterOptions={filterOptions}
      data={invested_properties}
    />,
  ];

  return (
    <div className="rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DashboardDetailCard title="Total Properties Owned" value={user_owned_properties.length} />
          <DashboardDetailCard title="Total Invested Assets" value={user_owned_properties.length} />
          <DashboardDetailCard title="Your Assets Value" isCurrency={true} value={total_owned_value} />
          <DashboardDetailCard title="Projected Rental Yield" value={12} />
        </div>
        {property_types && (
        <Card>
          <PieGraph
            customHeight="h-[100px]"
            customRadius="18"
            data={property_types}
            title="Property Types"
            footerDescription="Showing total properties based on the property type"
          />
        </Card>
        )}
      </div>
      <Card className="mb-5">
        <MyAssetsTable assetsData={upcoming_rent_payments}/>
      </Card>
      <DataAccordion tabs={tabs} components={tabComponents} />
    </div>
  );
};

export default Assets;