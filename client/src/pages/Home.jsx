import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, TrendingUp, ShieldCheck, Clock, Users, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Home = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery || locationQuery) {
      navigate(`/institutes?search=${searchQuery}&location=${locationQuery}`);
    } else {
      navigate('/institutes');
    }
  };

  const categories = [
    { name: 'JEE', icon: '⚛️', color: 'bg-blue-100 text-blue-600' },
    { name: 'NEET', icon: '🧬', color: 'bg-green-100 text-green-600' },
    { name: 'UPSC', icon: '🏛️', color: 'bg-orange-100 text-orange-600' },
    { name: 'K-12', icon: '📚', color: 'bg-purple-100 text-purple-600' },
    { name: 'Language', icon: '🗣️', color: 'bg-pink-100 text-pink-600' },
    { name: 'IT Skills', icon: '💻', color: 'bg-indigo-100 text-indigo-600' },
  ];

  const features = [
    { icon: <MapPin className="text-brand-500" size={24} />, title: 'Find Nearby', desc: 'Discover institutes closest to your location instantly.' },
    { icon: <Star className="text-yellow-500" size={24} />, title: 'Verified Reviews', desc: 'Read authentic reviews from past and current students.' },
    { icon: <ShieldCheck className="text-green-500" size={24} />, title: 'Trusted Institutes', desc: 'All institutes are verified for quality and authenticity.' },
    { icon: <Clock className="text-purple-500" size={24} />, title: 'Flexible Timings', desc: 'Find batches that fit perfectly into your schedule.' },
  ];

  // Institute B2B Home View
  if (user?.role === 'institute') {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-100 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] opacity-60 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-bold tracking-wide mb-6">
              PARTNER PORTAL
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Grow your Education Business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-600">EduNest</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Why stay hidden? Join the fastest-growing education discovery platform. Manage your institute profile, track student leads, and build your digital reputation today.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><TrendingUp size={32}/></div>
               <h3 className="text-2xl font-bold mb-4 text-slate-900">Maximize Reach</h3>
               <p className="text-slate-600">Get discovered by thousands of active students searching for coaching in your city every day.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
               <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Users size={32}/></div>
               <h3 className="text-2xl font-bold mb-4 text-slate-900">Drive Admissions</h3>
               <p className="text-slate-600">Convert profile views into direct student enrollments and walk-ins to your campus.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
               <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Star size={32}/></div>
               <h3 className="text-2xl font-bold mb-4 text-slate-900">Build Trust</h3>
               <p className="text-slate-600">Collect verified reviews, showcase your successful alumni, and stand out from competitors.</p>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <Link to="/dashboard" className="inline-block bg-brand-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-colors shadow-glow">
              Go to your Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Student B2C Home View
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-white" />
          {/* Abstract decorative blobs */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute top-40 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold mb-6 border border-brand-200">
              🚀 #1 Education Discovery Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
              Find the perfect <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-600">
                Coaching Institute
              </span>
            </h1>
            <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Discover top-rated coaching centers nearby. Compare fees, read reviews, and boost your learning journey today.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-2 md:p-3 border border-slate-100 glass">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center relative pl-4 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                  <Search className="text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by institute name, exam (e.g. JEE, NEET)..."
                    className="w-full bg-transparent border-0 py-3.5 px-3 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm font-medium outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1 flex items-center relative pl-4 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                  <MapPin className="text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Enter your location..."
                    className="w-full bg-transparent border-0 py-3.5 px-3 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm font-medium outline-none"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                  <button type="button" className="pr-3 text-brand-600 text-sm font-semibold hover:text-brand-700">Locate Me</button>
                </div>
                <button type="submit" className="bg-brand-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-brand-700 transition-colors shadow-glow whitespace-nowrap">
                  Search Now
                </button>
              </form>
            </div>

            {/* Categories */}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                >
                  <Link
                    to={`/institutes?category=${cat.name}`}
                    className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all group"
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${cat.color}`}>
                      {cat.icon}
                    </span>
                    <span className="font-semibold text-slate-700 group-hover:text-brand-600 transition-colors">{cat.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-dark-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
            <div>
              <div className="text-4xl font-bold text-brand-400 mb-2">5,000+</div>
              <div className="text-slate-400 font-medium text-sm uppercase tracking-wider">Institutes Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">2M+</div>
              <div className="text-slate-400 font-medium text-sm uppercase tracking-wider">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">50+</div>
              <div className="text-slate-400 font-medium text-sm uppercase tracking-wider">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">100k+</div>
              <div className="text-slate-400 font-medium text-sm uppercase tracking-wider">Verified Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why choose EduNest?</h2>
            <p className="text-lg text-slate-600">We make finding the right education partner simple, transparent, and efficient.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-600" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Are you an Institute Owner?</h2>
          <p className="text-brand-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of coaching centers managing their listings, reaching more students, and growing their business with EduNest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup?role=institute" className="bg-white text-brand-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors shadow-lg flex items-center justify-center gap-2">
              Register Institute Free <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
