import { useState } from 'react';
import assetOwnerImage from "../../assets/assetOwner.png";
import investorImage from "../../assets/investor.png";
import { FaArrowCircleLeft } from "react-icons/fa";
import { OwnerFlowCarousel } from '@/components/singUpFlow.tsx/ownerCarousel';
import { InvestorFlow } from '@/components/singUpFlow.tsx/investorFlow';
import axios from "axios";
import { useToast } from '@/components/ui/use-toast';
// import { useNavigate } from 'react-router-dom'; // Importar useNavigate


interface SignUpForm {
  email: string;
  password: string;
  name: string;
  last_name: string;
}


// Componente principal
export const AccountType = ({ formData }: { formData: SignUpForm }) => {
  const { toast } = useToast();
  // const navigate = useNavigate(); 



  // Función principal de envío
  const SubmitForm = async () => {
    const finalData = {
      client_id: 'RkDK38n0VPNZEmuv0ZgQx9P93rLPAOTK',
      email: formData.email,
      password: formData.password,
      connection: 'Username-Password-Authentication',
      given_name: formData.name,  // Solo primer nombre
      name: formData.name,  // Aquí se debe pasar el nombre real del usuario
      user_metadata: {
        lastName: formData.last_name,
        role: "user"
      },
    };


    console.log("final data" ,finalData);
    
    try {
      const response = await axios.post(
        'https://dev-2l2jjwfm5ekzae3u.us.auth0.com/dbconnections/signup',
        finalData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if(response.status === 200){
        toast({
          title: "Registration Successful!",
          description: "You have successfully signed up. Welcome to Tokunize!",
          duration: 5000,
          variant: "default",
        });
      }    
    } catch (err) {
      toast({
        title: "Registration Failed",
        description: "There was an error with your registration. Please try again.",
        duration: 5000,
        variant: "destructive",
      });
    }
  };

  const [selectedAccountType, setSelectedAccountType] = useState<'investor' | 'owner' | ''>(''); // Tipo más específico
  const [currentStep, setCurrentStep] = useState(0);

  // Función para manejar la selección del tipo de cuenta
  const handleSelectAccountType = (type: 'investor' | 'owner') => {
    setSelectedAccountType(type);
    setCurrentStep(0); // Reinicia el paso cuando se selecciona un nuevo tipo
  };

  const handleConfirmAccount = () => {
    SubmitForm(); 
  };


  // Función para ir al siguiente paso
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // Función para ir al paso anterior
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Función para volver a la selección de tipo de cuenta
  const handleBackToSelection = () => {
    setSelectedAccountType('');
    setCurrentStep(0);
  };

  // Renderizar contenido basado en el tipo de cuenta seleccionado
  const renderContent = () => {
    if (selectedAccountType === 'investor') {
      return (
        <InvestorFlow
          currentStep={currentStep}
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
          handleBackToSelection={handleBackToSelection}
          onInvestorConfirm={handleConfirmAccount} // Pasamos la función para confirmar el rol de "Investor"
        />
      );
    } else if (selectedAccountType === 'owner') {
      return (
        <div>
          <FaArrowCircleLeft className="text-[#C8E870] mb-3 cursor-pointer" onClick={handleBackToSelection} />
          <h3 className="font-semibold text-xl mb-[40px]">As a commercial real estate owner,</h3>
          <OwnerFlowCarousel onConfirm={handleConfirmAccount} /> {/* Pasamos la prop onConfirm */}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="flex flex-col items-center rounded-lg" id="accountTypeSection">
      <div className="items-center justify-center flex min-h-screen flex-col">
        {/* Mostrar el flujo según el tipo de cuenta seleccionado */}
        {selectedAccountType ? (
          <div className="rounded-lg  lg:w-[70%] py-5 ">
            {renderContent()}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg">
            <h1 className="text-3xl mb-[60px] text-center pt-5 font-semibold">Choose Your Account Type</h1>
            <p className="font-bold text-left mb-5">I Am...</p>
            {/* Selección de tipo de cuenta */}
            <div className="flex justify-between space-x-5 w-full max-w-md mb-6 ">
              {/* Opción de Investor */}
              <div 
                className={`flex w-1/2 flex-col items-center p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow`} 
                onClick={() => handleSelectAccountType('investor')}
              >
                <img 
                  src={investorImage}
                  alt="Investor" 
                  className="mb-4 h-16 rounded-full" 
                />
                <h2 className="text-xl">An Investor</h2>
              </div>
              {/* Opción de Owner */}
              <div 
                className={`flex flex-col w-1/2 items-center p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow`} 
                onClick={() => handleSelectAccountType('owner')}
              >
                <img 
                  src={assetOwnerImage} 
                  alt="Owner" 
                  className="mb-4 h-16 rounded-full" 
                />
                <h2 className="text-xl">An Asset Owner / Broker</h2>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
