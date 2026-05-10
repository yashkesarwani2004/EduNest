import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, Bookmark } from 'lucide-react';
import { getDistance } from 'geolib';

const InstituteCard = ({ institute, userLocation }) => {
  let distance = null;
  if (userLocation && institute.location?.coordinates) {
    distance = getDistance(
      { latitude: userLocation[0], longitude: userLocation[1] },
      { latitude: institute.location.coordinates[1], longitude: institute.location.coordinates[0] }
    );
  }

  return (
    <Link to={`/institutes/${institute._id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 relative h-full flex flex-col hover:-translate-y-1">
        {/* Save Button */}
        <button 
          onClick={(e) => { e.preventDefault(); /* handle save */ }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-white z-10 transition-colors shadow-sm"
        >
          <Bookmark size={18} />
        </button>

        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={institute.images[0] || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop'} 
            alt={institute.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-md text-xs font-bold text-slate-800 shadow-sm uppercase tracking-wide">
              {institute.category}
            </span>
            <span className="px-2.5 py-1 bg-brand-500/90 backdrop-blur-md rounded-md text-xs font-bold text-white shadow-sm uppercase tracking-wide">
              {institute.mode}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-brand-600 transition-colors">
              {institute.name}
            </h3>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md text-yellow-700 font-bold text-xs shrink-0 border border-yellow-200">
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
              {institute.totalReviews === 0 ? 0 : institute.averageRating}
            </div>
          </div>

          <div className="flex items-start gap-1.5 text-sm text-slate-500 mb-4 mt-1">
            <MapPin size={16} className="shrink-0 text-slate-400 mt-0.5" />
            <span className="line-clamp-2">{institute.address}</span>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs">Fees starting from</span>
              <span className="font-bold text-slate-900">₹{institute.fees.toLocaleString()}</span>
            </div>
            
            <div className="flex flex-col items-end">
              {distance && (
                <span className="text-brand-600 font-semibold text-sm">
                  {(distance / 1000).toFixed(1)} km away
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default InstituteCard;
