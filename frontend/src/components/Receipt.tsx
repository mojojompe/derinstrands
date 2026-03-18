import React from 'react';
import type { ISale } from '../types';
interface ReceiptProps {
  sale: ISale;
}

const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({ sale }, ref) => {
  // Safe hex colors for capture compatibility
  const colors = {
    brandPink: '#FF1493',
    brandBlack: '#1A1A1A',
    grayText: '#6B7280', // approx gray-500
    grayLightText: '#9CA3AF', // approx gray-400
    grayBg: '#F3F4F6', // approx gray-100
    grayBorder: '#E5E7EB', // approx gray-200
    white: '#FFFFFF'
  };

  return (
    <div 
      ref={ref} 
      className="p-10 font-sans mx-auto w-[600px] h-[800px] relative overflow-hidden"
      style={{ 
        boxSizing: 'border-box', 
        minWidth: '600px', 
        minHeight: '800px', 
        backgroundColor: colors.white,
        color: colors.brandBlack,
        border: `1px solid ${colors.grayBorder}`
      }}
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
        <h1 className="text-8xl font-black italic" style={{ color: colors.brandBlack }}>PAID</h1>
      </div>

      <div className="flex justify-between items-start mb-8 pb-6 relative z-10" style={{ borderBottom: `2px solid ${colors.brandPink}` }}>
        <div className="flex items-center space-x-3">
           <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex items-center justify-center" style={{ backgroundColor: colors.white }}>
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-widest" style={{ color: colors.brandBlack, fontStyle: 'italic' ,}}>DerinStrands</h1>
              <p className="text-sm italic" style={{ color: colors.grayText }}>...Good Hair, Good Mood...</p>
            </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold" style={{ color: colors.brandPink }}>RECEIPT</h2>
          <p className="text-sm font-semibold mt-1" style={{ color: colors.grayText }}>Date: {new Date(sale.date).toLocaleDateString()}</p>
          <p className="text-xs" style={{ color: colors.grayLightText }}>Order ID: #{sale._id.slice(-6).toUpperCase()}</p>
        </div>
      </div>

      <div className="mb-8 relative z-10">
        <h3 className="text-sm uppercase tracking-wider font-bold mb-1" style={{ color: colors.grayLightText }}>Billed To</h3>
        <p className="text-lg font-bold" style={{ color: colors.brandBlack }}>{sale.buyerName}</p>
      </div>

      <table className="w-full mb-8 text-left border-collapse relative z-10">
        <thead>
          <tr className="text-sm uppercase tracking-wider" style={{ backgroundColor: '#F9FAFB', color: '#374151' }}>
            <th className="py-3 px-4 font-semibold">Item Description</th>
            <th className="py-3 px-4 font-semibold text-center">Qty</th>
            <th className="py-3 px-4 font-semibold text-right">Price</th>
            <th className="py-3 px-4 font-semibold text-right">Amount</th>
          </tr>
        </thead>
        <tbody style={{ color: colors.brandBlack }}>
          {sale.items.map((item, index) => (
             <tr key={index} style={{ borderBottom: `1px solid ${colors.grayBorder}` }}>
               <td className="py-4 px-4 font-medium">{item.name}</td>
               <td className="py-4 px-4 text-center">{item.quantity}</td>
               <td className="py-4 px-4 text-right">₦{item.price.toLocaleString()}</td>
               <td className="py-4 px-4 text-right font-bold">₦{(item.price * item.quantity).toLocaleString()}</td>
             </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end pt-4 relative z-10">
        <div className="w-64">
           <div className="flex justify-between items-center py-2 text-sm" style={{ color: colors.grayText }}>
             <span>Subtotal</span>
             <span>₦{sale.totalPrice.toLocaleString()}</span>
           </div>
           <div className="flex justify-between items-center py-4 mt-2" style={{ borderTop: `2px solid ${colors.brandPink}` }}>
             <span className="text-lg font-bold uppercase" style={{ color: colors.brandBlack }}>Total Paid</span>
             <span className="text-2xl font-black" style={{ color: colors.brandPink }}>₦{sale.totalPrice.toLocaleString()}</span>
           </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 right-10 text-center text-sm border-t pt-6" style={{ color: colors.grayText, borderTopColor: colors.grayBorder }}>
        <p>Thank you for choosing DerinStrands!</p>
        <p className="text-xs mt-1">For inquiries, contact derinstrands@gmail.com</p>
      </div>

    </div>
  );
});

export default Receipt;
