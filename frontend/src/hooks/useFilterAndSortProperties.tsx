import {  useMemo } from 'react';
import { Filters, Property } from '@/types';

const useFilteredAndSortedProperties = (properties: Property[], filters: Filters) => {
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const meetsLocation = 
        !filters.location || property.location.toLowerCase() === filters.location.toLowerCase();
  
      const meetsPropertyType = 
        !filters.property_type || property.property_type.toLowerCase() === filters.property_type.toLowerCase();
    
      const meetsInvestmentCategory = 
        !filters.investment_category || property.investment_category.toLowerCase() === filters.investment_category.toLowerCase();
  
        return meetsLocation && meetsPropertyType && meetsInvestmentCategory;
    });
  }, [properties, filters.location, filters.property_type, filters.investment_category]);

  const sortedProperties = useMemo(() => {
    return filteredProperties.sort((a, b) => {
      switch (filters.sort_by) {
        case "price_asc":
          return a.tokens[0].token_price - b.tokens[0].token_price;
        case "price_desc":
          return b.tokens[0].token_price - a.tokens[0].token_price;
        case "annual_return_asc":
          return parseFloat(a.projected_annual_return) - parseFloat(b.projected_annual_return);
        case "annual_return_desc":
          return parseFloat(b.projected_annual_return) - parseFloat(a.projected_annual_return);
          case "risk_rating_asc": // Nueva opción de ordenamiento
          return a.risk_rating - b.risk_rating;
        case "risk_rating_desc": // Nueva opción de ordenamiento
          return b.risk_rating - a.risk_rating;
        default:
          return 0;
      }
    });
  }, [filteredProperties, filters.sort_by]);

  return sortedProperties;
};

export default useFilteredAndSortedProperties;