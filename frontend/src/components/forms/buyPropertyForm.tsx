import React, { Suspense } from 'react';
import { FormatCurrency } from '../currencyConverter';
import { LoadingSpinner } from '../loadingSpinner';
const PaymentFlow = React.lazy(() => import('@/components/payment/paymentFlow'));

interface PurchaseFormProps {
  tokenPrice: number;
  property_id: string;
}

const PurchaseForm = ({
  tokenPrice,
  property_id,
}: PurchaseFormProps) => {

  return (
    <section className="sticky w-full space-y-4 top-0 py-4">
      <div
        className="space-y-4 border rounded-lg p-4"
        style={{ boxShadow: '0px 0px 13px 0px #00000014' }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="md:text-sm lg:text-lg text-gray-700 text-left">N.A.V</p>
            <span className="font-semibold md:text-lg lg:text-2xl">
              <FormatCurrency amount={2200000} />
            </span>
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <PaymentFlow property_id={property_id} />
        </Suspense>

      </div>
    </section>
  );
};

export default PurchaseForm;
