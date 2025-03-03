import { useState, useEffect } from 'react';

interface SearchBarProps {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
  className?: string;
  handleOnSearch: () => void
}

const SearchInputBar  = ({
  onChange,
  handleOnSearch,
  placeholder = 'Search...',
  value,
  className = "",
}:SearchBarProps) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Contenedor del input con ícono */}
      <div className="relative flex-grow">
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        <input
          type="text"
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8E870]"
        />
      </div>
      {/* Botón a la derecha del input */}
      <button
        onClick={handleOnSearch}
        type="button"
        className="ml-2 py-2 px-4 bg-[#C8E870] text-white border font-semibold rounded-lg duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-[#C8E870]"
      >
        Search
      </button>
    </div>
  );
};

export default SearchInputBar;
