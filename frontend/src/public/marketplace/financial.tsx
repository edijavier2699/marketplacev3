import { LoadingSpinner } from '../../components/loadingSpinner';
import { FormatCurrency } from '../../components/currencyConverter';
import { CapitalStackGraph } from '../../components/graphs/stackGraph';
import RentalGraph from '@/components/graphs/rentalGraph';

interface PropertyFinancialProps {
  data?: {
    annual_cash_flow?: string;
    annual_gross_rents?: string;
    blockchain_address?: string;
    investment_category?:string;
    closing_costs?: string;
    dao_administration_fees?: string;
    homeowners_insurance?: string;
    legal_documents_url?: string;
    monthly_cash_flow?: string;
    operating_reserve?: string;
    projected_annual_cash_flow?: string;
    projected_annual_return?: string | null;
    projected_annual_yield?: string;
    projected_rental_yield?: string;
    property_management?: string;
    property_taxes?: string;
    token_price?: number;
    tokensSold?: number;
    total_investment_value?: string;
    total_tokens?: number;
    underlying_asset_price?: string;
    upfront_fees?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const Finantial = ({ data, loading, error }:PropertyFinancialProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">No financial data available.</p>
      </div>
    );
  }

  const renderFinancialItem = (label: string, value: string | number | null | undefined) => {
    // Check if value is defined or not null before rendering
    if (value === undefined || value === null) {
      return null; // Do not render anything if value is not available
    }
    const amount = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(amount)) {
      return null; // or return some default value
    }
  
    return (
      <li className="flex justify-between">
        <span>{label}</span>
          <FormatCurrency amount={amount} />
      </li>
    );
  };
  
  return (
    <section className="md:pl-5 text-lg ">
      <div className="grid grid-cols-1">
        <RentalGraph title="Projected Rental Yield" description="Projected annual yield for the last 6 months" />
      </div>


      {/* just for Opportunistic */}
      {data.investment_category === import.meta.env.VITE_IC_FINANCIAL && (
         <div className="sponsor-overview space-y-10 ">
          <div className='bg-[#F4FAE2] rounded-lg p-4'>
          <h2 className="text-xl font-bold ">Sponsor Overview</h2>
          <p>
            AMMI Investments LLP was established in 2003 to develop and revitalize mixed-use, multifamily, single-family, and commercial real estate in urban infill locations. 
            Headquartered in New York, AMMI manages over £500 million in assets and is committed to producing luxury residential and commercial properties.
          </p>
          <p>
            AMMI collaborates exclusively with Overseas Management Group for contracting and Kiii Design for interior designing, creating a cohesive team environment under one roof. 
            Their portfolio spans boutique single-family homes to large mixed-use buildings, generating over $30M in development revenue.
          </p>
         </div>


         <div className='bg-[#F4FAE2] rounded-lg p-4'>

         <h3 className="text-xl font-semibold  ">Sponsor Projects in the Last 30 Months</h3>
         <ul className="list-none mt-2  2xl:w-[50%] ">
           <li className="info-item flex justify-between py-2">
             <span>Total Investment Properties</span>
             <span className="font-semibold">39</span>
           </li>
           <li className="info-item flex justify-between py-2">
             <span>Total Amount Invested</span>
             <span className="font-semibold">£7,559,000</span>
           </li>
           <li className="info-item flex justify-between py-2">
             <span>Total Revenue Generated</span>
             <span className="font-semibold">£18,168,000</span>
           </li>
           <li className="info-item flex justify-between py-2">
             <span>Profit</span>
             <span className="font-semibold">£2,607,000</span>
           </li>
           <li className="info-item flex justify-between py-2">
             <span>ROI</span>
             <span className="font-semibold">~34%</span>
           </li>
           <li className="info-item flex justify-between py-2">
             <span>Value of Assets on Hand</span>
             <span className="font-semibold">£5,085,000</span>
           </li>
         </ul>
         </div>
       </div>

      ) }
      
      {/* Projected Annual Returns Section */}
      <div className="featureContainer my-[40px] bg-[#F4FAE2] rounded-lg p-4">
        <h3 className="text-xl font-bold mb-2">Projected  Returns</h3>
        <ul className="space-y-2  2xl:w-[50%]">
  
          <li className="flex justify-between">
            <span>Rental Yield</span>
            {data?.projected_rental_yield !== null && data.projected_rental_yield} %       
          </li>

          {renderFinancialItem("Total Investment Value", data.total_investment_value)}
        </ul>
      </div>

      {/* Annual and Monthly Expenses Section */}
      <div className="featureContainer  my-[40px] bg-[#F4FAE2] rounded-lg p-4">
        <h3 className="text-xl font-bold mb-2">Annual and Monthly Expenses</h3>
        <ul className="space-y-2  2xl:w-[50%]">
          {renderFinancialItem("Annual Cash Flow", data.annual_cash_flow)}
          {renderFinancialItem("Homeowners Insurance", data.homeowners_insurance)}
          {renderFinancialItem("Property Management", data.property_management)}
          {renderFinancialItem("Annual LLC Administration and Filing Fees", data.dao_administration_fees)}
          {renderFinancialItem("Operating Reserve Replenishment", data.operating_reserve)}
          {renderFinancialItem("Monthly Cash Flow", data.monthly_cash_flow)}
          {renderFinancialItem("Projected Annual Cash Flow", data.projected_annual_cash_flow)}
        </ul>
      </div>
      <div className="featureContainer my-[40px] bg-[#F4FAE2] rounded-lg p-4">
        <h3 className="text-xl font-bold mb-2">Capital Stack</h3>
        <p>Visual representation of capital stack distribution between Token Sale Equity, Senior Debt, Sponsor Equity, and Tax Credits</p>
        <CapitalStackGraph/>
      </div>
      <div className="py-6">

       {/* just for Opportunistic */}
       {data.investment_category === "Opportunistic" && (
        <>
        {/* Sources & Uses Section */}
        <section className="mb-8 bg-[#F4FAE2] rounded-lg p-4">
  <h3 className="text-xl font-bold mb-4">Sources & Uses</h3>

  {/* Mostrar como tabla en pantallas grandes */}
  <div className="hidden lg:block">
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="border-b-2 border-gray-300 py-2 text-left">Name</th>
          <th className="border-b-2 border-gray-300 py-2 text-left">Type</th>
          <th className="border-b-2 border-gray-300 py-2 text-left">Amount</th>
          <th className="border-b-2 border-gray-300 py-2 text-left">Rate</th>
          <th className="border-b-2 border-gray-300 py-2 text-left">Ratio</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border-b border-gray-200 text-sm md:text-base py-2">Investment</td>
          <td className="border-b border-gray-200 text-sm md:text-base py-2">Sponsor & Token Holders</td>
          <td className="border-b border-gray-200 text-sm md:text-base py-2">$1,623,000</td>
          <td className="border-b border-gray-200 text-sm md:text-base py-2">0%</td>
          <td className="border-b border-gray-200 text-sm md:text-base py-2">29%</td>
        </tr>
        <tr>
          <td className="border-b border-gray-200 text-sm  md:text-base py-2">Debt</td>
          <td className="border-b border-gray-200  text-sm md:text-base py-2">Construction Finance</td>
          <td className="border-b border-gray-200  text-sm  md:text-base py-2">$4,000,000</td>
          <td className="border-b border-gray-200 text-sm md:text-base py-2">4% interest</td>
          <td className="border-b border-gray-200 text-sm md:text-base py-2">71%</td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* Mostrar en formato de tarjetas en pantallas móviles */}
      <div className="lg:hidden space-y-4">
      <div className=" p-5 rounded-lg  border-gray-200">
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Investment Details</h4>
        <div className="text-base space-y-1">
          <p className="flex items-center justify-between">
            <span className="text-gray-500">Name:</span>
            <span className="font-medium text-gray-700">Investment</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-gray-500">Type:</span>
            <span className="font-medium text-gray-700">Sponsor & Token Holders</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium text-green-600">$1,623,000</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-gray-500">Rate:</span>
            <span className="font-medium text-gray-700">0%</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-gray-500">Ratio:</span>
            <span className="font-medium text-gray-700">29%</span>
          </p>
        </div>
      </div>
      <hr/>
      <div className=" p-5 rounded-lgborder-gray-200">
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Debt Details</h4>
        <div className="text-base space-y-1">
          <p className="flex items-center justify-between">
            <span className="text-gray-500">Name:</span>
            <span className="font-medium text-gray-700">Debt</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-gray-500">Type:</span>
            <span className="font-medium text-gray-700">Construction Finance</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium text-green-600">$4,000,000</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-gray-500">Rate:</span>
            <span className="font-medium text-gray-700">4% interest</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-gray-500">Ratio:</span>
            <span className="font-medium text-gray-700">71%</span>
          </p>
        </div>
      </div>
    </div>
    </section>


            {/* Capital Calls Section */}
            <section className="mb-8 bg-[#F4FAE2] rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">Capital Calls</h3>
              <p className="text-gray-600">
                Token owners are not required to provide additional capital. Refer to Article 8 of the Investment Circular for comprehensive capital call information.
              </p>
            </section>

            {/* Project Team Section */}
            <section className="mb-8  featureContainer bg-[#F4FAE2] rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4">Project Team</h3>
              <ul className="list-disc  2xl:w-[50%]">
                <li className="info-item flex justify-between py-2">
                  <span>Developer</span>
                  <span className="font-semibold">AMMI Investments LLP</span>
                </li>
                <li className="info-item flex justify-between py-2">
                  <span>Architect</span>
                  <span className="font-semibold">Plate Architecture</span>
                </li>
                <li className="info-item flex justify-between py-2">
                  <span>Engineering Team</span>
                  <span className="font-semibold">Marque Engineering</span>
                </li>
                <li className="info-item flex justify-between py-2">
                  <span>Designer</span>
                  <span className="font-semibold">Kiii Design</span>
                </li>
                <li className="info-item flex justify-between py-2">
                  <span>LEED Professional</span>
                  <span className="font-semibold">SL Consulting</span>
                </li>
                <li className="info-item flex justify-between py-2">
                  <span>Legal Team</span>
                  <span className="font-semibold">Fey Law</span>
                </li>
                <li className="info-item flex justify-between py-2">
                  <span>Accounting</span>
                  <span className="font-semibold">EY</span>
                </li>
                <li className="info-item flex justify-between py-2">
                  <span>Property Manager</span>
                  <span className="font-semibold">Ker Willis</span>
                </li>
              </ul>
            </section>

            {/* Project Budget Section */}
            <section className="featureContainer bg-[#F4FAE2] rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4">Project Budget</h3>
              <ul className="list-disc  2xl:w-[50%]">
                <li className="info-item flex justify-between py-2">
                  <span>Acquisition Costs</span>
                  <span className="font-semibold">£750,000 (13%)</span>
                </li>
                <li className="info-item flex justify-between py-2">
                  <span>Soft Cost Expenses</span>
                  <span className="font-semibold">£361,000 (6%)</span>
                </li>
                <li className="info-item flex justify-between py-2">
                  <span>Hard Cost Expenses</span>
                  <span className="font-semibold">£3,595,000 (64%)</span>
                </li>
                <li className="info-item flex justify-between py-2">
                  <span>Contingency</span>
                  <span className="font-semibold">£252,000 (4%)</span>
                </li>
                <li className="info-item flex justify-between py-2">
                  <span>Holding & Lease Up Cost</span>
                  <span className="font-semibold">£665,000 (13%)</span>
                </li>
                <li className="info-item flex justify-between py-2">
                  <span>Total Project Costs</span>
                  <span className="font-semibold">£5,623,000 (100%)</span>
                </li>
              </ul>
            </section>
        
        </>
       )}
    </div>
    </section>
  );
};



export default Finantial;