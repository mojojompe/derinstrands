import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import FilterSection from '../components/FilterSection';
import RecordsTable from '../components/RecordsTable';
import SalesEntryForm from '../components/SalesEntryForm';
import ConfirmModal from '../components/ConfirmModal';
import ReceiptModal from '../components/ReceiptModal';
import CustomerSidebar from '../components/CustomerSidebar';
import { SummarySkeleton, TableSkeleton } from '../components/Skeletons';
import { getSales, createSale, updateSale, deleteSale } from '../services/api';
import type { ISale, ISalePayload } from '../types';
import { toast } from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [allSales, setAllSales] = useState<ISale[]>([]);
  const [filteredSales, setFilteredSales] = useState<ISale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

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

  return (
    <div className="min-h-screen pb-20 animate-fade-in text-brand-black">
      <Header onNewEntry={openNewEntry} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {isLoading ? (
          <SummarySkeleton />
        ) : (
          <SummaryCards sales={allSales} />
        )}
        
        <div className="space-y-6">
          <FilterSection 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />
          {isLoading ? (
            <TableSkeleton />
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
            />
          )}
        </div>
      </main>

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
