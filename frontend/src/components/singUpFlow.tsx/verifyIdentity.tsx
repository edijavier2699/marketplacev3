import scanner_svg from "../../assets/scan.svg"
import { Checkbox } from '@/components/ui/checkbox';
import React, { useState } from 'react';


export const VerifyIdentity: React.FC<{ onCheckedChange: (isChecked: boolean) => void }> = ({ onCheckedChange }) => {
    const [nonResidentConfirmation, setNonResidentConfirmation] = useState<boolean>(false);
  
    const handleClick = () => {
      const newValue = !nonResidentConfirmation;
      setNonResidentConfirmation(newValue);
      onCheckedChange(newValue); // Pasamos el nuevo valor al componente padre
    };
  
    return (
      <section className="p-6">
        <h4 className="text-2xl font-bold mb-4">Verify Your Identity</h4>
        <p className="text-gray-500 mb-6">
          We need you to verify your identity to ensure security and compliance. Please be prepared to upload the following documents:
        </p>
  
        <img alt="scanner" src={scanner_svg} className="w-20 mx-auto mb-6" />
  
        <ul className="space-y-6">
          <li>
            <h5 className="text-lg font-semibold">1. Government ID</h5>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
              <li>Ensure it's clear and readable. Good lighting helps!</li>
              <li>The ID should not be too close to its expiration date.</li>
              <li>Only original pictures are accepted—no screenshots or copies of any kind.</li>
            </ul>
          </li>
  
          <li>
            <h5 className="text-lg font-semibold">2. Selfie</h5>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
              <li>Take a clear photo using your webcam.</li>
              <li>No passport photos or other generic pictures are allowed.</li>
            </ul>
          </li>
  
          <li>
            <h5 className="text-lg font-semibold">3. Confirmation of Non-US Citizenship</h5>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
              <li>
                You need to confirm that you are not a US citizen, a dual US citizen, or a US tax resident.
              </li>
              <li>If you have dual nationality, feel free to reach out for assistance.</li>
            </ul>
          </li>
        </ul>
  
        <span className="flex items-center justify-center space-x-3 mt-[80px]">
          <Checkbox
            id="non-resident-confirmation"
            checked={nonResidentConfirmation}
            onCheckedChange={handleClick}
            className="cursor-pointer"
          />
          <label htmlFor="non-resident-confirmation" className="text-gray-500 text-sm">
            I confirm I am not a US citizen or dual US citizen and/or a US tax resident
          </label>
        </span>
      </section>
    );
  };
  
  