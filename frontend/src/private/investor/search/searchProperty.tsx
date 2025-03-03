import { useEffect, useState } from 'react';
import { useGetAxiosRequestManual } from '@/hooks/getAxiosRequest';
import SingleProperty from '@/public/marketplace/singleProperty';
import { LoadingSpinner } from '@/components/loadingSpinner';
import { Property } from '@/types';
import SearchInputBar from '@/components/SearchBarInput';

const SearchProperty = () => {
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<Property | null>(null);
  const [urlState, setUrlState] = useState<string>('');
  const [recentCodes, setRecentCodes] = useState<string[]>([]);

  // Cargar códigos recientes al iniciar
  useEffect(() => {
    const savedCodes = localStorage.getItem('recentPropertyCodes');
    if (savedCodes) {
      setRecentCodes(JSON.parse(savedCodes));
    }
  }, []);

  // Guardar códigos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('recentPropertyCodes', JSON.stringify(recentCodes));
  }, [recentCodes]);

  const { loading, error, fetchData } = useGetAxiosRequestManual<Property>(
    urlState,
    true,
    (data) => {
      setResults(data);
    }
  );

  useEffect(() => {
    if (urlState) {
      fetchData();
    }
  }, [urlState]);

  const handleSearch = () => {
    const trimmedValue = searchValue.trim();
    if (trimmedValue !== '') {
      setRecentCodes(prev => {
        const newCodes = [trimmedValue, ...prev.filter(code => code !== trimmedValue)];
        return newCodes.slice(0, 3);
      });
      
      const searchUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/single/${trimmedValue}/?view=overview`;
      setUrlState(searchUrl);
    } else {
      setResults(null);
      setUrlState('');
    }
  };

  return (
    <section className="p-4">
      <SearchInputBar 
        handleOnSearch={handleSearch}
        onChange={setSearchValue}
        value={searchValue}
        placeholder="Search properties by the reference number..."
      />

      {/* Historial de búsquedas recientes */}
      {recentCodes.length > 0 && (
        <div className="mt-3 ml-1 flex items-center text-sm text-gray-600">
          <span className="mr-2 font-medium">Recently used:</span>
          <div className="flex space-x-2">
            {recentCodes.map((code) => (
              <button
                key={code}
                onClick={() => {
                  setSearchValue(code);
                  handleSearch();
                }}
                className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-gray-700 text-sm"
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <LoadingSpinner />}


      {results ? (
        <SingleProperty 
          data={results} 
          reference_number={results.reference_number}
        />
      ) : (
        !loading && (
          <div className="h-[50vh] w-full flex items-center justify-center text-gray-500">
            {recentCodes.length === 0 ? 'Type a property reference number' : 'Not property found'}
          </div>
        )
      )}
    </section>
  );
};

export default SearchProperty;