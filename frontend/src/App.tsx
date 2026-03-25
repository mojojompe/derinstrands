import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReportsTab from './pages/ReportsTab';
import InventoryTab from './pages/InventoryTab';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster position="bottom-center" reverseOrder={false} />
      {/* Simplified background for clean modern look */}
      <div className="relative min-h-screen bg-white text-brand-black selection:bg-brand-pink/20 selection:text-brand-pink">
        {/* Subtle accent backgrounds */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-pink/5 rounded-full blur-[120px] -z-10"></div>
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-brand-pink/3 rounded-full blur-[100px] -z-10"></div>

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<InventoryTab />} />
          <Route path="/reports" element={<ReportsTab />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
