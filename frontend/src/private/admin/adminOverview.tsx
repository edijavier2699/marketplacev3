"use client";

import { useState,lazy,Suspense } from "react";
import { NewPropertiesGraph } from "@/components/graphs/newPropertiesGraph";
import { DashboardDetailCard } from "@/components/dashboard/dashboardDetailCard";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { DataTable } from "@/components/dataTable/components/data-table";
import { AdminOverviewColumns } from "@/components/dataTable/components/columns/overviewAdminColum";
const ActivityLog  = lazy(()=> import("../admin/activityLog"))
import { statuses } from "@/components/dataTable/data/data";
import TotalValueTokenizedGraph from "@/components/graphs/totalValueTokenizedGraph";

// Define the structure for property data
interface Property {
    first_image?: string;
    title: string;
    location: string;
    ownershipPercentage: number;
    price: number;
    status: string;
    id: string;
    created_at:string;
    propertyType:string;
    referenceNumber:string;
}

interface PropertyChart {
    data: {
        month: string;
        properties: number;
      }[]; 
}

const AdminOverview = () => {
    const [underReviewProperties, setUnderReviewProperties] = useState<Property[]>([]);
    const [publishedProperties, setPublishedProperties] = useState<number>(0);
    const [propertiesChart, setPropertiesChart] = useState<PropertyChart[]>([]);  // Aquí definimos el tipo como PropertyChart[]
    
    // Fetch data with the custom hook
    const { loading, error: fetchError } = useGetAxiosRequest<{ published_properties: number; UR_properties: Property[] ; published_properties_per_month: PropertyChart[] }>(
        `${import.meta.env.VITE_APP_BACKEND_URL}property/overview-dashboard-admin/`,true, 
        (fetchedData) => {
            try {
                setPropertiesChart(fetchedData.published_properties_per_month)
                setPublishedProperties(fetchedData.published_properties);
                setUnderReviewProperties(fetchedData.UR_properties);
            } catch (error) {
                console.error("Validation failed:", error);
            }
        }
    );

    // Handle loading state
    if (loading) {
        return <LoadingSpinner />;
    }

    // Handle error state
    if (fetchError) {
        return <div>Error: {fetchError}</div>;
    }

    // Transform underReviewProperties into the format required for MyAssetsTable
    const underReviewPropertiesData = underReviewProperties.map((property) => ({
        image: property.first_image || "default_image_url.jpg",  // Asigna un valor predeterminado
        title: property.title,
        location: property.location,
        ownershipPercentage: property.ownershipPercentage,
        listingPrice: property.price.toString(),  // Asegura que `listingPrice` es un string
        id: property.id.toString(),
        status: property.status,
        referenceNumber: property.referenceNumber
    }));
    

    
    const adminOverviewDetails = [
        { title: "Total Market Tokenized", value: 12866880 },
        { title: "Under Review", value: underReviewProperties.length },
        { title: "Active Properties", value: publishedProperties },
        { title: "Sold Out Properties", value: 20 }
    ];

    const filterOptions = [
        { column: "status", title: "Status", options: statuses },

      ];

    return (
        <section className=" space-y-[40px]">
            {/* Admin overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
                {adminOverviewDetails.map((item, index) => (
                    <DashboardDetailCard 
                        title={item.title}
                        value={item.value}
                        key={index}
                    />
                ))}
            </div>  

            <TotalValueTokenizedGraph graphTitle="Total Marketplace Rent Paid Out " graphDescription="Showing total value tokenized into properties for the last 3 months"/> 

            {/* Under Review Properties  */}
            <div className="grid grid-cols-1 space-y-5">
                    <h3 className="text-[#FDB022] text-xl">Under Review Properties</h3>
                    <DataTable 
                        filterOptions={filterOptions}
                        columns={AdminOverviewColumns}
                        data={underReviewPropertiesData}
                    />  
            </div>
            {/* Published properties Chart */}
            <NewPropertiesGraph data={propertiesChart} propertyAmount={publishedProperties} />

            {/* <ActivityLog /> */}
            <h3 className="text-gray-500 text-xl">Recent Activity Log</h3>
            <Suspense fallback={<LoadingSpinner/>}>
                <ActivityLog />
            </Suspense>        
      </section>
    );
};


export default AdminOverview;