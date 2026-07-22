import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error('Please enter the admin password');
      return;
    }

    setIsLoading(true);
    try {
      const { token } = await loginUser(password);
      login(token);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Split */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-pink z-0" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gray-50 z-0" />

      {/* Decorative Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl z-0"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-40 left-10 w-96 h-96 bg-black/5 rounded-full blur-3xl z-0"
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white p-10 rounded-[2rem] shadow-2xl border border-gray-100">
          
          {/* Logo / Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
              className="w-20 h-20 bg-brand-pink/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FiLock className="w-8 h-8 text-brand-pink" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">DerinStrands</h1>
            <p className="text-gray-500 font-medium">Admin Portal Login</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 focus:border-brand-pink/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,105,180,0.1)] text-gray-800 font-medium placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-pink text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-pink/30 hover:shadow-brand-pink/50 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

        </div>
        
        <p className="text-center text-gray-400 text-sm mt-8 font-medium">
          Securely managed by the backend
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
