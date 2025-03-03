import React from "react";

interface AccordionContentProps {
  activeIndex: number | null;
  components: React.ReactNode[]; // Acepta un array de componentes React
}

export const AccordionContent = ({ activeIndex, components }: AccordionContentProps) => {
  if (activeIndex === null) return null;

  return (
    <div>
      {components[activeIndex]}
    </div>
  );
};

