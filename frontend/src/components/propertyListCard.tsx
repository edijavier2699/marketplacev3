import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import shareIcon from "../assets/share.png";
import CustomCarousel from './CustomCarousel';
import { FormatCurrency } from './currencyConverter';

interface PropertyListCardProps {
  title: string;
  location: string;
  minTokenPrice: number;
  estAnnualReturn: string;
  propertyImgs: string[];
  reference_number: string;
  tokensSold: number;  
  totalTokens: number;  
  createdDay: string;
  status: string;  
  tokens_available: number;
  investment_category: string;
  nav: number;
  token_structure:string
  propertyType:string
};

const PropertyListCard = ({
  title,
  location,
  minTokenPrice,
  estAnnualReturn,
  propertyImgs,
  totalTokens = 0,  
  createdDay,
  status,
  reference_number,
  tokens_available,
  investment_category,
  nav,
  token_structure,
  propertyType
}: PropertyListCardProps) => {
  const [badgeType, setBadgeType] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();

  const toggleInfo = () => {
    setShowInfo(prevState => !prevState);
  };


  useEffect(() => {
    const createdDate = new Date(createdDay);
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
  

    const soldTokens = totalTokens ? totalTokens - tokens_available : 0;
    const soldPercentage = totalTokens > 0 ? (soldTokens / totalTokens) * 100 : 0;

    if (status === "sold") {
      setBadgeType("Sold");
    } else if (soldPercentage > 80) {
      setBadgeType('Almost Gone!');
    } else if (createdDate >= oneWeekAgo && status === "published") {
      setBadgeType('New');
    } else if (status === "coming_soon") {
      setBadgeType('Coming Soon');
    } else {
      setBadgeType(null);
    }
    if (investment_category) {
      setCategory(investment_category);
    }
  }, [createdDay, status, totalTokens, tokens_available, investment_category]);

  const handleCardClick = () =>{
    navigate(`/property/${reference_number}/`)
  }

  return (
    <article  
        onMouseEnter={toggleInfo}
        onMouseLeave={toggleInfo}
        className="relative rounded-lg overflow-hidden mt-6 transition-shadow duration-300 border border-gray-100">
      <div className="relative">
        {category && (
          <span className="absolute left-4 top-4 bg-black text-white text-xs font-semibold py-1 px-3 rounded-full z-20 uppercase tracking-wide">
            {category}
          </span>
        )}

        {badgeType && (
          <div className={`absolute top-4 left-4 text-xs font-semibold py-1 px-3 rounded-full z-20 ${
            badgeType === 'New' ? 'bg-[#FFFAEA] border border-[#FDB122] text-[#B54707]' :
            badgeType === 'Sold' ? 'bg-[#FFFAEA] border border-[#FDB122] text-[#B54707]' :
            badgeType === 'Almost Gone!' ? 'border border-[#F97066] bg-[#FEF4F3] text-[#B42217]' :
            'bg-gray-100 border border-gray-300 text-gray-700'
          }`}>
            {badgeType}
          </div>
        )}

        {(status === "published" || status === "coming_soon") && (
          <span className="absolute top-4 right-4 z-20 cursor-pointer h-8 w-8 p-2 bg-white bg-opacity-80 rounded-full hover:bg-gray-100 hover:shadow-md transition-all duration-300">
            <img src={shareIcon} alt="share" className="h-full w-full" />
          </span>
        )}
      </div>

      <Link to={`/property/${reference_number}/`} className="h-64 p-2 relative block hover:opacity-90 transition-opacity duration-300">
        <CustomCarousel title='property-images' images={propertyImgs.slice(0, 3)} />
      </Link>

      <div className="p-6">
        <div className="flex items-center justify-end mb-4">
        <div className="text-sm text-gray-500 font-medium">
  {status === "published" ? (
    <>
      {Number(tokens_available).toFixed(2)} Tokens Left
    </>
  ) : status === "sold" ? (
    <span className="text-red-600">Sold</span>
  ) : (
    <span className="text-blue-600">Coming Soon</span>
  )}
</div>


        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 text-sm mb-6">{location}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Manager</span>
            <p className="font-semibold text-gray-800">Jack Deveston</p>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Token Structure</span>
            <p className="font-semibold text-gray-800">{token_structure}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">NAV</span>
            <span className="font-semibold text-gray-800"><FormatCurrency amount={nav}/></span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Estimated IRR</span>
            <p className="font-semibold text-gray-800">{estAnnualReturn}%</p>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Holding Term</span>
            <p className="font-semibold text-gray-800">5 years</p>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Token Price</span>
            <span className="font-semibold text-gray-800"><FormatCurrency amount={minTokenPrice}/></span>
          </div>
        </div>
      </div>

    
  <div
      onClick={handleCardClick}
      className={`absolute cursor-pointer z-20 inset-0 bg-[#C8E870] shadow-lg rounded-lg p-6 transition-all duration-200 ease-linear ${
        showInfo ? "translate-y-0 opacity-100" : "translate-y-full opacity-95"
      }`}
    >

    {/* Encabezado discreto */}
    <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
      <div>
        <h2 className="text-[15px] font-medium text-gray-900 tracking-tight">{title}</h2>
        <p className="text-xs text-gray-500 mt-1">{propertyType} </p>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">Core+</span>
        <div className="w-6 h-6 bg-gray-50 rounded-md flex items-center justify-center">
          <span className="text-gray-400 text-sm">↗</span>
        </div>
      </div>
    </div>

    {/* Tabla compacta de métricas */}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-[13px] text-gray-500 font-medium">
            <th className="pb-3 text-left w-[40%]">Metric</th>
            <th className="pb-3 text-right w-[30%]">RLMA</th>
            <th className="pb-3 text-right w-[30%]">Benchmark</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
   
          {/* Fila de Retorno */}
          <tr className="hover:bg-gray-50 duration-300">
            <td className="py-2.5 text-[13px] text-gray-900">IRR</td>
            <td className="text-right text-[13px] font-medium text-gray-900">8.1%</td>
            <td className="text-right text-[13px] text-gray-500">6.7%</td>
          </tr>

          {/* Fila de Ingresos */}
          <tr className="hover:bg-gray-50 duration-300">
            <td className="py-2.5 text-[13px] text-gray-900">NOI Growth</td>
            <td className="text-right text-[13px] font-medium text-gray-900">4.2%</td>
            <td className="text-right text-[13px] text-gray-500">3.1%</td>
          </tr>

          {/* Fila de Capital */}
          <tr className="hover:bg-gray-50 duration-300">
            <td className="py-2.5 text-[13px] text-gray-900">Cap Rate</td>
            <td className="text-right text-[13px] font-medium text-gray-900">5.8%</td>
            <td className="text-right text-[13px] text-gray-500">5.2%</td>
          </tr>

          {/* Fila de Deuda */}
          <tr className="hover:bg-gray-50 duration-300">
            <td className="py-2.5 text-[13px] text-gray-900">Occupancy  Rate</td>
            <td className="text-right text-[13px] font-medium text-gray-900">87%</td>
            {/* <td className="text-right text-[13px] text-gray-500">4.5%</td> */}
          </tr>

        </tbody>
      </table>
    </div>

      {/* Pie de tabla técnico */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <span className="text-[11px] text-gray-500">Net Asset Value: <FormatCurrency amount={nav}/></span>
            <span className="text-[11px] text-gray-500">·</span>
            <span className="text-[11px] text-gray-500">DSCR: 2.4x</span>
          </div>
          <span className="text-[11px] text-gray-500">Quarterly Update: Q2 2024</span>
        </div>
      </div>
    </div>
    </article>
  );
};

export default PropertyListCard;