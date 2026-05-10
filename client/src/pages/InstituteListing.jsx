import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, Map, LayoutGrid, List, Search, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InstituteCard from '../components/InstituteCard';
import MapComponent from '../components/MapComponent';
import useInstituteStore from '../store/instituteStore';

const useQuery = () => new URLSearchParams(useLocation().search);

const InstituteListing = () => {
  const query = useQuery();
  const [viewMode, setViewMode] = useState('grid'); // grid, list, map
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  
  const { institutes, isLoading, fetchInstitutes, pagination } = useInstituteStore();

  const [filters, setFilters] = useState({
    search: query.get('search') || '',
    category: query.get('category') || '',
    mode: query.get('mode') || '',
    maxFees: '',
    rating: ''
  });

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.mode) params.append('mode', filters.mode);
    if (filters.maxFees) params.append('fees[lte]', filters.maxFees);
    if (filters.rating) params.append('averageRating[gte]', filters.rating);
    return params.toString() ? `?${params.toString()}` : '';
  }, [filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInstitutes(buildQueryString());
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filters, fetchInstitutes, buildQueryString]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          console.log("Location access denied.");
        }
      );
    }
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', mode: '', maxFees: '', rating: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Explore Institutes</h1>
            <p className="text-slate-500 mt-1">Showing {institutes?.length || 0} results for your search</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Map size={20} />
              </button>
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm md:hidden"
            >
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div 
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="w-full lg:w-72 flex-shrink-0"
              >
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-28">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                      <Filter size={20} className="text-brand-600" /> Filters
                    </h2>
                    <button onClick={clearFilters} className="text-sm text-brand-600 hover:text-brand-700 font-medium">Clear All</button>
                  </div>

                  <div className="space-y-6">
                    {/* Search */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Search Name</label>
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                        <input 
                          type="text" 
                          name="search"
                          value={filters.search}
                          onChange={handleFilterChange}
                          placeholder="e.g. Allen" 
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                      <select 
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      >
                        <option value="">All Categories</option>
                        <option value="JEE">JEE</option>
                        <option value="NEET">NEET</option>
                        <option value="UPSC">UPSC</option>
                        <option value="K-12">K-12</option>
                        <option value="Language">Language</option>
                        <option value="IT Skills">IT Skills</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Mode */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Learning Mode</label>
                      <div className="flex gap-2">
                        {['Offline', 'Online', 'Hybrid'].map(mode => (
                          <button
                            key={mode}
                            onClick={() => setFilters({ ...filters, mode: filters.mode === mode ? '' : mode })}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                              filters.mode === mode ? 'bg-brand-50 border-brand-500 text-brand-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ratings */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Minimum Rating</label>
                      <input 
                        type="range" 
                        name="rating"
                        min="1" max="5" step="0.5"
                        value={filters.rating || 1}
                        onChange={handleFilterChange}
                        className="w-full accent-brand-600"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                        <span>1 Star</span>
                        <span>{filters.rating || 1}+ Stars</span>
                        <span>5 Stars</span>
                      </div>
                    </div>
                    
                    {/* Fees Max */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Max Fees: {filters.maxFees ? `₹${filters.maxFees}` : 'Any'}</label>
                      <input 
                        type="range" 
                        name="maxFees"
                        min="5000" max="200000" step="5000"
                        value={filters.maxFees || 200000}
                        onChange={handleFilterChange}
                        className="w-full accent-brand-600"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Area */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
              </div>
            ) : institutes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No institutes found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : viewMode === 'map' ? (
              <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm h-[600px]">
                <MapComponent institutes={institutes} userLocation={userLocation} height="100%" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {institutes.map(institute => (
                  <InstituteCard key={institute._id} institute={institute} userLocation={userLocation} />
                ))}
              </div>
            )}
            
            {/* Pagination placeholder */}
            {!isLoading && institutes.length > 0 && pagination?.pages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold bg-white text-slate-500 hover:bg-slate-50">Previous</button>
                <button className="px-4 py-2 border border-brand-600 rounded-lg text-sm font-semibold bg-brand-600 text-white">1</button>
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold bg-white text-slate-700 hover:bg-slate-50">2</button>
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold bg-white text-slate-500 hover:bg-slate-50">Next</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstituteListing;
