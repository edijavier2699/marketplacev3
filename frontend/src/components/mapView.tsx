import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

interface MapViewProps {
  location: string; // The location prop is a string representing the address
}

// Define the type for the coordinates state
interface Coordinates {
  lat: number;
  lon: number;
}

// Custom hook to update the map center
const SetCenter = ({ lat, lon }: Coordinates) => {
  const map = useMap();
  map.setView([lat, lon], 13); // Actualiza el centro del mapa

  return null; // Este componente no renderiza nada
};

export const MapView: React.FC<MapViewProps> = ({ location }) => {
  const [coordinates, setCoordinates] = useState<Coordinates>({ lat: 51.505, lon: -0.09 });

  useEffect(() => {
    if (location) {
      // Function to get latitude and longitude from the address
      const getCoordinatesFromAddress = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
          );
          const data = await response.json();
          if (data.length > 0) {
            const { lat, lon } = data[0];
            setCoordinates({ lat: parseFloat(lat), lon: parseFloat(lon) });
          } else {
            console.error('No results found');
          }
        } catch (error) {
          console.error('Error fetching coordinates:', error);
        }
      };
      getCoordinatesFromAddress();
    }
  }, [location]);

  return (
    <MapContainer
      className="rounded-2xl"
      style={{
        height: '400px',
        width: '100%',
        position: 'relative',
        zIndex: '0',
        borderRadius: '10px',
      }}
      key={`${coordinates.lat}-${coordinates.lon}`} // Force re-render when coordinates change
    >
      <SetCenter lat={coordinates.lat} lon={coordinates.lon} /> {/* Actualiza el centro */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={{ lat: coordinates.lat, lng: coordinates.lon }}>
        <Popup>
          {location} <br /> Latitude: {coordinates.lat}, Longitude: {coordinates.lon}
        </Popup>
      </Marker>
    </MapContainer>
  );
};
