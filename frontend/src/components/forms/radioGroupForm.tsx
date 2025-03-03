import { Control, Controller } from "react-hook-form";
import { formValuesPublicProperty } from "@/components/forms/schemas/publicPropertySchema";
import { Button } from "../ui/button";

interface Props {
  name: keyof formValuesPublicProperty;
  control: Control<any>;
  label: string;
  options: { label: string; value: string }[]; // Usamos string en lugar de boolean
  error?: string;
}

export const RadioGroupForm = ({ name, control, label, options, error }: Props) => {
  return (
    <div className="mb-4 items-center flex text-center  flex-col">
      <h3 className="font-bold text-3xl mb-4">{label}</h3> {/* Titulo visible */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex space-x-4">
            {/* Creamos dos botones de selección: Yes y No */}
            {options.map((option) => (                
              <Button
                key={option.value}
                type="button"
                onClick={() => field.onChange(option.value)} // Cambiar el valor al hacer click
                className={`px-4 py-2 rounded-md  ${field.value === option.value ? '' : 'bg-gray-300'}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        )}
      />
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* Mostrar mensaje de error */}
    </div>
  );
};

export default RadioGroupForm;
