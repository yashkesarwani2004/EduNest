import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('role') === 'institute') {
      setRole('institute');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register({ name, email, password, role });
    if (success) {
      if(role === 'institute') navigate('/dashboard');
      else navigate('/');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-64 bg-slate-900 -skew-y-3 origin-top-right -z-10" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900">Create an account</h2>
            <p className="mt-2 text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500">
                Sign in
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="flex gap-4 p-1 bg-slate-100 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  role === 'user' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <User size={16} /> Student
              </button>
              <button
                type="button"
                onClick={() => setRole('institute')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  role === 'institute' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Building size={16} /> Institute
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  className="pl-10 input-field"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
                  minLength="6"
                  className="pl-10 input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 transition-all"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : `Create ${role === 'institute' ? 'Institute' : ''} Account`}
            </button>
          </form>
          
          {role === 'institute' && (
            <div className="mt-4 text-xs text-center text-slate-500 bg-brand-50 p-3 rounded-lg border border-brand-100">
              💡 As an institute, you'll be able to manage your listings, view analytics, and connect with students.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
