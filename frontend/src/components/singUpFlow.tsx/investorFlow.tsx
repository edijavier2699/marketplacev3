import { useNavigate } from 'react-router-dom';
import { VerificationProgress } from '@/components/singUpFlow.tsx/verificationProgress';
import { InvestorAgreement } from '@/components/singUpFlow.tsx/investorAgreetment';
import { InvestorCarousel } from '@/components/singUpFlow.tsx/investorCarousel';
import { VerifyIdentity } from '@/components/singUpFlow.tsx/verifyIdentity';
import { VerificationDone } from '@/components/singUpFlow.tsx/verificationDone';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaArrowCircleLeft } from "react-icons/fa";


interface InvestorFlowProps {
    currentStep: number;
    handleNextStep: () => void;
    handlePrevStep: () => void;
    handleBackToSelection: () => void;
    onInvestorConfirm: () => void; // Nuevo prop para confirmar el rol de "Investor"
}

export const InvestorFlow= ({ currentStep, handleNextStep, handlePrevStep, handleBackToSelection, onInvestorConfirm }:InvestorFlowProps) => {
    const [isAgreementChecked, setIsAgreementChecked] = useState<boolean>(false); // Paso 1
    const [isNonResidentialChecked, setIsNonResidentialChecked] = useState<boolean>(false); // Paso 2
    const navigate = useNavigate(); // Hook para la navegación
  
    // Maneja el cambio del checkbox del Investor Agreement
    const handleCheckedChange = (isChecked: boolean) => {
      setIsAgreementChecked(isChecked);
    };
  
    // Maneja el cambio del checkbox de la confirmación de no ser residente de EE.UU.
    const handleResidentialChange = (isChecked: boolean) => {
      setIsNonResidentialChecked(isChecked);
    };
  
    let content;
  
    switch (currentStep) {
      case 0:
        content = <InvestorAgreement onCheckedChange={handleCheckedChange} handleBackToSelection={handleBackToSelection} />;
        break;
      case 1:
        content = <VerifyIdentity onCheckedChange={handleResidentialChange} />;
        break;
      case 2:
        content = <VerificationProgress />;
        break;
      case 3:
        content = <VerificationDone />;
        break;
      case 4:
        content = <InvestorCarousel />;
        break;
      default:
        content = null; 
    }
  
    // Habilitamos el botón si el paso actual es 0 y el acuerdo está aceptado,
    // o si el paso actual es 1 y la confirmación de no residencia está aceptada
    const isButtonDisabled =
      (currentStep === 0 && !isAgreementChecked) ||
      (currentStep === 1 && !isNonResidentialChecked);
  
    // Texto del botón dependiendo del paso
    const buttonText = (() => {
      switch (currentStep) {
        case 0:
          return "I Agree";
        case 1:
          return "Start Verification";
        case 2:
          return "Continue";
        case 3:
          return "Continue";
        case 4:
          return "Explore Marketplace Now";
        default:
          return null;
      }
    })();
  
    // Renderiza el botón de regreso dependiendo del paso
    const showBackButton = currentStep !== 0 && currentStep !== 4;
  
    // Función para manejar el botón en el paso final (InvestorCarousel)
    const handleFinalStep = () => {
      if (currentStep === 4) {
        navigate("/"); // Navegamos al Marketplace
      } else {
        handleNextStep(); // Si no es el último paso, avanzamos al siguiente
      }
    };

    const handleAgreementConfirm = () => {
      onInvestorConfirm(); // Confirmamos el rol de "Investor"
      handleFinalStep();
    };
  
    return (
      <div className="p-4 mx-auto">
        {/* Botón de regreso, solo lo mostramos si no estamos en el último paso */}
        {showBackButton && (
          <FaArrowCircleLeft
            className="text-[#C8E870] mb-3 cursor-pointer"
            onClick={handlePrevStep}
          />
        )}
        {content}
        <div className="flex items-center mx-auto mt-4">
          <Button className="w-[50%] mx-auto" onClick={currentStep === 0 ? handleAgreementConfirm : handleFinalStep} disabled={isButtonDisabled}>
            {buttonText}
          </Button>
        </div>
      </div>
    );
  };
