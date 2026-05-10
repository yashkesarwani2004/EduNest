import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, TrendingUp, Users, Eye, MapPin, Building, Upload, X, IndianRupee } from 'lucide-react';
import useAuthStore from '../store/authStore';
import LocationPicker from '../components/LocationPicker';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [institutes, setInstitutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const totalRating = institutes.reduce((acc, inst) => acc + (inst.rating || 0), 0);
  const avgRating = institutes.length > 0 ? (totalRating / institutes.length).toFixed(1) : '0.0';
  const totalIncome = institutes.reduce((acc, inst) => acc + (inst.consultancyIncome || 0), 0);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'JEE',
    fees: '',
    mode: 'Offline',
    address: '',
    timings: '9:00 AM - 6:00 PM',
    contactEmail: user?.email || '',
    contactPhone: '',
    lat: '',
    lng: '',
    images: []
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchMyInstitutes();
  }, []);

  const fetchMyInstitutes = async () => {
    setIsLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Backend actually doesn't have a specific route for "my institutes", but we can query by owner
      // Since our API currently doesn't expose filter by owner publicly, let's just fetch all and filter client side for demo, 
      // OR better: our backend GET /institutes supports query filtering. So:
      const res = await axios.get(`${API_URL}/institutes?owner=${user._id}`);
      setInstitutes(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch your institutes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];
    
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' } };
      const res = await axios.post(`${API_URL}/upload`, formData, config);
      return res.data.data;
    } catch (error) {
      toast.error('Image upload failed');
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let uploadedImageUrls = formData.images;
      if (selectedFiles.length > 0) {
        uploadedImageUrls = await uploadImages();
      }

      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/institutes`, { ...formData, images: uploadedImageUrls }, config);
      
      toast.success('Institute created successfully!');
      setIsModalOpen(false);
      fetchMyInstitutes();
      
      // Reset form
      setFormData({
        name: '', description: '', category: 'JEE', fees: '', mode: 'Offline', 
        address: '', timings: '9:00 AM - 6:00 PM', contactEmail: user?.email || '', 
        contactPhone: '', lat: '', lng: '', images: []
      });
      setSelectedFiles([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create institute');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this institute?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${API_URL}/institutes/${id}`, config);
        toast.success('Institute deleted');
        fetchMyInstitutes();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Institute Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your listings and view analytics.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 shadow-glow"
          >
            <Plus size={18} /> Add New Institute
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"><Building size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Listings</p>
              <p className="text-2xl font-bold text-slate-900">{institutes.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center"><TrendingUp size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Avg. Rating</p>
              <p className="text-2xl font-bold text-slate-900">{avgRating} <span className="text-sm text-slate-400">/ 5</span></p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center"><IndianRupee size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Consultancy Income</p>
              <p className="text-2xl font-bold text-slate-900">₹{totalIncome}</p>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Your Institutes</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="p-4 font-semibold">Institute Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Income</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="4" className="text-center p-8 text-slate-500">Loading...</td></tr>
                ) : institutes.length === 0 ? (
                  <tr><td colSpan="4" className="text-center p-8 text-slate-500">No institutes found. Add one to get started!</td></tr>
                ) : (
                  institutes.map(inst => (
                    <tr key={inst._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={inst.images[0] || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=150'} className="w-12 h-12 rounded-lg object-cover" alt="" />
                          <div>
                            <p className="font-bold text-slate-900">{inst.name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={12}/> {inst.address.substring(0,20)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-brand-50 text-brand-700 rounded-md text-xs font-semibold">{inst.category}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-green-600 flex items-center text-sm"><IndianRupee size={14}/>{inst.consultancyIncome || 0}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-semibold flex items-center gap-1 w-max">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Active
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded-lg"><Edit2 size={16}/></button>
                          <button onClick={() => handleDelete(inst._id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-white border border-slate-200 rounded-lg"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Institute Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-slate-900">Add New Institute</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Institute Name*</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="e.g. Allen Career Institute" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category*</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                    <option value="JEE">JEE</option><option value="NEET">NEET</option><option value="UPSC">UPSC</option>
                    <option value="K-12">K-12</option><option value="Language">Language</option><option value="IT Skills">IT Skills</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description*</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="input-field" placeholder="Describe your institute..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Average Fees (₹)*</label>
                  <input required type="number" name="fees" value={formData.fees} onChange={handleChange} className="input-field" placeholder="e.g. 50000" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Learning Mode*</label>
                  <select name="mode" value={formData.mode} onChange={handleChange} className="input-field">
                    <option value="Offline">Offline</option><option value="Online">Online</option><option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Complete Address*</label>
                  <input required type="text" name="address" value={formData.address} onChange={handleChange} className="input-field" placeholder="Street, City, State, ZIP" />
                </div>
                <div className="md:col-span-2">
                  <LocationPicker 
                    lat={formData.lat} 
                    lng={formData.lng} 
                    setCoordinates={(lat, lng) => setFormData(prev => ({ ...prev, lat, lng }))} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Timings</label>
                  <input type="text" name="timings" value={formData.timings} onChange={handleChange} className="input-field" placeholder="e.g. 9:00 AM - 6:00 PM" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="input-field" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Institute Images (Max 5)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                    <p className="text-sm text-slate-600 mb-1">Drag and drop your images here, or</p>
                    <label className="text-brand-600 font-semibold cursor-pointer hover:text-brand-700">
                      <span>browse files</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    <p className="text-xs text-slate-400 mt-2">Selected: {selectedFiles.length} files</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" disabled={isUploading}>Cancel</button>
                <button type="submit" className="btn-primary shadow-glow" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Create Institute'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
