import React, { useState } from 'react';
import { FaArrowCircleLeft } from "react-icons/fa";
import { Checkbox } from '@/components/ui/checkbox';
import alert_svg from "../../assets/alert-triangle.svg"


export const InvestorAgreement: React.FC<{ onCheckedChange: (isChecked: boolean) => void, handleBackToSelection: () => void }> = ({ onCheckedChange, handleBackToSelection }) => {
    const [agreementAccepted, setAgreementAccepted] = useState<boolean>(false);
  
    const handleClick = () => {
      const newValue = !agreementAccepted;
      setAgreementAccepted(newValue);
      onCheckedChange(newValue); // Pasamos el nuevo valor al componente padre
    };
  
    return (
      <article className="mx-auto bg-white rounded-lg p-6 ">
        <FaArrowCircleLeft
          className="text-[#C8E870] mb-3 cursor-pointer"
          onClick={handleBackToSelection}
        />
        <h4 className="font-bold text-2xl mb-[80px]">I am an accredited investor</h4>
        <span className="flex space-x-2 mb-5">
          <img alt="alert" src={alert_svg} />
          <p className="font-semibold">Eligible investors meet at least one of the following definitions:</p>
        </span>
        <ul className="space-y-3">
          <li className="space-y-3">
            <p className="text-gray-500 font-bold">1. Individual Accreditation:</p>
            <p>
              a) Net Income: Your net income during the immediately preceding financial year must be equal to or greater than £100,000 OR <br />
              b) Net Assets: Your net assets held throughout the immediately preceding financial year must be equal to or greater than £250,000 (excluding the value of your primary residence).
            </p>
          </li>
          <li className="space-y-3">
            <p className="text-gray-500 font-bold">2. Legal Entities and Unincorporated Bodies:</p>
            <p>
              a) Trusteeship: The investor is a trustee of a high-value trust, i.e., a trust where the aggregate value of the cash and investments that form part of the trust's assets (before deducting the amount of its liabilities) is at least £10 million; or has been at least £10 million at any time during the immediately preceding year. <br />
              b) Unincorporated Association or Partnership: If the investor has net assets of at least £500,000; has over 20 members.
            </p>
          </li>
        </ul>
        <span className="flex items-center justify-center space-x-3 mt-[80px]">
          <Checkbox
            id="investor-agreement"
            checked={agreementAccepted}
            onCheckedChange={handleClick}
            className="cursor-pointer"
          />
          <label htmlFor="investor-agreement" className="text-gray-500 text-sm">
            I am an accredited investor
          </label>
        </span>
      </article>
    );
  };