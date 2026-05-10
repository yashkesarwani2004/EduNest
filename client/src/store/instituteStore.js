import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const useInstituteStore = create((set, get) => ({
  institutes: [],
  institute: null,
  isLoading: false,
  error: null,
  pagination: {},

  fetchInstitutes: async (filters = '') => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_URL}/institutes${filters}`);
      set({ 
        institutes: res.data.data, 
        pagination: res.data.pagination,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch institutes' 
      });
    }
  },

  fetchInstituteById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_URL}/institutes/${id}`);
      set({ institute: res.data.data, isLoading: false, error: null });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch institute details' 
      });
    }
  }
}));

export default useInstituteStore;
