import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import FilterSection from '../components/FilterSection';
import RecordsTable from '../components/RecordsTable';
import SalesEntryForm from '../components/SalesEntryForm';
import ConfirmModal from '../components/ConfirmModal';
import ReceiptModal from '../components/ReceiptModal';
import { SummarySkeleton, TableSkeleton } from '../components/Skeletons';
import { getSales, createSale, updateSale, deleteSale } from '../services/api';
import type { ISale, ISalePayload } from '../types';

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
    } catch (error) {
      console.error("Error fetching sales:", error);
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
    try {
      let savedSale: ISale;
      if (activeSaleToEdit) {
        savedSale = await updateSale(activeSaleToEdit._id, payload);
      } else {
        savedSale = await createSale(payload);
      }
      
      await fetchSales();
      setIsEntryFormOpen(false);
      
      // If payment is complete, show receipt immediately
      if (payload.paymentStatus === 'paid') {
        setActiveReceiptSale(savedSale);
        setIsReceiptModalOpen(true);
      }

      setActiveSaleToEdit(undefined);
    } catch (error) {
      console.error("Error saving sale:", error);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setSaleToDelete({ id, name });
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (saleToDelete) {
      try {
        await deleteSale(saleToDelete.id);
        setIsConfirmOpen(false);
        await fetchSales();
      } catch (error) {
        console.error("Error deleting sale:", error);
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

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
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
    </div>
  );
};

export default Dashboard;
