import { Progress } from "../ui/progress";
import { useEffect, useState } from "react";
import { FormatCurrency } from "../currencyConverter";
import CustomCarousel from "../CustomCarousel";
import { PropertyDataPayment } from "@/types";

interface PropertyData {
  propertyData : PropertyDataPayment
}

export const PaymentFirst = ({ propertyData }: PropertyData) => {
  const [progressEquity, setProgressEquity] = useState<number>(0);

  if (!propertyData) {
    return <div>Error: Property data is missing</div>;
  }

  useEffect(() => {
    if (propertyData && propertyData.tokens && propertyData.tokens[0]) {
      setProgressEquity(propertyData.tokens[0].tokens_sold);
    }
  }, [propertyData]);
  

  return (
    <section className="flex flex-col">
      <div>
        <h2 className="font-bold text-xl mb-4">Diversify</h2>
      </div>
      <div className="flex flex-row space-x-3">
        <aside className="w-1/2 flex flex-col text-left">
          <CustomCarousel title="property-images-invest" images={propertyData.image} />

          <header className="mt-3">
            <h1 className="font-semibold">{propertyData.title}</h1>
          </header>

          <dl>
            <dt className="text-sm text-gray-500">Property Type</dt>
            <dd className="mb-2">{propertyData.property_type}</dd>

            <dt className="text-sm text-gray-500">Full Address</dt>
            <dd className="">{propertyData.location}, {propertyData.country}</dd>
          </dl>
        </aside>

        <article className="w-1/2 space-y-3">
          <div className="border rounded-lg p-4">
            <ul className="space-y-2">
              <li className="flex flex-col text-sm text-gray-500">
                Est. Annual Yield
                <span className="text-black text-lg">{propertyData.projected_annual_yield} %</span>
              </li>
              <li className="flex flex-col text-sm text-gray-500">
                Est. Monthly Yield
                <span className="text-black text-lg">{propertyData.projected_rental_yield} %</span>
              </li>
              <li className="flex flex-col text-sm text-gray-500">
                Current Value
                <span className="text-black text-lg "><FormatCurrency amount={parseFloat(propertyData.price)}/> </span>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <header>
              <h3 className="font-bold text-xl text-[#C7E770] mb-3">Investment Summary</h3>
            </header>
            <ul className="space-y-2 ">
              <li className="flex justify-between">
                Equity Listed <span> <FormatCurrency amount={parseFloat(propertyData.price)}/> </span>
              </li>
              <Progress value={progressEquity}/>
              <li className="flex justify-between">
                Equity Sold <span>{progressEquity.toFixed(2)} %</span>
              </li>
              <Progress value={progressEquity} />
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
};
