import React, { useState } from "react";
import { AccordionContent } from "./AccordionContent";
import { AccordionHeader } from "./AccordionHeader";
import { TabItem } from "@/types";

interface DataAccordionProps {
  tabs: TabItem[];
  components: React.ReactNode[]; 
  onTabChange?: (index: number) => void; // Hacemos que sea opcional

}

export const DataAccordion = ({ tabs, components,onTabChange }:DataAccordionProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0); // Establecemos la primera pestaña como activa

  // Función para manejar el clic en las pestañas
  const handleTabClick = (index: number) => {
    if (index !== activeIndex) {      
      setActiveIndex(index); // Cambiar el índice si es un tab diferente
      onTabChange?.(index);  // Verificamos si onTabChange está definido
    }
  };

  return (
    <div className="w-full">
      {/* Usamos AccordionHeader para renderizar las pestañas */}
      <AccordionHeader
        tabs={tabs}
        activeIndex={activeIndex}
        onTabClick={handleTabClick}
      />

      {/* Renderizamos el contenido del acordeón según el índice activo */}
      <div className="grid grid-cols-1 gap-4">
        <AccordionContent activeIndex={activeIndex} components={components} />
      </div>
    </div>
  );
};
