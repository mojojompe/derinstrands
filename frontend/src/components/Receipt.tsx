import React from 'react';
import type { ISale } from '../types';

interface ReceiptProps {
  sale: ISale;
}

const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({ sale }, ref) => {
  return (
    <div 
      ref={ref} 
      id="receipt-content-root"
      className="p-10 bg-white text-black font-sans mx-auto w-[600px] h-[800px] relative overflow-hidden border border-gray-100 shadow-none"
      style={{ boxSizing: 'border-box', minWidth: '600px', minHeight: '800px', backgroundColor: '#ffffff' }}
    >
      {/* Background Flier */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img 
          src="/Flier.jpg" 
          alt="Background" 
          className="w-full h-full object-cover" 
          crossOrigin="anonymous"
        />
      </div>

      <div className="absolute top-4 right-4 opacity-5 pointer-events-none">
        <h1 className="text-8xl font-black italic">PAID</h1>
      </div>

      <div className="flex justify-between items-start mb-8 border-b-2 border-brand-pink pb-6 relative z-10">
        <div className="flex items-center space-x-3">
           <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-brand-black tracking-widest">DERIN STRANDS</h1>
              <p className="text-gray-500 text-sm italic">...Good Hair, Good Mood...</p>
            </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-brand-pink">RECEIPT</h2>
          <p className="text-sm font-semibold text-gray-600 mt-1">Date: {new Date(sale.date).toLocaleDateString()}</p>
          <p className="text-xs text-gray-400">Order ID: #{sale._id.slice(-6).toUpperCase()}</p>
        </div>
      </div>

      <div className="mb-8 relative z-10">
        <h3 className="text-sm uppercase tracking-wider text-gray-400 font-bold mb-1">Billed To</h3>
        <p className="text-lg font-bold text-brand-black">{sale.buyerName}</p>
      </div>

      <table className="w-full mb-8 text-left border-collapse relative z-10">
        <thead>
          <tr className="bg-gray-100/80 text-gray-700 text-sm uppercase tracking-wider">
            <th className="py-3 px-4 font-semibold">Item Description</th>
            <th className="py-3 px-4 font-semibold text-center">Qty</th>
            <th className="py-3 px-4 font-semibold text-right">Price</th>
            <th className="py-3 px-4 font-semibold text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sale.items.map((item, index) => (
             <tr key={index}>
               <td className="py-4 px-4 font-medium">{item.name}</td>
               <td className="py-4 px-4 text-center">{item.quantity}</td>
               <td className="py-4 px-4 text-right transform">₦{item.price.toLocaleString()}</td>
               <td className="py-4 px-4 text-right font-bold">₦{(item.price * item.quantity).toLocaleString()}</td>
             </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end pt-4 relative z-10">
        <div className="w-64">
           <div className="flex justify-between items-center py-2 text-sm text-gray-600">
             <span>Subtotal</span>
             <span>₦{sale.totalPrice.toLocaleString()}</span>
           </div>
           <div className="flex justify-between items-center py-4 mt-2 border-t-2 border-brand-pink">
             <span className="text-lg font-bold text-brand-black uppercase">Total Paid</span>
             <span className="text-2xl font-black text-brand-pink">₦{sale.totalPrice.toLocaleString()}</span>
           </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 right-10 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
        <p>Thank you for choosing DerinStrands!</p>
        <p className="text-xs mt-1">For inquiries, contact derinstrands@gmail.com</p>
      </div>

    </div>
  );
});

export default Receipt;
