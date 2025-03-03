import React, { Suspense, useState } from 'react';
const Documents = React.lazy(() => import('./documents'));
const Activity = React.lazy(() => import('./activity'));
const Finantial = React.lazy(() => import('./financial'));
import { Overview } from './overview';
import { PropertyFinancialData } from '@/types';  
import { useGetAxiosRequest } from '@/hooks/getAxiosRequest';
import { DataAccordion } from '../../components/dataAccordion/DataAccordion';
import { Property ,TabItem,PropertyUpdate} from '@/types';

interface PropertyAccordionProps {
  property_id: string;
  overviewData: Property; 
}

// Tipo esperado para los datos de actividad
interface PropertyActivityData {
  property_updates: PropertyUpdate[];
  transactions: { semana: string; volumen_total: number }[];
  total_volumen: number;
}

export const PropertyAccordion = ({ property_id, overviewData }: PropertyAccordionProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0); // Default to 'Overview' tab
  
  const tabs: TabItem[] = [
    { type: "text", content: "Overview" },
    { type: "text", content: "Financial" },
    { type: "text", content: "Activity" },
    { type: "text", content: "Documents" },
  ];

  const viewType = typeof tabs[activeIndex]?.content === 'string'
  ? tabs[activeIndex].content.toLowerCase()
  : '';

  const { data, loading, error } = useGetAxiosRequest<PropertyFinancialData | PropertyActivityData >(
    `${import.meta.env.VITE_APP_BACKEND_URL}property/single/${property_id}/?view=${viewType}`, 
    true
  );
  
  const components = [
    <Overview overviewData={overviewData} key="overview" />,
    
    <Finantial
      data={viewType === 'financial' ? (data as PropertyFinancialData) : null} 
      loading={loading}
      error={error}
      key="financial"
    />,
    
    // Para Activity, solo pasa los datos si viewType es 'activity' y data no es null
    viewType === 'activity' && data ? (
      <Activity
        data={data as PropertyActivityData}
        loading={loading}
        error={error}
        key="activity"
      />
    ) : (
      <div>No data available</div>
    ),
    
    <Documents key="documents" />,
  ];
  
  const handleTabChange = (index: number) => {
    setActiveIndex(index); // Actualizar el índice activo
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataAccordion tabs={tabs} components={components} onTabChange={handleTabChange} />
    </Suspense>
  );
};
