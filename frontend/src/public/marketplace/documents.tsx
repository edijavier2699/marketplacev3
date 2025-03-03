import externalLink from "../../assets/external-link.svg"
import download from "../../assets/download.svg"

const Documents = () => {
  return (
    <div className="glass-container">
    <section className="p-4">
      <h4 className="font-bold text-[30px] mb-4">Projected Annual Returns</h4>
      <ul className="space-y-4">
        <li className="flex items-center space-x-2">
          <a href="https://tssrct-my.sharepoint.com/:w:/g/personal/mohamed_omar_tokunize_com/EVRdWk4gy71Ap6BAx_BcH9IBJXXrbBYoM9WyEn4FDobmlw?e=sJecMu" target="_blank" rel="noopener noreferrer" className="flex items-center underline">
            Private Placement Memorandum
          </a>
          <img src={externalLink} alt="external-link" />
        </li>
        <li className="flex items-center space-x-2">
          <a href="https://example.com/report2" target="_blank" rel="noopener noreferrer" className="flex items-center underline">
            Property Management and Insurance
          </a>
          <img src={externalLink} alt="external-link" />
        </li>
        <li className="flex items-center space-x-2">
          <a href="https://example.com/report3" target="_blank" rel="noopener noreferrer" className="flex items-center underline">
            Operation expense report
          </a>
          <img src={download} alt="external-link" />
        </li>
        <li className="flex items-center space-x-2">
          <a href="https://example.com/report4" target="_blank" rel="noopener noreferrer" className="flex items-center underline">
            Download
          </a>
          <img src={download} alt="external-link" />
        </li>
        <li className="flex items-center space-x-2">
          <a href="https://example.com/report5" target="_blank" rel="noopener noreferrer" className="flex items-center underline">
            External link
          </a>
          <img src={externalLink} alt="external-link" />
        </li>
      </ul>
    </section>
    </div>
  );
};


export default Documents;