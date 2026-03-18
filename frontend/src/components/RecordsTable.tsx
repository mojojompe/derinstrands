import React from 'react';
import { MdEdit, MdReceipt, MdDelete, MdShare } from 'react-icons/md';
import type { ISale } from '../types';

interface RecordsTableProps {
  sales: ISale[];
  onEdit: (sale: ISale) => void;
  onDelete: (id: string, buyerName: string) => void;
  onShowReceipt: (sale: ISale) => void;
  onCustomerClick: (name: string) => void;
}

const RecordsTable: React.FC<RecordsTableProps> = ({ sales, onEdit, onDelete, onShowReceipt, onCustomerClick }) => {

  const handleWhatsAppShare = (sale: ISale) => {
    const message = `Hello ${sale.buyerName}, thank you for your order at DerinStrands!\n\nOrder ID: #${sale._id.slice(-6).toUpperCase()}\nItems: ${sale.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}\nTotal: ₦${sale.totalPrice.toLocaleString()}\nStatus: ${sale.paymentStatus.toUpperCase()}\n\nWe appreciate your business!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const StatusPill = ({ status }: { status: string }) => {
    const successTypes = ['paid', 'delivered'];
    const isSuccess = successTypes.includes(status.toLowerCase());
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
        isSuccess ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
      }`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-50">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Buyer & Items</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {sales.map((sale) => (
              <tr key={sale._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                  {new Date(sale.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onCustomerClick(sale.buyerName)}
                    className="text-sm font-bold text-brand-black hover:text-brand-pink transition-colors text-left"
                  >
                    {sale.buyerName}
                  </button>
                  <div className="text-[10px] font-bold text-gray-400 uppercase group-hover:text-brand-pink/60 transition-colors">
                    {sale.items.map(i => i.name).join(', ')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-black font-black">
                  ₦{sale.totalPrice.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusPill status={sale.paymentStatus} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusPill status={sale.deliveryStatus} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                  <button 
                    onClick={() => onEdit(sale)}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all font-black text-lg" title="Edit"
                  >
                    <MdEdit />
                  </button>
                  <button 
                    onClick={() => onShowReceipt(sale)}
                    className="p-2 rounded-lg text-brand-pink hover:bg-brand-pink/5 transition-all font-black text-lg" title="View & Download Receipt"
                  >
                    <MdReceipt />
                  </button>
                  <button 
                    onClick={() => handleWhatsAppShare(sale)}
                    className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-all font-black text-lg" title="Share Status on WhatsApp"
                  >
                    <MdShare />
                  </button>
                  <button 
                    onClick={() => onDelete(sale._id, sale.buyerName)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all font-black text-lg" title="Delete"
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecordsTable;
