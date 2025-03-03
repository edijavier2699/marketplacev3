import React, { useState } from "react";
import { Button } from "../ui/button";

interface Step {
  label: string;
  content: (controls: {
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (stepIndex: number) => void;
  }) => React.ReactNode;
  showNext?: boolean; 
  showBack?: boolean; 
}

interface StepperProps {
  steps: Step[];
  initialStep?: number;
}

export const StepperFlow: React.FC<StepperProps> = ({ steps, initialStep = 0 }) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  // Métodos de navegación
  const nextStep = (): void => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = (): void => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const goToStep = (stepIndex: number): void => {
    if (stepIndex >= 0 && stepIndex < steps.length) setCurrentStep(stepIndex);
  };

  return (
    <div className="mx-auto ">
      {/* Header del Stepper */}
      <div className="flex justify-between items-center">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 cursor-pointer ${
              currentStep === index
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => goToStep(index)}
          >
          </div>
        ))}
      </div>

      {/* Contenido del Stepper */}
      <div className="p-4">
        {steps[currentStep].content({
          nextStep,
          prevStep,
          goToStep,
        })}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between mt-4">
        {/* Botón Back, solo si showBack es true */}
        {steps[currentStep].showBack && (
          <Button onClick={prevStep} disabled={currentStep === 0}>
            Back
          </Button>
        )}

        {/* Botón Next, solo si showNext es true */}
        {steps[currentStep].showNext && (
          <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
