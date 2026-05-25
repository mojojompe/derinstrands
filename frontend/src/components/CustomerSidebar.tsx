import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdShoppingBag } from 'react-icons/md';
import StatusBadge from './StatusBadge';
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
  const avgOrder = customerSales.length > 0 ? totalSpent / customerSales.length : 0;

  const initials = buyerName
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-black/40 backdrop-blur-md z-[250]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-[400px] bg-white shadow-2xl z-[260] flex flex-col border-l border-gray-100"
          >
            {/* Header */}
            <div className="bg-brand-black px-8 pt-8 pb-10 shrink-0">
              <div className="flex items-center justify-between mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Profile</p>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
                >
                  <MdClose className="text-xl" />
                </button>
              </div>

              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-[1.2rem] bg-brand-pink text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-lg">
                  {initials}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white leading-tight truncate max-w-[220px]">
                    {buyerName}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {customerSales.length} order{customerSales.length !== 1 ? 's' : ''} total
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Spent',  value: `₦${totalSpent >= 1000 ? (totalSpent/1000).toFixed(1)+'k' : totalSpent.toLocaleString()}` },
                  { label: 'Orders',       value: customerSales.length },
                  { label: 'Avg Order',    value: `₦${avgOrder >= 1000 ? (avgOrder/1000).toFixed(1)+'k' : Math.round(avgOrder).toLocaleString()}` },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/5 rounded-[1.2rem] p-3 text-center border border-white/10">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-lg font-black text-white mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order History */}
            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-4 custom-scrollbar bg-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Order History</p>

              {customerSales.length === 0 ? (
                <p className="text-sm text-gray-400 font-medium text-center py-10">No orders found.</p>
              ) : (
                customerSales.map((sale) => {
                  return (
                    <motion.div
                      layout key={sale._id}
                      className="p-5 bg-white rounded-[1.5rem] border border-gray-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm font-black text-brand-black">
                            {new Date(sale.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono mt-1">
                            #{sale._id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-black text-brand-pink">₦{sale.totalPrice.toLocaleString()}</p>
                          <div className="mt-2 flex justify-end">
                            <StatusBadge status={sale.paymentStatus} />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                        {sale.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-100"
                          >
                            <MdShoppingBag className="text-gray-400" size={14} />
                            {item.name}
                            <span className="text-brand-pink ml-1">×{item.quantity}</span>
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-100 bg-white shrink-0">
              <button onClick={onClose} className="modern-button-secondary w-full py-4 text-xs tracking-widest uppercase">
                Close Profile
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomerSidebar;
