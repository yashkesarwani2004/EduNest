import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-bg text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                EN
              </div>
              <span className="text-xl font-bold text-white tracking-tight">EduNest</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Discover and enroll in top nearby coaching institutes. Elevate your learning with the best educators in your city.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all text-slate-400"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all text-slate-400"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all text-slate-400"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all text-slate-400"><Linkedin size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/institutes?category=JEE" className="hover:text-brand-400 transition-colors">JEE Coaching</Link></li>
              <li><Link to="/institutes?category=NEET" className="hover:text-brand-400 transition-colors">NEET Coaching</Link></li>
              <li><Link to="/institutes?category=UPSC" className="hover:text-brand-400 transition-colors">UPSC Preparation</Link></li>
              <li><Link to="/institutes" className="hover:text-brand-400 transition-colors">All Categories</Link></li>
              <li><Link to="/institutes?mode=Online" className="hover:text-brand-400 transition-colors">Online Classes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/signup" className="hover:text-brand-400 transition-colors">List your Institute</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-500 shrink-0 mt-0.5" />
                <span>Education Hub, Prayagraj, Uttar Pradesh, India 211003</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-500 shrink-0" />
                <span>+91 63864 66883</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-500 shrink-0" />
                <span>hello@edunest.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} EduNest. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <span>Made with ❤️ by Manas Tripathi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
