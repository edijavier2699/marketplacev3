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
import { RowData, AssetSmallTable} from "@/types";

const fakeProperties = {
  soldProperties: [
    {
      id: 4,
      title: "Beachfront Condo in Miami",
      first_image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29uZG98ZW58MHx8MHx8fDA%3D",
      location: "Miami, USA",
      price: 750000,
      cap_rate: "5.8%",
      ocupancy_status: "vacant",
      property_type: "Condo",
      totalTokens: 800,
      sold_date: "2024-02-15",
    },
    {
      id: 6,
      title: "Country House in Tuscany",
      first_image: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y291bnRyeSUyMGhvdXNlfGVufDB8fDB8fHww",
      location: "Tuscany, Italy",
      price: 580000,
      cap_rate: "6.3%",
      ocupancy_status: "vacant",
      property_type: "House",
      totalTokens: 650,
      sold_date: "2024-01-05",
    },
  ],
  myAssets: [
    {
      id: 7,
      title: "Downtown Loft in Berlin",
      first_image: "https://plus.unsplash.com/premium_photo-1684175656320-5c3f701c082c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Berlin, Germany",
      price: 600000,
      cap_rate: "5.2%",
      ocupancy_status: "occupied",
      property_type: "Loft",
      totalTokens: 900,
    },
    {
      id: 9,
      title: "Ski Chalet in Switzerland",
      first_image: "https://plus.unsplash.com/premium_photo-1687996107589-b288bcb27dbc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hhbGV0fGVufDB8fDB8fHww",
      location: "Zermatt, Switzerland",
      price: 1350000,
      cap_rate: "4.8%",
      ocupancy_status: "occupied",
      property_type: "Chalet",
      totalTokens: 700,
    },
  ],
};



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
    user_owned_properties = [],
  } = data || {}; 

  
  const tabs: TabItem[] = [{ type: "text", content: "Listed Assets" },{ type: "text", content: "Sold Assets" },{ type: "text", content: "My Assets" }];
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
      data={fakeProperties.soldProperties}
    />,
    <DataTable<RowData, unknown>
    isDownloadable={true}
    columns={MyAssetsColumns}
    filterOptions={filterOptions}
    data={fakeProperties.myAssets}
    />,
  ];

  return (
    <div className="rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DashboardDetailCard title="Total Properties Sold" value={3} />
          <DashboardDetailCard title="Total Properties Bought" value={3} />
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
      <DataAccordion tabs={tabs} components={tabComponents} />
    </div>
  );
};

export default Assets;