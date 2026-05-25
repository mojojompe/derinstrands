import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import SummaryCards from '../components/SummaryCards';
import RecordsTable from '../components/RecordsTable';
import SalesEntryForm from '../components/SalesEntryForm';
import ConfirmModal from '../components/ConfirmModal';
import ReceiptModal from '../components/ReceiptModal';
import CustomerSidebar from '../components/CustomerSidebar';
import FloatingActionButton from '../components/FloatingActionButton';
import { SearchModal, FilterModal } from '../components/SearchFilterModals';
import { getSales, createSale, updateSale, deleteSale } from '../services/api';
import type { ISale, ISalePayload } from '../types';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [allSales, setAllSales] = useState<ISale[]>([]);
  const [filteredSales, setFilteredSales] = useState<ISale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modal States
  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);
  const [activeSaleToEdit, setActiveSaleToEdit] = useState<ISale | undefined>(undefined);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<{ id: string, name: string } | null>(null);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceiptSale, setActiveReceiptSale] = useState<ISale | null>(null);

  const [isCustomerSidebarOpen, setIsCustomerSidebarOpen] = useState(false);
  const [activeCustomerName, setActiveCustomerName] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allSales, searchQuery, statusFilter, dateFilter]);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const data = await getSales();
      setAllSales(data);
    } catch (error: any) {
      console.error("Error fetching sales:", error.response?.data || error.message);
      toast.error("Failed to load sales data");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...allSales];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.buyerName.toLowerCase().includes(q) || 
        s.items.some(i => i.name.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(s => s.paymentStatus.toLowerCase() === statusFilter.toLowerCase());
    }

    if (dateFilter) {
      result = result.filter(s => s.date === dateFilter);
    }

    setFilteredSales(result);
  };

  const handleCreateOrUpdate = async (payload: ISalePayload) => {
    const loadingToast = toast.loading(activeSaleToEdit ? "Updating order..." : "Recording new sale...");
    try {
      let savedSale: ISale;
      if (activeSaleToEdit) {
        savedSale = await updateSale(activeSaleToEdit._id, payload);
        toast.success("Order updated successfully!", { id: loadingToast });
      } else {
        savedSale = await createSale(payload);
        toast.success("New sale recorded!", { id: loadingToast });
      }
      
      await fetchSales();
      setIsEntryFormOpen(false);
      
      // If payment is complete, show receipt immediately
      if (payload.paymentStatus === 'paid') {
        setActiveReceiptSale(savedSale);
        setIsReceiptModalOpen(true);
      }

      setActiveSaleToEdit(undefined);
    } catch (error: any) {
      console.error("Error saving sale:", error.response?.data || error.message);
      toast.error("Failed to save entry", { id: loadingToast });
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setSaleToDelete({ id, name });
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (saleToDelete) {
      const loadingToast = toast.loading("Deleting record...");
      try {
        await deleteSale(saleToDelete.id);
        toast.success("Record deleted", { id: loadingToast });
        setIsConfirmOpen(false);
        await fetchSales();
      } catch (error: any) {
        console.error("Error deleting sale:", error.response?.data || error.message);
        toast.error("Delete failed", { id: loadingToast });
      }
    }
  };

  const openNewEntry = () => {
    setActiveSaleToEdit(undefined);
    setIsEntryFormOpen(true);
  };

  const handleShowReceipt = (sale: ISale) => {
    setActiveReceiptSale(sale);
    setIsReceiptModalOpen(true);
  };

  const handleCustomerClick = (name: string) => {
    setActiveCustomerName(name);
    setIsCustomerSidebarOpen(true);
  };

  const activeFilterCount = (statusFilter !== 'All' ? 1 : 0) + (dateFilter ? 1 : 0);

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Header 
        showSearch={true} 
        showFilter={true} 
        onSearchClick={() => setIsSearchOpen(true)}
        onFilterClick={() => setIsFilterOpen(true)}
        onAddClick={openNewEntry}
        activeFilterCount={activeFilterCount}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-8 animate-fade-in">
        
        <div className="space-y-1 sm:space-y-2 mb-2 px-2 sm:px-0">
           <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">Welcome, Derin! ✨</h2>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Here is your business overview today.</p>
        </div>

        <div className="space-y-8">
          {isLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[120px] skeleton rounded-[2rem]"></div>
              ))}
            </motion.div>
          ) : (
            <SummaryCards sales={allSales} />
          )}
          
          <div className="space-y-6 pt-2">
            
            {/* Display active search/filters inline to remind user why list might be short */}
            {(searchQuery || statusFilter !== 'All' || dateFilter) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Filters:</span>
                {searchQuery && <span className="px-3 py-1 bg-gray-50 text-brand-black text-[10px] font-black uppercase rounded-full border border-gray-100">"{searchQuery}"</span>}
                {statusFilter !== 'All' && <span className="px-3 py-1 bg-gray-50 text-brand-black text-[10px] font-black uppercase rounded-full border border-gray-100">{statusFilter}</span>}
                {dateFilter && <span className="px-3 py-1 bg-gray-50 text-brand-black text-[10px] font-black uppercase rounded-full border border-gray-100">{dateFilter}</span>}
                <button onClick={() => { setSearchQuery(''); setStatusFilter('All'); setDateFilter(''); }} className="text-[10px] font-black text-brand-pink uppercase tracking-widest ml-2 hover:underline">Clear All</button>
              </div>
            )}

            {isLoading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-[300px] skeleton rounded-2xl"></div>
                ))}
              </motion.div>
            ) : (
              <RecordsTable 
                sales={filteredSales} 
                onEdit={(sale) => {
                  setActiveSaleToEdit(sale);
                  setIsEntryFormOpen(true);
                }}
                onDelete={handleDeleteClick}
                onShowReceipt={handleShowReceipt}
                onCustomerClick={handleCustomerClick}
                onNewEntry={openNewEntry}
              />
            )}
          </div>
        </div>
      </main>

      <FloatingActionButton onClick={openNewEntry} />
      <BottomNav />

      {/* Modals */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        placeholder="Search buyers or items..."
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        statusOptions={['All', 'Paid', 'Pending']}
      />

      <SalesEntryForm 
        isOpen={isEntryFormOpen}
        onClose={() => setIsEntryFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={activeSaleToEdit}
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Record"
        message={`Are you sure you want to delete the order for ${saleToDelete?.name}? This action cannot be undone.`}
      />

      <ReceiptModal 
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        sale={activeReceiptSale}
      />

      <CustomerSidebar 
        isOpen={isCustomerSidebarOpen}
        onClose={() => setIsCustomerSidebarOpen(false)}
        buyerName={activeCustomerName}
        sales={allSales}
      />
    </div>
  );
};

export default Dashboard;
