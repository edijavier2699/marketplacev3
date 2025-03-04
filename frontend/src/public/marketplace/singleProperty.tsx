import { PropertyAccordion } from "@/public/marketplace/propertyAccordion";
import { PropertyImagesGallery } from "@/components/PropertyImagesGallery";
import { Property } from '@/types';
import PurchaseForm from '@/components/forms/buyPropertyForm';

interface Props {
  data: Property,
  reference_number:string;
}

const SingleProperty = ({data, reference_number }:Props ) => {

  const images = data?.image || [];

  return (
    <section className="mt-5">
      <PropertyImagesGallery images={images} />
  
      <div className="flex space-x-[40px] justify-between mt-8">
        <div className="md:w-2/3">
          {data && <PropertyAccordion overviewData={data} property_id={reference_number} />}
        </div>
        <div className="hidden md:block md:w-1/3">
          {data && (
            <PurchaseForm
              property_id={reference_number}
              tokenPrice={data.tokens[0].token_price}
            />
          )}
        </div>
      </div>
    </section>
  );
};


export default SingleProperty;