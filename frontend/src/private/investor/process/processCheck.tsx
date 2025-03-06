import React from 'react';

export enum InvestmentStep {
  PROPERTY_RESEARCH = 'property-research',
  DUE_DILIGENCE = 'due-diligence',
  LEGAL_REVIEW = 'legal-review',
  CONTRACT_SIGNING = 'contract-signing',
  FUNDING = 'funding',
  OWNERSHIP_TRANSFER = 'ownership-transfer',
  PROPERTY_MANAGEMENT = 'property-management',
}

export enum StepStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
}

export interface InvestmentProcess {
  propertyId: string;
  propertyName: string;
  location: string;
  price: string;
  image: string;
  steps: PropertyStep[];
}

export interface PropertyStep {
  title: string;
  description: string;
  status: StepStatus;
  step: InvestmentStep;
  date?: string;
}

interface ProcessTrackerProps {
  investments: InvestmentProcess[];
}

const ProcessTracker = ({ investments }: ProcessTrackerProps) => {
  return (
    <div className="space-y-8">
      {investments.map((investment) => (
        <PropertyCard key={investment.propertyId} investment={investment} />
      ))}
    </div>
  );
};

interface PropertyCardProps {
  investment: InvestmentProcess;
}

const PropertyCard = ({ investment }: PropertyCardProps) => {
  return (
    <div className="bg-white rounded-xl  overflow-hidden">
      <div className="relative h-64" style={{ backgroundImage: `url(${investment.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold">{investment.propertyName}</h2>
            <p className="text-sm opacity-90">{investment.location}</p>
            <div className="mt-2 text-lg font-semibold">{investment.price}</div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <ProcessTimeline steps={investment.steps} />
      </div>
    </div>
  );
};

interface ProcessTimelineProps {
  steps: PropertyStep[];
}

const ProcessTimeline = ({ steps }: ProcessTimelineProps) => {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <TimelineStep key={step.step} step={step} isLast={index === steps.length - 1} />
      ))}
    </div>
  );
};

interface TimelineStepProps {
  step: PropertyStep;
  isLast: boolean;
}

const TimelineStep = React.memo(({ step, isLast }: TimelineStepProps) => {
  const statusConfig = {
    [StepStatus.COMPLETED]: {
      color: 'bg-green-500',
      icon: <CheckCircleIcon />, 
      text: 'text-green-500',
    },
    [StepStatus.IN_PROGRESS]: {
      color: 'bg-blue-500',
      icon: <ProgressIcon />, 
      text: 'text-blue-500 font-bold text-lg',
    },
    [StepStatus.DELAYED]: {
      color: 'bg-amber-500',
      icon: <AlertIcon />, 
      text: 'text-amber-500',
    },
    [StepStatus.PENDING]: {
      color: 'bg-gray-300',
      icon: <PendingIcon />, 
      text: 'text-gray-400',
    },
  };

  const currentStatus = statusConfig[step.status];

  return (
    <div className="flex group">
      <div className="flex flex-col items-center w-10 mr-4">
        <div className={`w-1 ${!isLast ? 'h-24' : 'h-10'} bg-gray-300`} />
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center mb-2">
          <div className={`${currentStatus.color} w-8 h-8 rounded-full flex items-center justify-center mr-3`}>
            {currentStatus.icon}
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${currentStatus.text}`}>{step.title}</h3>
            {step.date && (
              <span className="text-xs text-gray-500 ml-2">{step.date}</span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 ml-11">{step.description}</p>
      </div>
    </div>
  );
});

// Icons
const CheckCircleIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ProgressIcon = () => (
  <svg className="w-4 h-4 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const PendingIcon = () => (
  <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);





// ProcessCheck.tsx
import { useEffect, useState } from "react";
import { DataTable } from '@/components/dataTable/components/data-table';
import { BoughtAssetsColumns } from '@/components/dataTable/components/columns/BoughtAssetsColumns';
import { propertyType, investmentCategories } from "@/components/dataTable/data/data";
import { LoadingSpinner } from '@/components/loadingSpinner';


interface InvestmentData {
  reference_number: string;
  first_image: string;
  location: string;
  title: string;
  price: number;
  projected_rental_yield: number;
  ocupancy_status: string;
  property_type: string;
}


const ProcessCheck = () => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [investmentData, setInvestmentData] = useState<InvestmentProcess | null>(null);
  const [loading, setLoading] = useState(false);

  const filterOptions = [
    { column: "property_type", title: "Property Type", options: propertyType },
    { column: "investment_category", title: "Investment Category", options: investmentCategories },
  ];

  // Mock API call
  const fetchInvestmentProcess = async (referenceNumber: string) => {
    setLoading(true);
    // Simular llamada API con retraso
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - En producción reemplazar con llamada real
    const mockData: InvestmentProcess = {
      image: "https://images.unsplash.com/photo-1554232456-8727aae0cfa4",
      propertyId: referenceNumber,
      propertyName: `Property ${referenceNumber}`,
      location: "New York, NY",
      price: "$12.5M",
      steps: [
        {
          step: InvestmentStep.PROPERTY_RESEARCH,
          title: "Market Research",
          description: "Comparative market analysis completed",
          status: StepStatus.COMPLETED,
          date: "2024-03-01"
        },
        {
          step: InvestmentStep.DUE_DILIGENCE,
          title: "Due Diligence",
          description: "Financial and legal review",
          status: StepStatus.COMPLETED,
          date: "2024-03-10"
        },
        {
          step: InvestmentStep.LEGAL_REVIEW,
          title: "Legal Review",
          description: "Contract preparation and verification",
          status: StepStatus.IN_PROGRESS,
          date: "2024-03-15"
        },
        {
          step: InvestmentStep.CONTRACT_SIGNING,
          title: "Contract Signing",
          description: "Notary appointment and execution",
          status: StepStatus.PENDING
        },
        {
          step: InvestmentStep.FUNDING,
          title: "Funding",
          description: "Funds transfer and verification",
          status: StepStatus.PENDING
        },
        {
          step: InvestmentStep.OWNERSHIP_TRANSFER,
          title: "Ownership Transfer",
          description: "Title deed registration",
          status: StepStatus.PENDING
        },
        {
          step: InvestmentStep.PROPERTY_MANAGEMENT,
          title: "Property Management",
          description: "Handover to management company",
          status: StepStatus.PENDING
        }
      ]
    };
    setInvestmentData(mockData);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedProperty) {
      fetchInvestmentProcess(selectedProperty);
    }
  }, [selectedProperty]);

  const handleRowClick = (referenceNumber: string) => {
      setSelectedProperty(referenceNumber);
  };

  const boughtPropertiesExample: InvestmentData[] = [
    {
      reference_number: "PROP-001",
      first_image: "https://images.unsplash.com/photo-1554232456-8727aae0cfa4?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b2ZmaWNlc3xlbnwwfHwwfHx8MA%3D%3D",
      location: "123 Main St, New York, NY",
      title: "Luxury Apartment in Downtown",
      price: 450000,
      projected_rental_yield: 5.2,
      ocupancy_status: "Occupied",
      property_type: "Apartment",
    },
    {
        reference_number: "PROP-002",
        first_image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=2225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        location: "123 London ",
        title: "Offices",
        price: 2050000,
        projected_rental_yield: 6.2,
        ocupancy_status: "Occupied",
        property_type: "Offices",
      },
  ];

  return (
    <div className="space-y-6">
      <div className="w-full grid grid-cols-1">
        <DataTable 
          columns={BoughtAssetsColumns} 
          data={boughtPropertiesExample}
          filterOptions={filterOptions}
          onRowClick={handleRowClick} // Nueva prop
        />
      </div>
      
      {selectedProperty && (
        <div className="mt-8 p-6 bg-white rounded-lg ">
          <h2 className="text-2xl font-bold mb-4">Investment Process Tracking</h2>
          {loading ? (
            <div className="text-center py-8">
             <LoadingSpinner/>
              <p className="mt-4 text-gray-600">Loading investment details...</p>
            </div>
          ) : (
            investmentData && <ProcessTracker investments={[investmentData]} />
          )}
        </div>
      )}
    </div>
  );
};

export default ProcessCheck;