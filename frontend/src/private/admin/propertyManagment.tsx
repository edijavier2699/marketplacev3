import { useState } from "react";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { columns } from "@/components/dataTable/components/columns/columns";
import { DataTable } from "@/components/dataTable/components/data-table";
import { z } from "zod";
import { propertySchema } from "@/components/dataTable/data/schema";
import { statuses, investmentCategories } from "@/components/dataTable/data/data";

interface Property {
  first_image?: string;
  title: string;
  location: string;
  ownershipPercentage: number;
  price: number;
  status: string;
  id: number;
  projected_rental_yield: number;
  created_at: string;
  investment_category: string,
  property_type: string,
  reference_number:string
}

const PropertyManagement = () => {
  const [properties, setProperties] = useState<z.infer<typeof propertySchema>[]>([]);

  // Map properties to camelCase format for the schema
  const mapPropertiesToCamelCase = (data: Property[]) => {
    return data.map((property) => ({
      id: property.id.toString(),
      title: property.title,
      image: property.first_image, // Assuming image is an array
      location: property.location,
      status: property.status,
      listingPrice: property.price.toString(), // Convert price to string to match schema
      ownershipPercentage: property.ownershipPercentage ,
      listingDate: property.created_at,
      propertyType: property.property_type ,
      investmentCategory: property.investment_category ,
      referenceNumber: property.reference_number
    }));
  };

  // Fetching properties
  const { loading, error: fetchError } = useGetAxiosRequest<Property[]>(
    `${import.meta.env.VITE_APP_BACKEND_URL}property/property-managment/`,true,
    (fetchedData) => {
      try {                        
        const mappedProperties = mapPropertiesToCamelCase(fetchedData);
        const parsedProperties = z.array(propertySchema).parse(mappedProperties);
        setProperties(parsedProperties); // Set validated properties
      } catch (error) {
        console.error("Validation failed:", error);
      }
    }
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (fetchError) {
    return <div>Error: {fetchError}</div>;
  }

  console.log(properties);
  

  const filterOptions = [
    { column: "status", title: "Status", options: statuses },
    { column: "investmentCategory", title: "Category", options: investmentCategories },

  ];
  return (
    <div className="grid grid-cols-1">
      <div className=" h-full flex-1 flex-col space-y-8  py-4 flex">
        <DataTable 
          data={properties} 
          columns={columns} 
          filterOptions={filterOptions}
        />
      </div>
    </div>
  );
};


export default PropertyManagement;