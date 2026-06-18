import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdDeleteForever } from 'react-icons/md';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-black/40 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-8 text-center border border-gray-100"
          >
            <div className="w-16 h-16 bg-red-50 rounded-2xl mx-auto flex items-center justify-center mb-6">
              <MdDeleteForever className="text-3xl text-red-700" />
            </div>

            <h2 className="text-xl font-black text-brand-black tracking-tighter italic uppercase mb-3">{title}</h2>

            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8">
              {message}
            </p>

            <div className="flex gap-4">
              <button onClick={onClose} className="modern-button-secondary flex-1 py-3 text-sm">
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3 bg-red-700 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all hover:bg-red-800 active:scale-[0.98] shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
