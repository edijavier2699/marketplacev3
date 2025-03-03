import { useState } from 'react';
import "../../styles/singUp.css"; 
import { SignUpForm } from '../forms/singUpForm';
import { AccountType } from '@/public/login/accounType';
import SingUpEmailForm from '../forms/singUpEmailForm';

// Componente principal SignUpPage con Wizard Steps
const SignUpPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Manejador para avanzar al siguiente paso
  const handleEmailSubmit = (email: string) => {
    setEmail(email);
    setCurrentStep(2);
  };

  const handleFormSubmit = (formValues: any) => {
    setFormData(formValues);
    setCurrentStep(3);
    setLoading(false);
  };

  return (
    <section className="flex justify-center items-center" id="signUpSection">
      {/* Paso 1: Formulario de Email */}
      {currentStep === 1 && (
        <SingUpEmailForm onEmailSubmit={handleEmailSubmit} />
      )}

      {/* Paso 2: Formulario de Registro */}
      {currentStep === 2 && !loading && (
          <SignUpForm
            email={email}
            setIsEmailSubmitted={setCurrentStep}
            onSignUpSuccess={handleFormSubmit}
          />
        )}

      {/* Paso 3: Selección de Tipo de Cuenta */}
      {currentStep === 3 && formData && (
        <AccountType formData={formData} />
      )}
    </section>
  );
};

export default SignUpPage;
