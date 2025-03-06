import PropTypes from "prop-types";
import externalLink from "../../assets/external-link.svg";
import download from "../../assets/download.svg";

// Componente reutilizable
const DocumentItem = ({ title, url, description, iconSrc }) => {
  return (
    <li className="flex flex-col space-x-2">
      <div className="flex">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center underline"
        >
          {title}
        </a>
        <img src={iconSrc} alt="icon" className="ml-2" />
      </div>
      <p className="mt-2">{description}</p>
    </li>
  );
};

// Definimos los tipos de los props para asegurarnos de que los datos pasados sean correctos.
DocumentItem.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  iconSrc: PropTypes.string.isRequired,
};

// Componente principal que usa el componente DocumentItem
const Documents = () => {
  return (
    <div className="glass-container">
      <section className="p-4">
        <h4 className="font-bold text-[30px] mb-4">Documents for Freehold Transactions</h4>

        {/* Buyer Documents */}
        <div>
          <h5 className="font-semibold text-[20px] mb-2">Documents the Buyer Must Provide (Freehold):</h5>
          <ul className="space-y-4">
            <DocumentItem
              title="Identification & Due Diligence Docs"
              url="https://example.com/identification-docs"
              description="Passport/driving licence and proof of address for ID checks (or company incorporation documents); proof of funds (bank statements or mortgage offer) to show the source of purchase money."
              iconSrc={externalLink}
            />
            <DocumentItem
              title="Mortgage Documents"
              url="https://example.com/mortgage-docs"
              description="If financed, the mortgage offer letter, any required personal guarantees, and on exchange the buyer will sign a mortgage deed (to be executed at completion). Company buyers need board resolutions authorizing purchase and loan."
              iconSrc={externalLink}
            />
            <DocumentItem
              title="Insurance Confirmation"
              url="https://example.com/insurance-confirmation"
              description="Evidence of building insurance arranged from exchange (especially for freehold purchases)."
              iconSrc={externalLink}
            />
            <DocumentItem
              title="Signed Contract and Transfer"
              url="https://example.com/signed-contract"
              description="Two copies of the contract signed (before exchange) and a signed transfer deed (TR1) for completion."
              iconSrc={download}
            />
            <DocumentItem
              title="SDLT Return"
              url="https://example.com/sdlt-return"
              description="Although prepared by the solicitor, the buyer must review and sign the Stamp Duty Land Tax return after completion."
              iconSrc={download}
            />
          </ul>
        </div>

        {/* Seller Documents */}
        <div className="mt-8">
          <h5 className="font-semibold text-[20px] mb-2">Documents the Seller Must Provide (Freehold):</h5>
          <ul className="space-y-4">
            <DocumentItem
              title="Title Documents"
              url="https://example.com/title-docs"
              description="Official copies of the Land Registry title register and title plan proving the freehold title, plus any relevant deeds or documents referred to (e.g. old conveyances if needed, documents for unregistered land if applicable)."
              iconSrc={externalLink}
            />
            <DocumentItem
              title="Property Information & Disclosures"
              url="https://example.com/property-info"
              description="Completed CPSE (Commercial Property Standard Enquiries) forms with thorough answers. Attachments typically include the property’s Energy Performance Certificate (EPC), any planning permissions or building regulation completion certificates for work done, warranties or guarantees (e.g. roof repairs, alarms, etc.), asbestos survey report (as required by law for commercial buildings), fire safety risk assessment (if applicable), environmental reports (if any), and any other material information about the property."
              iconSrc={externalLink}
            />
            <DocumentItem
              title="Draft Contract"
              url="https://example.com/draft-contract"
              description="A proposed sale contract, stating the property details and terms of sale. Also a draft transfer deed (TR1) for the buyer to approve, which the seller will sign prior to completion."
              iconSrc={download}
            />
            <DocumentItem
              title="Mortgage Details"
              url="https://example.com/mortgage-details"
              description="If the property is mortgaged, details of the outstanding charge so the buyer’s solicitor can note it (the charge will be removed on completion). The seller’s solicitor will prepare an undertaking to discharge the mortgage."
              iconSrc={download}
            />
            <DocumentItem
              title="Keys and Access"
              url="https://example.com/keys-access"
              description="Arrangements for keys, alarm codes, and any access fobs or documents (like manuals for equipment) to hand over on completion."
              iconSrc={download}
            />
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Documents;

