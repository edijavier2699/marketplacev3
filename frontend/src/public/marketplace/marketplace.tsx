import  { useEffect, useState, lazy, Suspense } from "react";
import bannerImg from "../../assets/img/Banner.webp";
import { Filters, Property } from "@/types";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { MarketplaceSkeleton } from "@/components/skeletons/marketplaceSkeleton";
import useFilteredAndSortedProperties from "@/hooks/useFilterAndSortProperties";
import { DataTable } from "@/components/dataTable/components/data-table";
import { HomePropertyColumns } from "@/components/dataTable/components/columns/HomePropertyColumns";
import { homePropertySchema } from "@/components/dataTable/data/schema";
import { propertyType, investmentCategories } from "@/components/dataTable/data/data";
import { z } from "zod";
import { FaArrowTrendUp } from "react-icons/fa6";
import CountUp from 'react-countup';
import SwitchButton from "@/components/buttons/switchButton";
import StatCard from "@/components/cards/statCard";
import FlippingCard from "@/components/cards/flipingCard";

// Lazy load de los componentes de la vista "cards"
const LazyPropertyFilters = lazy(() => import("@/components/propertyFilters"));
const LazyPropertyListCard = lazy(() => import("@/components/propertyListCard"));

const Marketplace = () => {
  const today = new Date().toLocaleDateString();
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [filters, setFilters] = useState<Filters>({
    location: "",
    property_type: "",
    investment_category: "",
    sort_by: "",
  });

  const handleToggle = () => {
    setViewMode(viewMode === "table" ? "cards" : "table");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const { data, loading, error } = useGetAxiosRequest<Property[]>(
    `${import.meta.env.VITE_APP_BACKEND_URL}property/marketplace-list/`
  );
  const filteredAndSortedProperties = useFilteredAndSortedProperties(data ?? [], filters);
  // Validación de datos con zod
  const parsedProperties = z.array(homePropertySchema).parse(data || []);

  const filterOptions = [
    { column: "property_type", title: "Property Type", options: propertyType },
    { column: "investment_category", title: "Investment Category", options: investmentCategories },
  ];

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) return <MarketplaceSkeleton />;
  if (error) {
    console.log(error);
  }
  

  return (
    <section>
      <article
        className="rounded-lg bg-black flex flex-col justify-center pl-[20px] mt-5 space-y-5 py-[40px] mb-[40px] bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <h3 className="text-white tracking-wide font-bold text-3xl leading-relaxed">
          Invest in commercial
          <br /> real estate with <span className="text-[#C8E870]">ease </span>
        </h3>
      </article>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Investment Volume"
          withBorder={true}
          date={today}
          value={<CountUp end={85} prefix="£" suffix="M" duration={2.5} />}
        />
        <FlippingCard
          isFlipped={isFlipped}
          front={
            <StatCard
              title="Registered Investors"
              withBorder={true}
              date={today}
              value="1K"
              icon={<FaArrowTrendUp className="text-[#008B5C] text-2xl" />}
            />
          }
          back={
            <StatCard
              title="Distributed Returns"
              withBorder={true}
              date={`YTD ${new Date().getFullYear()}`}
              value={"£19M"}
              icon={<FaArrowTrendUp className="text-[#008B5C] text-2xl" />}
            />
          }
        />
        <FlippingCard
          isFlipped={isFlipped}
          front={
            <StatCard
              title="Equity Multiple"
              date={today}
              value="3.2X"
              icon={<FaArrowTrendUp className="text-[#008B5C] text-2xl" />}
            />
          }
          back={
            <StatCard
              title="Avg. Returns"
              date={`YTD ${new Date().getFullYear()}`}
              value={"154%"}
              icon={<FaArrowTrendUp className="text-[#008B5C] text-2xl" />}
            />
          }
        />
      </div>

      {/* Botón para cambiar la vista */}
      <div className="flex justify-end mb-4 items-center gap-2">
        <SwitchButton checked={viewMode === "cards"} onChange={handleToggle} />
      </div>

      {/* Renderización condicional de la vista */}
      {viewMode === "table" ? (
        <section className="w-full grid grid-cols-1">
          <DataTable filterOptions={filterOptions} columns={HomePropertyColumns} data={parsedProperties} />
        </section>
      ) : (
        // Se usa Suspense para mostrar un fallback mientras se cargan los componentes lazy
        <Suspense fallback={<MarketplaceSkeleton />}>
          <LazyPropertyFilters
            locations={[...new Set(data?.map((p) => p.location))]}
            onFilterChange={handleFilterChange}
            propertyTypes={[...new Set(data?.map((p) => p.property_type))]}
            investmentCategories={[...new Set(data?.map((p) => p.investment_category))]}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredAndSortedProperties.map((property) => (
              <LazyPropertyListCard
                key={property.reference_number}
                title={property.title}
                location={property.location}
                minTokenPrice={property.tokens[0].token_price}
                estAnnualReturn={property.projected_annual_return}
                propertyImgs={property.image}
                reference_number={property.reference_number}
                tokensSold={property.tokens[0].tokensSold}
                totalTokens={property.tokens[0].total_tokens}
                createdDay={property.created_at}
                status={property.status}
                tokens_available={property.tokens[0].tokens_available}
                investment_category={property.investment_category}
                nav={property.price}
                propertyType={property.property_type}
                token_structure={property.property_token_structure}
              />
            ))}
          </div>
        </Suspense>
      )}
    </section>
  );
};

export default Marketplace;
