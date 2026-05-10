import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Mail, Clock, Share2, Heart, ShieldCheck, Send } from 'lucide-react';
import useInstituteStore from '../store/instituteStore';
import useAuthStore from '../store/authStore';
import MapComponent from '../components/MapComponent';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const InstituteDetails = () => {
  const { id } = useParams();
  const { institute, fetchInstituteById, isLoading } = useInstituteStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('about');
  
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/reviews?instituteId=${id}`);
      setReviews(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInstituteById(id);
    fetchReviews();
    window.scrollTo(0, 0);
  }, [id, fetchInstituteById]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    if (user.role !== 'user') {
      toast.error('Only students can submit reviews');
      return;
    }

    setSubmittingReview(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/reviews`, { rating, comment, institute: id }, config);
      toast.success('Review submitted successfully!');
      setComment('');
      fetchReviews();
      fetchInstituteById(id); // to update the average rating
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
      setSubmittingReview(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to proceed with payment');
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const loadingToast = toast.loading('Initiating secure payment...');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // We are setting a mock consultation fee of ₹500
      const orderRes = await axios.post(`${API_URL}/payment/orders`, { amount: 500 }, config);
      const order = orderRes.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key', // Needs to be configured in .env
        amount: order.amount,
        currency: order.currency,
        name: institute.name,
        description: "Consultation Booking Fee",
        image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // Demo logo
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(`${API_URL}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              instituteId: institute._id,
              amount: 500
            }, config);
            
            if(verifyRes.data.success) {
              toast.success('Payment Successful! Your consultation is booked.', { duration: 5000 });
            }
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#2563eb", // Tailwind blue-600 to match brand
        },
      };

      toast.dismiss(loadingToast);
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(error);
      toast.error('Could not initiate payment. Server or API Key error.');
    }
  };

  if (isLoading || !institute) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20">
      {/* Header Banner */}
      <div className="h-64 md:h-80 w-full relative">
        <img 
          src={institute.images[0] || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop'} 
          alt={institute.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-white">
              <div className="flex gap-2 mb-3">
                <span className="px-3 py-1 bg-brand-500 rounded-full text-xs font-bold uppercase tracking-wide">
                  {institute.category}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wide">
                  {institute.mode}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{institute.name}</h1>
              <div className="flex items-center gap-4 text-sm md:text-base text-slate-200">
                <span className="flex items-center gap-1.5"><MapPin size={18} className="text-brand-400" /> {institute.address}</span>
                <span className="flex items-center gap-1.5 bg-yellow-500/20 px-2 py-0.5 rounded text-yellow-400 font-bold">
                  <Star size={16} className="fill-yellow-400" /> {institute.totalReviews === 0 ? 0 : institute.averageRating}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all">
                <Share2 size={20} />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all">
                <Heart size={20} />
              </button>
              <button onClick={handlePayment} className="btn-primary shadow-glow hidden md:flex">
                Book Consultation (₹500)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-2xl p-2 flex gap-2 border border-slate-200 shadow-sm sticky top-24 z-30">
              {['about', 'gallery', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-xl capitalize transition-all ${
                    activeTab === tab ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm min-h-[400px]">
              {activeTab === 'about' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">About the Institute</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{institute.description}</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-brand-600 shrink-0">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Timings</h4>
                        <p className="text-sm text-slate-500 mt-0.5">{institute.timings}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600 shrink-0">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Verified</h4>
                        <p className="text-sm text-slate-500 mt-0.5">Documents & Identity Checked</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Location</h3>
                    <div className="h-64 rounded-xl overflow-hidden border border-slate-200">
                       <MapComponent institutes={[institute]} height="100%" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'gallery' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {institute.images.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-200">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer" />
                      </div>
                    ))}
                    {institute.images.length === 0 && (
                      <div className="col-span-full py-12 text-center text-slate-500">No images provided by the institute.</div>
                    )}
                  </div>
                </motion.div>
              )}

               {activeTab === 'reviews' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                     <div className="text-5xl font-bold text-slate-900 mb-2">{institute.totalReviews === 0 ? 0 : institute.averageRating}</div>
                     <div className="flex justify-center text-yellow-400 mb-2">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className={i < Math.round(institute.totalReviews === 0 ? 0 : institute.averageRating) ? "fill-yellow-400" : "text-slate-300"} />
                       ))}
                     </div>
                     <p className="text-slate-500 font-medium">Based on {institute.totalReviews} reviews</p>
                  </div>
                  
                  {/* Write a Review Section */}
                  {user && user.role === 'user' ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
                      <h4 className="font-bold text-slate-900 mb-4">Write a Review</h4>
                      <form onSubmit={handleReviewSubmit}>
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                              >
                                <Star className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 hover:text-yellow-200 transition-colors'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Your Comment</label>
                          <textarea 
                            required
                            rows="3" 
                            className="input-field" 
                            placeholder="Share your experience with this institute..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          ></textarea>
                        </div>
                        <button type="submit" disabled={submittingReview} className="btn-primary flex items-center gap-2">
                          {submittingReview ? 'Submitting...' : <><Send size={16} /> Submit Review</>}
                        </button>
                      </form>
                    </div>
                  ) : !user ? (
                    <div className="bg-brand-50 border border-brand-100 rounded-xl p-6 mb-8 text-center">
                      <p className="text-brand-800 font-medium mb-3">Login as a student to share your experience</p>
                      <button onClick={() => window.location.href = '/login'} className="btn-primary">Login Now</button>
                    </div>
                  ) : null}

                  {/* Reviews List */}
                  <div className="space-y-6">
                     <h4 className="font-bold text-lg text-slate-900 mb-4">Student Experiences</h4>
                     {reviews.length === 0 ? (
                       <p className="text-slate-500 italic">No reviews yet. Be the first to review!</p>
                     ) : (
                       reviews.map(review => (
                         <div key={review._id} className="border border-slate-100 bg-slate-50 rounded-xl p-5">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <img src={review.user?.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-200 bg-white" />
                                <div>
                                  <h4 className="font-bold text-slate-900 text-sm">{review.user?.name || 'Anonymous User'}</h4>
                                  <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                              </div>
                              <div className="flex text-yellow-400 gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400" : "text-slate-300"} />
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed">{review.comment}</p>
                         </div>
                       ))
                     )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-24">
              <div className="text-center pb-6 border-b border-slate-100">
                <p className="text-slate-500 text-sm mb-1">Average Fees</p>
                <div className="text-3xl font-bold text-slate-900">₹{institute.fees.toLocaleString()}</div>
                <p className="text-slate-400 text-xs mt-1">per year approx.</p>
              </div>
              
              <div className="py-6 space-y-4">
                <button onClick={handlePayment} className="w-full btn-primary py-3.5 text-base shadow-glow">Pay Consultation Fee (₹500)</button>
                <button className="w-full btn-secondary py-3.5 text-base">Download Brochure</button>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h4 className="font-semibold text-slate-900">Contact Details</h4>
                {institute.contactPhone && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-brand-600"><Phone size={14} /></div>
                    {institute.contactPhone}
                  </div>
                )}
                {institute.contactEmail && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-brand-600"><Mail size={14} /></div>
                    <a href={`mailto:${institute.contactEmail}`} className="hover:text-brand-600">{institute.contactEmail}</a>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InstituteDetails;
