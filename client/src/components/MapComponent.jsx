import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for institutes
const instituteIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const MapComponent = ({ institutes, userLocation, height = "400px" }) => {
  const defaultCenter = [28.6139, 77.2090]; // New Delhi default
  const center = userLocation || (institutes && institutes.length > 0 && institutes[0].location?.coordinates 
    ? [institutes[0].location.coordinates[1], institutes[0].location.coordinates[0]] 
    : defaultCenter);

  return (
    <div style={{ height, width: '100%', borderRadius: '0.75rem', overflow: 'hidden', zIndex: 0 }}>
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={center} zoom={12} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="font-semibold text-brand-600">You are here</div>
            </Popup>
          </Marker>
        )}

        {/* Institute Markers */}
        {institutes?.map((institute) => {
          if (institute.location && institute.location.coordinates) {
            return (
              <Marker 
                key={institute._id} 
                position={[institute.location.coordinates[1], institute.location.coordinates[0]]}
                icon={instituteIcon}
              >
                <Popup>
                  <div className="min-w-[150px]">
                    <img src={institute.images[0] || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655'} alt={institute.name} className="w-full h-24 object-cover rounded-md mb-2" />
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">{institute.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{institute.category} • ⭐ {institute.averageRating}</p>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
