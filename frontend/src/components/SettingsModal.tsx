import React, { useState } from 'react';
import { MdClose, MdVisibility, MdVisibilityOff, MdLockOutline } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { changePassword } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Updating password...');

    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Password updated successfully!', { id: loadingToast });
      handleClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswords(false);
    onClose();
  };

  const inputType = showPasswords ? "text" : "password";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-pink/10 flex items-center justify-center text-brand-pink">
              <MdLockOutline className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-black text-brand-black tracking-tight">Security Settings</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Change admin password</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
                Current Password
              </label>
              <input
                type={inputType}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-pink/30 rounded-xl px-4 py-3 outline-none text-gray-800 font-bold placeholder-gray-300 transition-all"
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
                New Password
              </label>
              <input
                type={inputType}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-pink/30 rounded-xl px-4 py-3 outline-none text-gray-800 font-bold placeholder-gray-300 transition-all"
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
                Confirm New Password
              </label>
              <input
                type={inputType}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-pink/30 rounded-xl px-4 py-3 outline-none text-gray-800 font-bold placeholder-gray-300 transition-all"
                placeholder="Re-enter new password"
              />
            </div>
            
            <div className="flex items-center justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 hover:text-brand-pink transition-colors uppercase tracking-widest"
              >
                {showPasswords ? <MdVisibilityOff className="text-sm" /> : <MdVisibility className="text-sm" />}
                {showPasswords ? "Hide Passwords" : "Show Passwords"}
              </button>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                className="w-full bg-brand-black hover:bg-black text-white rounded-xl py-3.5 font-black text-sm uppercase tracking-widest shadow-lg shadow-gray-900/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  "Update Password"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
