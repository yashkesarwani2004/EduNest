import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-64 bg-brand-600 -skew-y-3 origin-top-left -z-10" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-100"
        >
          <div className="text-center mb-8">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 mx-auto flex items-center justify-center text-white font-bold text-2xl shadow-glow mb-4">
              EN
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-500">
                Sign up for free
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className="pl-10 input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  className="pl-10 input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end mt-2">
                <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 transition-all shadow-glow"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign in'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Secure & Encrypted</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
