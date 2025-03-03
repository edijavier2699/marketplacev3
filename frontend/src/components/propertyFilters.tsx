import  { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Filters } from '@/types';

const sortOptions: { [key: string]: string } = {
  'price_asc': 'Price: Low to High',
  'price_desc': 'Price: High to Low',
  'annual_return_asc': 'Annual Return: Low to High',
  'annual_return_desc': 'Annual Return: High to Low',
  'risk_rating_asc': 'Risk Rating: Low to High', // Nueva opción
  'risk_rating_desc': 'Risk Rating: High to Low', // Nueva opción
};

interface FiltersProps {
  locations: string[];
  propertyTypes: string[];
  investmentCategories: string[]; // Nuevo prop
  onFilterChange: (key: keyof Filters, value: string) => void;
}

const PropertyFilters = ({
  locations,
  onFilterChange,
  propertyTypes,
  investmentCategories
}:FiltersProps) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('');
  const [selectedInvestCategory, setSelectedInvestCategory] = useState<string>(''); // Nuevo estado

  const [sortBy, setSortBy] = useState<string>('');

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location === "All" ? "" : location);
    onFilterChange('location', location === "All" ? "" : location);
  };

  const handleInvestCategorySelect = (investCategory: string) => {
    setSelectedInvestCategory(investCategory === "All" ? "" : investCategory);
    onFilterChange('investment_category', investCategory === "All" ? "" : investCategory);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onFilterChange('sort_by', value);
  };

  const uniqueLocations = Array.from(new Set(locations.map(location => {
    const normalizedLocation = location.toLowerCase();
    return normalizedLocation.charAt(0).toUpperCase() + normalizedLocation.slice(1);
  })));
  
  const uniquePropertyTypes = Array.from(new Set(propertyTypes.map(type => {
    const normalizedType = type.toLowerCase();
    return normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1);
  })));

  const uniqueInvestCategory = Array.from(new Set(investmentCategories.map(investCategory => {
    const normalizedAssetClass = investCategory.toLowerCase();
    return normalizedAssetClass.charAt(0).toUpperCase() + normalizedAssetClass.slice(1);
  })));

  return (
    <form className='flex flex-wrap justify-between'> 
      <div className='flex flex-wrap gap-4'>
        <div className='flex flex-row space-x-6 '>
          <div className='flex flex-col'>
            <label htmlFor="location" className='text-sm font-semibold hidden'>Location:</label>
            <Select onValueChange={handleLocationSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder='Select Location'>
                  {selectedLocation || "Select location"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="All">
                  All Locations
                </SelectItem>
                {uniqueLocations.map((location, index) => (
                  <SelectItem key={index} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col'>
            <label htmlFor="propertyType" className='text-sm font-semibold hidden'>Property Type:</label>
            <Select
              onValueChange={(value) => {
                setSelectedPropertyType(value === "all" ? "" : value);
                onFilterChange('property_type', value === "all" ? "" : value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder='Select Property Type'>
                  {selectedPropertyType || "Select property type"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">All Types</SelectItem>
                {uniquePropertyTypes.map((type, index) => (
                  <SelectItem key={index} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
 {/* Asset Class Filter */}
 <div className='flex flex-col'>
            <label htmlFor="assetClass" className='text-sm font-semibold hidden'>Investment Category:</label>
            <Select onValueChange={handleInvestCategorySelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder='Select investment category'>
                  {selectedInvestCategory || "Select Investment Category"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="All">
                  All investment categories
                </SelectItem>
                {uniqueInvestCategory.map((assetClass, index) => (
                  <SelectItem key={index} value={assetClass}>
                    {assetClass}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
  
      <div className='flex flex-col'>
        <label htmlFor="sort_by" className='text-sm font-semibold hidden'>Sort By:</label>
        <Select onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder='Sort by'>
              {sortBy ? sortOptions[sortBy] : "Select sorting option"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="left-0 origin-top-right">
            {Object.entries(sortOptions).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};


export default PropertyFilters;