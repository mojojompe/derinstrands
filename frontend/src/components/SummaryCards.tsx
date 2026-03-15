import React from 'react';
import { MdTrendingUp, MdLibraryBooks, MdLocalShipping, MdAttachMoney } from 'react-icons/md';
import type { ISale } from '../types';

interface SummaryCardsProps {
  sales: ISale[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ sales }) => {
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalPrice, 0);
  const totalOrders = sales.length;
  const pendingDeliveries = sales.filter(s => s.deliveryStatus === 'pending').length;
  const pendingPayments = sales.filter(s => s.paymentStatus === 'pending').length;

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₦${(val / 1000).toFixed(1)}k`;
    return `₦${val}`;
  };

  const stats = [
    { name: 'Total Revenue', value: formatCurrency(totalRevenue), icon: MdTrendingUp, color: 'text-brand-pink', bg: 'bg-brand-pink/10' },
    { name: 'Total Orders', value: totalOrders.toString(), icon: MdLibraryBooks, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Pending Deliveries', value: pendingDeliveries.toString(), icon: MdLocalShipping, color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: 'Pending Payments', value: pendingPayments.toString(), icon: MdAttachMoney, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.name}
          className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center space-x-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-brand-pink/20 group"
        >
          <div className={`p-4 rounded-2xl ${item.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
            <item.icon className={`h-8 w-8 ${item.color}`} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.name}</p>
            <p className="mt-1 text-2xl font-black text-brand-black">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
