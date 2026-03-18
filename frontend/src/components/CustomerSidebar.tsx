import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdHistory, MdShoppingBag } from 'react-icons/md';
import type { ISale } from '../types';

interface CustomerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  buyerName: string;
  sales: ISale[];
}

const CustomerSidebar: React.FC<CustomerSidebarProps> = ({ isOpen, onClose, buyerName, sales }) => {
  const customerSales = sales
    .filter(s => s.buyerName === buyerName)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalSpent = customerSales.reduce((sum, s) => sum + s.totalPrice, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-[250]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-[260] flex flex-col border-l border-gray-100"
          >
            {/* Header */}
            <div className="p-6 bg-brand-black text-white shrink-0">
               <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                     <MdHistory size={24} className="text-brand-pink" />
                     <h2 className="text-xl font-black uppercase tracking-tight">Customer Profile</h2>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                     <MdClose size={24} />
                  </button>
               </div>
               
               <div className="space-y-1">
                  <p className="text-brand-pink text-xs font-black uppercase tracking-widest">Client Name</p>
                  <h3 className="text-2xl font-black truncate">{buyerName}</h3>
               </div>

               <div className="mt-6 flex space-x-4">
                  <div className="flex-1 bg-white/5 p-4 rounded-3xl border border-white/10">
                     <p className="text-[10px] font-bold text-gray-400 uppercase">Total Spent</p>
                     <p className="text-xl font-black">₦{totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="flex-1 bg-white/5 p-4 rounded-3xl border border-white/10">
                     <p className="text-[10px] font-bold text-gray-400 uppercase">Orders</p>
                     <p className="text-xl font-black">{customerSales.length}</p>
                  </div>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
               <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Order History</h4>
               
               {customerSales.map((sale) => (
                  <motion.div 
                    layout
                    key={sale._id}
                    className="p-5 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-brand-pink/20 transition-all hover:bg-white hover:shadow-lg group"
                  >
                     <div className="flex justify-between items-start mb-3">
                        <div>
                           <p className="text-[10px] font-black text-brand-pink uppercase">{new Date(sale.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                           <p className="text-xs font-bold text-gray-400">ID: #{sale._id.slice(-6).toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-brand-black">₦{sale.totalPrice.toLocaleString()}</p>
                           <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              sale.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                           }`}>
                              {sale.paymentStatus}
                           </span>
                        </div>
                     </div>
                     <div className="space-y-1">
                        {sale.items.map((item, idx) => (
                           <div key={idx} className="flex items-center space-x-2 text-xs text-brand-black font-medium">
                              <MdShoppingBag size={14} className="text-gray-300" />
                              <span>{item.name}</span>
                              <span className="text-gray-400 font-bold">x{item.quantity}</span>
                           </div>
                        ))}
                     </div>
                  </motion.div>
               ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
               <button 
                 onClick={onClose}
                 className="w-full py-4 bg-brand-black text-white font-black rounded-2xl uppercase tracking-widest hover:bg-brand-pink transition-all shadow-lg shadow-black/5 active:scale-[0.98]"
               >
                  Close History
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomerSidebar;
