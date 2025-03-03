import { TabItem } from "@/types";


interface AccordionTabsProps {
  activeIndex: number | null;
  onTabClick: (index: number) => void;
  tabs: TabItem[]; // Ahora es un array de objetos con tipo y contenido
}

export const AccordionHeader = ({ activeIndex, onTabClick, tabs }: AccordionTabsProps) => {
  return (
    <div className="flex space-x-4 mb-4">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`border-b-2  pb-2 font-bold  px-1 items-center flex justify-center  transition-all ease-in-out duration-300 ${
            activeIndex === index ? 'border-black' : 'border-transparent text-gray-500'
          }`}
          onClick={() => onTabClick(index)} // Llamamos a onTabClick al hacer clic
        >
          {/* Verificamos el tipo de contenido y renderizamos el correspondiente */}
          {tab.type === 'icon' && <span >{tab.content}</span>}
          {tab.type === 'text' && <span >{tab.content}</span>}
        </button>
      ))}
    </div>
  );
};
