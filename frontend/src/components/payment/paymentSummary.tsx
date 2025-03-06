import React from 'react';
import checkBoxSuccesIcon from "../../assets/bigCheckBox.svg";
import { FormatCurrency } from '../currencyConverter';

interface PaymentSummaryProps {
  investmentAmount: number; // Assuming the amount is passed as a string
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({ investmentAmount }) => {
  return (
    <article className="p-5 text-center">
      <img alt="success-check-box" src={checkBoxSuccesIcon} className="mx-auto mb-4" />
      <p className="font-bold text-3xl"><FormatCurrency amount={2200000} /></p>
      <p className="text-lg text-gray-600">Successfully invested</p>
      <ul className="space-y-2 mt-4">
        <li className="flex justify-between py-2">
          <span className="font-bold text-sm">Reference NO.</span>
          <span className="text-gray-500">XCVDfkeru45</span>
        </li>
      </ul>
    </article>
  );
};
