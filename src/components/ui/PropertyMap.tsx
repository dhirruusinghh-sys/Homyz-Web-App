import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';
import { Loader2 } from 'lucide-react';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyMapProps {
  address: string;
  city: string;
  state: string;
  country: string;
  title: string;
}

// Component to dynamically update map center
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
};

export default function PropertyMap({ address, city, state, country, title }: PropertyMapProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        setLoading(true);
        setError(false);
        const provider = new OpenStreetMapProvider();
        
        // Construct a full address string for better geocoding results
        const fullAddress = `${address}, ${city}, ${state}, ${country}`;
        
        const results = await provider.search({ query: fullAddress });
        
        if (results && results.length > 0) {
          // Leaflet expects [lat, lng], geosearch returns x (lng), y (lat)
          setCoordinates([results[0].y, results[0].x]);
        } else {
          // Fallback to city search if specific address fails
          const cityResults = await provider.search({ query: `${city}, ${state}, ${country}` });
          if (cityResults && cityResults.length > 0) {
            setCoordinates([cityResults[0].y, cityResults[0].x]);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error('Geocoding error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (address && city && country) {
      fetchCoordinates();
    } else {
      setLoading(false);
      setError(true);
    }
  }, [address, city, state, country]);

  if (loading) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-2xl flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
        <p className="text-gray-500 font-medium text-sm">Loading map...</p>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="w-full h-[400px] bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Map Unavailable</h3>
        <p className="text-sm text-gray-500">
          We couldn't accurately locate this property's address on the map.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden relative z-0 border border-gray-200 shadow-sm">
      <MapContainer 
        center={coordinates} 
        zoom={14} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>
            <div className="text-center p-1">
              <strong className="block text-primary mb-1">{title}</strong>
              <span className="text-gray-600 text-sm">{address}, {city}</span>
            </div>
          </Popup>
        </Marker>
        <MapUpdater center={coordinates} />
      </MapContainer>
    </div>
  );
}
