import { MdDashboard } from "react-icons/md";
import { MdViewList } from "react-icons/md";


const SwitchButton = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
  return (
    <label
      className="flex items-center cursor-pointer"
      onClick={onChange}
    >
      <div
        className={`relative inline-block w-16 h-8 transition-all rounded-full ${
          checked ? "bg-[#C8E870]" : "bg-[#C8E870]"
        }`}
      >
        {/* El círculo que se mueve */}
        <span
          className={`absolute left-0 top-0 w-8 h-8 transition-all bg-white rounded-full ${
            checked ? "translate-x-8" : "translate-x-0"
          }`}
        />

        {/* Los íconos dentro del círculo */}
        <div className="flex h-8 items-center w-16 justify-center justify-between px-3">
          <MdDashboard
            className={`w-4 h-4`}
          />
          <MdViewList
            className={`w-4 h-4`}
          />
        </div>
      </div>
    </label>
  );
};

export default SwitchButton;