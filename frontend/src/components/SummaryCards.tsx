import React from 'react';
import type { ISale } from '../types';

interface SummaryCardsProps {
  sales: ISale[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ sales }) => {
  const totalRevenue = sales.reduce((acc, s) => acc + s.totalPrice, 0);
  const totalOrders = sales.length;
  const pendingDeliveries = sales.filter(s => s.deliveryStatus === 'pending').length;
  const pendingPayments = sales.filter(s => s.paymentStatus === 'pending').length;

  const stats = [
    {
      label: 'Total Revenue',
      value: `₦${totalRevenue.toLocaleString()}`,
      color: 'text-brand-pink',
      bg: 'bg-pink-50',
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      color: 'text-brand-black',
      bg: 'bg-gray-50',
    },
    {
      label: 'Pending Deliveries',
      value: pendingDeliveries,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      label: 'Pending Payments',
      value: pendingPayments,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => (
        <div key={item.label} className={`${item.bg} p-6 rounded-[2rem] border border-white shadow-sm transition-transform hover:scale-[1.02] duration-300`}>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
          <p className={`text-3xl font-black mt-2 tracking-tight ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
