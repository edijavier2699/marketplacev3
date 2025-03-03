"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieGraph } from "@/components/graphs/pieGraph";
import { MyAssetsTable } from "@/components/dashboard/myAssetsTable";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";  
import { DashboardDetailCard } from "@/components/dashboard/dashboardDetailCard";
import TotalValueTokenizedGraph from "@/components/graphs/totalValueTokenizedGraph";
import {AssetSmallTable} from "@/types";

interface InvestorOverview {
  locations: {
    item: string,
    percentage: number,
    fill: string
  }[],
  property_types: {
    item: string,
    percentage: number,
    fill: string
  }[],
  invested_properties: AssetSmallTable[],
}

const InvestorOverview = () => {
  const { data, loading, error } = useGetAxiosRequest<InvestorOverview>(`${import.meta.env.VITE_APP_BACKEND_URL}property/investment-summary/`,true
  );
  
  if (loading) {
    return <div><LoadingSpinner/></div>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  const {
    invested_properties = [],
    locations = [],
    property_types = [],
  } = data || {}; 
  

  const inverstorOverview = [
    {title:"Current Rent Balance" , value: 12323434 },
    {title:"Total Rental Income" , value: 343435 }
  ]

  return (
    <section className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {inverstorOverview.map((item,index)=>(
          <DashboardDetailCard key={index} isCurrency={true} title={item.title} value={item.value} />
        ))}

        <Card className="shadow-none ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Withdraw Money</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full font-bold text-md">Withdraw</Button>
          </CardContent>
        </Card>
      </div>
      <TotalValueTokenizedGraph graphTitle="Porfolio Value" graphDescription="Showing your portfolio performance value for the las 3 months"/>
      <Card className="shadow-none   py-4">
          <h4 className="text-lg pl-4 mb-2 font-normal text-gray-500">Yield Projections</h4>
          <MyAssetsTable assetsData={invested_properties} />
        </Card>

        <Card className="pb-4 p-4  mb-4">
          <h4 className="text-lg mb-2 font-normal text-gray-500">Investment Diversification</h4>
          <hr/>
          <Card className="flex lg:space-x-5 grid-cols-1 grid shadow-none md:grid-cols-2 border-0">
            <PieGraph
              customHeight="h-[350px]"
              customRadius="45"
              data={locations}
              type={"Locations"}
              title="Geography"
              footerDescription="Showing diversification based on the geography"
            />
            <PieGraph
              customHeight="h-[350px]"
              customRadius="45"
              data={property_types}
              title="Property Types"
              type={"Types"}
              footerDescription="Showing  diversification based on the property type"
            />
          </Card>
        </Card>
    </section>
  );
};


export default InvestorOverview;