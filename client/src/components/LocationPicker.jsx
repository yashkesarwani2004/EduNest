import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationPicker = ({ lat, lng, setCoordinates }) => {
  const [position, setPosition] = useState({ 
    lat: lat ? parseFloat(lat) : 28.6139, 
    lng: lng ? parseFloat(lng) : 77.2090 
  });
  const [isLocating, setIsLocating] = useState(false);
  const markerRef = useRef(null);

  useEffect(() => {
    if (lat && lng) {
      setPosition({ lat: parseFloat(lat), lng: parseFloat(lng) });
    }
  }, [lat, lng]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition(newPos);
          setCoordinates(newPos.lat, newPos.lng);
        }
      },
    }),
    [setCoordinates],
  );

  const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
  };

  const handleAutoDetect = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(newPos);
          setCoordinates(newPos.lat, newPos.lng);
          setIsLocating(false);
          toast.success("Location detected successfully");
        },
        (error) => {
          console.error("Error detecting location", error);
          toast.error("Could not detect location. Please drag the marker manually.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setIsLocating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold text-slate-700">Pinpoint Exact Location</label>
        <button 
          type="button" 
          onClick={handleAutoDetect} 
          disabled={isLocating}
          className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1.5 rounded-lg border border-brand-200 hover:bg-brand-100 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          {isLocating ? (
            <div className="w-3.5 h-3.5 border-2 border-brand-300 border-t-brand-700 rounded-full animate-spin"></div>
          ) : (
            <Navigation size={14} />
          )}
          {isLocating ? 'Detecting...' : 'Auto Detect'}
        </button>
      </div>
      
      <div className="h-[250px] w-full rounded-xl overflow-hidden border border-slate-200 relative z-0">
        <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={[position.lat, position.lng]} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={[position.lat, position.lng]}
            ref={markerRef}
          >
            <Popup minWidth={90}>
              <span className="text-sm font-medium">Drag me to exact location</span>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <p className="text-xs text-slate-500 flex items-center gap-1">
        💡 Drag the blue marker to set your institute's exact location on the map.
      </p>
    </div>
  );
};

export default LocationPicker;
