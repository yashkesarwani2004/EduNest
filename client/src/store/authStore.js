import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  loadUser: () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      set({ user: JSON.parse(userInfo), isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('userInfo', JSON.stringify(res.data.data));
      set({ user: res.data.data, isAuthenticated: true, isLoading: false, error: null });
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Login failed' 
      });
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      localStorage.setItem('userInfo', JSON.stringify(res.data.data));
      set({ user: res.data.data, isAuthenticated: true, isLoading: false, error: null });
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Registration failed' 
      });
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    set({ user: null, isAuthenticated: false });
    toast.success('Logged out successfully!');
  }
}));

export default useAuthStore;
