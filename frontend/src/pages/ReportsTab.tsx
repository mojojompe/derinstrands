import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { getSales, getProducts } from '../services/api';
import type { ISale, IProduct } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const ReportsTab: React.FC = () => {
  const [sales, setSales] = useState<ISale[]>([]);
  const [, setProducts] = useState<IProduct[]>([]);
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | 'ALL'>('30D');

  useEffect(() => {
    getSales().then(setSales).catch(() => {});
    getProducts().then(setProducts).catch(() => {});
  }, []);

  const chartData = useMemo(() => {
    if (!sales.length) return [];
    const grouped = sales.reduce((acc, sale) => {
      const d = sale.date.split('T')[0];
      acc[d] = (acc[d] || 0) + sale.totalPrice;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(grouped).sort().map(d => ({
      date: new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      revenue: grouped[d]
    })).slice(timeRange === '7D' ? -7 : timeRange === '30D' ? -30 : undefined);
  }, [sales, timeRange]);

  const topProducts = useMemo(() => {
    const counts = sales.flatMap(s => s.items).reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, sales: count }));
  }, [sales]);

  const paymentStats = useMemo(() => {
    const paid = sales.filter(s => s.paymentStatus === 'paid').length;
    const pending = sales.filter(s => s.paymentStatus === 'pending').length;
    return [
      { name: 'Paid', value: paid, color: '#10B981' },
      { name: 'Pending', value: pending, color: '#F59E0B' }
    ];
  }, [sales]);

  const deliveryStats = useMemo(() => {
    const delivered = sales.filter(s => s.deliveryStatus === 'delivered').length;
    const pending = sales.filter(s => s.deliveryStatus === 'pending').length;
    return [
      { name: 'Delivered', value: delivered, color: '#10B981' },
      { name: 'Pending', value: pending, color: '#F59E0B' }
    ];
  }, [sales]);

  const stats = {
    revenue: sales.reduce((sum, s) => sum + s.totalPrice, 0),
    orders: sales.length,
    avgOrder: sales.length ? sales.reduce((sum, s) => sum + s.totalPrice, 0) / sales.length : 0,
    uniqueCustomers: new Set(sales.map(s => s.buyerName)).size,
    totalItemsSold: sales.reduce((sum, s) => sum + s.items.reduce((iSum, i) => iSum + i.quantity, 0), 0)
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-2xl shadow-xl border border-gray-100 text-brand-black font-bold text-xs">
          <p>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-8 animate-fade-in">
        
        <div className="flex overflow-x-auto hide-scrollbar pb-2 sm:pb-0 border-b border-gray-100">
          {(['7D', '30D', 'ALL'] as const).map(tr => (
            <button
              key={tr}
              onClick={() => setTimeRange(tr)}
              className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                timeRange === tr 
                  ? 'text-brand-pink border-b-2 border-brand-pink' 
                  : 'text-gray-400 hover:text-brand-black'
              }`}
            >
              {tr === 'ALL' ? 'Lifetime' : `Last ${tr}`}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
             { label: 'Total Revenue', value: `₦${stats.revenue.toLocaleString()}`, color: 'text-brand-pink', bg: 'bg-pink-50' },
             { label: 'Total Orders', value: stats.orders, color: 'text-brand-black', bg: 'bg-gray-50' },
             { label: 'Average Order', value: `₦${Math.round(stats.avgOrder).toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50' },
             { label: 'Items Sold', value: stats.totalItemsSold, color: 'text-purple-600', bg: 'bg-purple-50' },
             { label: 'Unique Customers', value: stats.uniqueCustomers, color: 'text-blue-600', bg: 'bg-blue-50' }
          ].map(s => (
             <div key={s.label} className={`${s.bg} p-5 rounded-[2rem] border border-white shadow-sm flex flex-col justify-center`}>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                <p className={`text-xl sm:text-2xl font-black mt-2 tracking-tight ${s.color}`}>{s.value}</p>
             </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 glass-panel p-6 sm:p-8">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Revenue Overview</h3>
            <div className="h-[250px] sm:h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF1493" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#FF1493" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} tickFormatter={(val) => `₦${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}`} dx={-10} width={40} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                      itemStyle={{ color: '#1A1A1A', fontWeight: 'bold' }}
                      formatter={(val: any) => [`₦${Number(val).toLocaleString()}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#FF1493" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 font-bold">No revenue data available</div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="glass-panel p-6 sm:p-8 flex flex-col">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Top Products by Volume</h3>
            <div className="flex-1 min-h-[250px] sm:min-h-[300px]">
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F3F4F6" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#1A1A1A', fontWeight: 'bold' }} />
                    <Tooltip 
                      cursor={{ fill: '#F9FAFB' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                      formatter={(val: any) => [`${val} units`, 'Sales']}
                    />
                    <Bar dataKey="sales" fill="#1A1A1A" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 font-bold">No product data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Breakdown Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 sm:p-8">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payment Status Breakdown</h3>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {paymentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-brand-black">{sales.length}</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Total</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {paymentStats.map(s => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Delivery Status Breakdown</h3>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deliveryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {deliveryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-brand-black">{sales.length}</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Total</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {deliveryStats.map(s => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
      <BottomNav />
    </div>
  );
};

export default ReportsTab;
