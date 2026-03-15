import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { utils, writeFile } from 'xlsx';
import { MdFileDownload, MdAnalytics, MdPieChart } from 'react-icons/md';
import Header from '../components/Header';
import { ChartSkeleton } from '../components/Skeletons';
import { getSales } from '../services/api';
import type { ISale } from '../types';

const COLORS = ['#FF1493', '#1A1A1A', '#FF69B4', '#4B5563', '#9CA3AF'];

const ReportsTab: React.FC = () => {
  const [sales, setSales] = useState<ISale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Simulate delay for skeleton
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await getSales();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales for reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Real data calculations
  const revenueByDate = sales.reduce((acc: any, sale) => {
    const date = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + sale.totalPrice;
    return acc;
  }, {});

  const chartData = Object.keys(revenueByDate).map(date => ({
    name: date,
    revenue: revenueByDate[date]
  })).slice(-7); // Last 7 unique dates

  const statusDistribution = [
    { name: 'Paid', value: sales.filter(s => s.paymentStatus === 'paid').length },
    { name: 'Pending', value: sales.filter(s => s.paymentStatus === 'pending').length },
  ];

  const handleExportExcel = () => {
    const exportData = sales.map(sale => ({
      'Date': new Date(sale.date).toLocaleDateString(),
      'Buyer Name': sale.buyerName,
      'Number of Items': sale.items.length,
      'Total Amount': sale.totalPrice,
      'Payment Status': sale.paymentStatus,
      'Delivery Status': sale.deliveryStatus
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sales Records");
    writeFile(wb, `DS_Full_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-white pb-20 animate-fade-in">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        <div className="flex justify-between items-end">
          <div>
             <h1 className="text-4xl font-black text-brand-black tracking-tighter italic">BUSINESS <span className="text-brand-pink">INTEL</span></h1>
             <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Data driven insights for Derin Strands</p>
          </div>
          <button 
            onClick={handleExportExcel}
            className="modern-button-primary flex items-center space-x-2 !bg-brand-pink"
          >
            <MdFileDownload className="text-xl" />
            <span>Export Full Ledger (Excel)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 rounded-2xl bg-brand-pink/10 text-brand-pink">
                <MdAnalytics className="text-xl" />
              </div>
              <h2 className="text-lg font-black text-brand-black tracking-tight">Revenue Timeline</h2>
            </div>
            
            <div className="h-[350px]">
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '16px', color: '#fff' }}
                      itemStyle={{ color: '#FF1493' }}
                      cursor={{ fill: '#F9FAFB' }}
                    />
                    <Bar dataKey="revenue" fill="#FF1493" radius={[8, 8, 8, 8]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Payment Status Pie */}
          <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center space-x-3 mb-8">
              <div className="p-3 rounded-2xl bg-black/5 text-brand-black">
                <MdPieChart className="text-xl" />
              </div>
              <h2 className="text-lg font-black text-brand-black tracking-tight">Payment Health</h2>
            </div>
            
            <div className="h-[250px] w-full">
               {isLoading ? (
                 <div className="w-full h-full skeleton-circle mx-auto !w-[200px] !h-[200px]" />
               ) : (
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
               )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
               {statusDistribution.map((item) => (
                 <div key={item.name} className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase">{item.name}</p>
                    <p className="text-xl font-black text-brand-black">{item.value}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportsTab;
