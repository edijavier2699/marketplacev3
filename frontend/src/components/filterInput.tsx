import { Input } from "./ui/input";
import { IoMdSearch } from "react-icons/io";

interface FilterInputProps {
    onFilterChange: (value: string) => void; // Callback para manejar el cambio
    filterValue: string; // Valor actual del filtro
}

export const FilterInput = ({ onFilterChange, filterValue }:FilterInputProps) => {
    return (
        <div className="flex relative w-full items-center py-5">
            <Input
                placeholder="Filter properties by title..."
                value={filterValue} // Valor del filtro
                onChange={(event) => onFilterChange(event.target.value)} // Llamar al callback en el cambio
                className="w-full pr-8" // Añadir padding a la derecha para el icono
            />
            <IoMdSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
        </div>
    );
};

