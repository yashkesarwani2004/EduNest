import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Menu, X, User as UserIcon, LogOut, MapPin, Building } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3 shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-glow">
              EN
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">EduNest</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {user?.role !== 'institute' && (
              <>
                <Link to="/institutes" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Find Institutes</Link>
                <a href="#categories" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Categories</a>
              </>
            )}
            <a href="#about" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">About</a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'institute' && (
                  <Link to="/dashboard" className="text-sm font-semibold text-brand-600 flex items-center gap-1">
                    <Building size={16} /> Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm cursor-pointer group hover:border-brand-300 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                    <UserIcon size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.name.split(' ')[0]}</span>
                  <button onClick={handleLogout} className="ml-2 text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-900 font-semibold hover:text-brand-600 transition-colors">Sign in</Link>
                <Link to="/signup" className="btn-primary">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 hover:text-slate-900 focus:outline-none">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 right-0 glass shadow-lg border-t border-slate-200/50 py-4 px-4 flex flex-col space-y-4"
        >
          {user?.role !== 'institute' && (
            <>
              <Link to="/institutes" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 font-medium px-4 py-2 hover:bg-slate-100 rounded-lg">Find Institutes</Link>
              <Link to="/institutes?category=JEE" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 font-medium px-4 py-2 hover:bg-slate-100 rounded-lg">Categories</Link>
            </>
          )}
          
          <div className="border-t border-slate-200 my-2 pt-4">
            {user ? (
              <div className="flex flex-col space-y-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                    <UserIcon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                {user.role === 'institute' && (
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-brand-600 font-medium flex items-center gap-2 py-2">
                    <Building size={18} /> Institute Dashboard
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-red-500 font-medium flex items-center gap-2 py-2 text-left">
                  <LogOut size={18} /> Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 px-4">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-lg border border-slate-300 font-medium text-slate-700">Sign In</Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-lg bg-brand-600 text-white font-medium">Get Started</Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
