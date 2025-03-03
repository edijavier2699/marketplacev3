import  { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importamos los iconos de ojo
import { Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface Props {
  name: string;
  control: Control<any>;
  label: string;
  type?: string;
  description?: string;
  error?: string;
  autocomplete?: string; 
}

const InputForm = ({ name, control, label, error, description, type = "text", autocomplete }: Props) => {
  // Estado para manejar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative z-0 w-full group">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
          <div className="flex items-center justify-between ">
            <Input
              id={name}
              type={type === "password" && !showPassword ? "password" : "text"} // Mostrar 'password' o 'text' dependiendo de la visibilidad
              {...field}
              value={field.value || ""}
              onChange={(e) =>
                field.onChange(type === "number" ? Number(e.target.value) : e.target.value)
              }
              className={`block py-2.5 px-3 pr-6 w-full text-sm bg-transparent focus:outline-none peer mt-1 ${
                error ? "border-red-500" : ""
              }`}
              placeholder=" "
              autoComplete={autocomplete} 
            />

            {/* Si es un campo de tipo 'password', mostrar el icono de ojo */}
            {type === "password" && (
              <button
                type="button"
                className=" text-gray-500 absolute right-[10px]"
                onClick={() => setShowPassword(!showPassword)} // Alternar la visibilidad
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Mostrar el icono correspondiente */}
              </button>
            )}
        </div>

            <label
              htmlFor={name}
              className="pl-3 peer-focus:font-medium absolute top-3 text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[black] peer-focus:dark:text-[#C8E870] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
            >
              {label}
            </label>
          </>
        )}
      />
      {description && <p className="mt-3">{description}</p>} {/* Descripción opcional */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* Mensaje de error */}
    </div>
  );
};

export default InputForm;

