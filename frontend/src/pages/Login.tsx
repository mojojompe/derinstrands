import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
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
    <div className="min-h-screen bg-brand-pink flex flex-col font-sans">
      
      {/* Top Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg mb-4 border-4 border-white/20">
          <img src="/logo.jpg" alt="DerinStrands Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-white text-3xl font-black uppercase text-center leading-tight tracking-wider">
          DERIN<br />STRANDS
        </h1>
      </div>

      {/* Bottom Section (White Card) */}
      <div className="bg-white rounded-t-[2.5rem] w-full px-6 py-10 flex flex-col items-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <h2 className="text-[22px] font-bold text-gray-900 mb-1">Welcome back</h2>
        <p className="text-gray-400 text-sm mb-8 font-medium">Sign in to your account</p>
        
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-2 tracking-widest uppercase">
              Password
            </label>
            <div className="relative flex items-center bg-[#f0f4f8] rounded-2xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-brand-pink/50 transition-all">
              <FiLock className="text-gray-400 mr-3 text-xl shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent w-full outline-none text-gray-800 font-bold tracking-widest placeholder-gray-400"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button" 
              className="text-[13px] font-semibold text-gray-400 hover:text-brand-pink transition-colors"
              onClick={() => toast("Contact the super-admin to reset password.", { icon: '🔒' })}
            >
              Forgot Password?
            </button>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1a1a2e] hover:bg-black text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-gray-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-2"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>

    </div>
  );
};

export default Login;
