import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-black/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl animate-fade-in p-8 text-center border border-gray-100">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-red-100 italic font-black text-4xl">
           !
        </div>
        
        <h2 className="text-2xl font-black text-brand-black tracking-tighter mb-2 italic uppercase">
          {title}
        </h2>
        
        <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 px-2">
          {message}
        </p>
        
        <div className="flex space-x-4">
          <button 
            onClick={onClose}
            className="modern-button-secondary flex-1"
          >
            NO, KEEP IT
          </button>
          <button 
            onClick={onConfirm}
            className="modern-button-primary flex-1 !bg-red-500 hover:!bg-brand-black"
          >
            YES, DELETE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
