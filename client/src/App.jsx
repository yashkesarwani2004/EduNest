import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import InstituteListing from './pages/InstituteListing';
import InstituteDetails from './pages/InstituteDetails';
import Dashboard from './pages/Dashboard';

function App() {
  const { user, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/institutes" element={<InstituteListing />} />
          <Route path="/institutes/:id" element={<InstituteDetails />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={user && user.role === 'institute' ? <Dashboard /> : <Navigate to="/login" />} 
          />
        </Routes>
      </main>

      <Footer />
      <Chatbot />
      
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
