import React, { useState, useEffect } from 'react';
import { MdEdit, MdReceipt, MdDelete, MdWhatsapp, MdShoppingBag } from 'react-icons/md';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import Pagination from './Pagination';
import type { ISale } from '../types';

interface RecordsTableProps {
  sales: ISale[];
  onEdit: (sale: ISale) => void;
  onDelete: (id: string, buyerName: string) => void;
  onShowReceipt: (sale: ISale) => void;
  onCustomerClick: (name: string) => void;
  onNewEntry?: () => void;
}

const RecordsTable: React.FC<RecordsTableProps> = ({
  sales, onEdit, onDelete, onShowReceipt, onCustomerClick, onNewEntry
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [sales]);

  const totalPages = Math.ceil(sales.length / itemsPerPage);
  const currentSales = sales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleWhatsAppShare = (sale: ISale) => {
    const message = `Hello ${sale.buyerName}, thank you for your order at DerinStrands! ✨\n\nOrder ID: #${sale._id.slice(-6).toUpperCase()}\nTotal: ₦${sale.totalPrice.toLocaleString()}\nPayment: ${sale.paymentStatus.toUpperCase()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (sales.length === 0) {
    return (
      <div className="py-24 text-center glass-panel">
        <p className="text-gray-400 font-bold mb-4">No sales records found.</p>
        {onNewEntry && (
          <button onClick={onNewEntry} className="modern-button-primary !bg-brand-pink hover:!bg-brand-black">
            Add First Sale
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentSales.map((sale, index) => (
          <motion.div
            key={sale._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <button
                    onClick={() => onCustomerClick(sale.buyerName)}
                    className="text-lg font-black text-brand-black hover:text-brand-pink transition-colors text-left truncate max-w-[150px] sm:max-w-[180px]"
                  >
                    {sale.buyerName}
                  </button>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                    {new Date(sale.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-brand-pink">₦{sale.totalPrice.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-1">#{sale._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {sale.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2.5 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-2 text-brand-black font-semibold truncate">
                      <MdShoppingBag className="text-gray-400 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <span className="text-brand-pink font-black shrink-0">×{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-5">
                 <StatusBadge status={sale.paymentStatus} />
                 <StatusBadge status={sale.deliveryStatus} />
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button onClick={() => onEdit(sale)} className="flex-1 py-2.5 text-[10px] uppercase tracking-wider font-black text-gray-500 hover:text-brand-black hover:bg-gray-50 rounded-xl transition-colors flex flex-col items-center justify-center gap-1">
                  <MdEdit size={16} /> Edit
                </button>
                <button onClick={() => onShowReceipt(sale)} className="flex-1 py-2.5 text-[10px] uppercase tracking-wider font-black text-gray-500 hover:text-brand-pink hover:bg-pink-50 rounded-xl transition-colors flex flex-col items-center justify-center gap-1">
                  <MdReceipt size={16} /> Receipt
                </button>
                <button onClick={() => handleWhatsAppShare(sale)} className="flex-1 py-2.5 text-[10px] uppercase tracking-wider font-black text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors flex flex-col items-center justify-center gap-1">
                  <MdWhatsapp size={16} /> Share
                </button>
                <button onClick={() => onDelete(sale._id, sale.buyerName)} className="flex-1 py-2.5 text-[10px] uppercase tracking-wider font-black text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex flex-col items-center justify-center gap-1">
                  <MdDelete size={16} /> Trash
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default RecordsTable;
