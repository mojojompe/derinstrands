import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import FloatingActionButton from '../components/FloatingActionButton';
import Pagination from '../components/Pagination';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import type { IProduct, IProductPayload } from '../types';
import { toast } from 'react-hot-toast';
import { MdEdit, MdDelete } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
import { SearchModal } from '../components/SearchFilterModals';

const InventoryTab: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<IProduct>>({});
  
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<IProductPayload>({ name: '', price: 0, quantity: 0, category: '' });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts(products);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredProducts(products.filter(p => p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q))));
    }
  }, [products, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || addForm.price <= 0 || addForm.quantity < 0) return toast.error('Invalid fields');
    const loadingToast = toast.loading('Adding product...');
    try {
      await createProduct(addForm);
      toast.success('Product added!', { id: loadingToast });
      setIsAdding(false);
      setAddForm({ name: '', price: 0, quantity: 0, category: '' });
      fetchProducts();
    } catch (err) {
      toast.error('Failed to add product', { id: loadingToast });
    }
  };

  const handleEditSave = async (id: string) => {
    if (!editForm.name || editForm.price! <= 0 || editForm.quantity! < 0) return toast.error('Invalid fields');
    const loadingToast = toast.loading('Saving changes...');
    try {
      await updateProduct(id, editForm);
      toast.success('Product updated', { id: loadingToast });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to update product', { id: loadingToast });
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setProductToDelete({ id, name });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const loadingToast = toast.loading('Deleting product...');
    try {
      await deleteProduct(productToDelete.id);
      toast.success('Product deleted', { id: loadingToast });
      setDeleteConfirmOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error('Delete failed', { id: loadingToast });
    }
  };

  const totalValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
  const outOfStock = products.filter(p => p.quantity === 0).length;
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 5).length;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Header 
        showSearch={true} 
        onSearchClick={() => setIsSearchOpen(true)}
        onAddClick={() => setIsAdding(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-8 animate-fade-in">
        
        {/* Hide huge headers, prioritize stats */}
        <div className="flex gap-4 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <div className="bg-gray-50 px-6 py-4 rounded-[1.5rem] shrink-0 border border-gray-100 flex-1 min-w-[140px]">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Value</p>
             <p className="text-xl sm:text-2xl font-black text-brand-black mt-1 tracking-tight">₦{totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 px-6 py-4 rounded-[1.5rem] shrink-0 border border-orange-100 min-w-[120px]">
             <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Low Stock</p>
             <p className="text-xl sm:text-2xl font-black text-orange-600 mt-1 tracking-tight">{lowStock} items</p>
          </div>
          <div className="bg-red-50 px-6 py-4 rounded-[1.5rem] shrink-0 border border-red-100 min-w-[120px]">
             <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Out of Stock</p>
             <p className="text-xl sm:text-2xl font-black text-red-600 mt-1 tracking-tight">{outOfStock} items</p>
          </div>
        </div>

        {searchQuery && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Search Result:</span>
            <span className="px-3 py-1 bg-gray-50 text-brand-black text-[10px] font-black uppercase rounded-full border border-gray-100">"{searchQuery}"</span>
            <button onClick={() => setSearchQuery('')} className="text-[10px] font-black text-brand-pink uppercase tracking-widest ml-2 hover:underline">Clear</button>
          </div>
        )}

        {/* Inventory Cards */}
        {isLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 skeleton rounded-[2rem]" />)}
           </div>
        ) : filteredProducts.length === 0 && !isAdding ? (
          <div className="py-24 text-center glass-panel">
            <p className="text-gray-400 font-bold mb-4">No products found.</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-6">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {isAdding && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card p-6 flex flex-col justify-between border-brand-pink border-2"
                  >
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                      <input autoFocus type="text" placeholder="Product Name" required className="modern-input !py-2 !px-3 text-sm" value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} />
                      <input type="text" placeholder="Category" className="modern-input !py-2 !px-3 text-sm" value={addForm.category} onChange={e => setAddForm({...addForm, category: e.target.value})} />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" min="0" placeholder="Price" required className="modern-input !py-2 !px-3 text-sm" value={addForm.price || ''} onChange={e => setAddForm({...addForm, price: Number(e.target.value)})} />
                        <input type="number" min="0" placeholder="Quantity" required className="modern-input !py-2 !px-3 text-sm" value={addForm.quantity || ''} onChange={e => setAddForm({...addForm, quantity: Number(e.target.value)})} />
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                         <button type="submit" className="flex-1 py-2 bg-brand-pink text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-black transition-colors">Save</button>
                         <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-colors">Cancel</button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {currentProducts.map((p) => {
                const isEditing = editingId === p._id;
                const stockStatus = p.quantity === 0 ? 'Out of stock' : p.quantity <= 5 ? 'Low stock' : 'In stock';
                const stockColor = p.quantity === 0 ? 'bg-red-50 text-red-600 border-red-100' : p.quantity <= 5 ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-700 border-green-100';

                if (isEditing) {
                  return (
                    <div key={p._id} className="glass-card p-6 flex flex-col justify-between border-brand-black border-2">
                      <div className="space-y-4">
                        <input type="text" required className="modern-input !py-2 !px-3 text-sm" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                        <input type="text" className="modern-input !py-2 !px-3 text-sm" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="number" min="0" required className="modern-input !py-2 !px-3 text-sm" value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} />
                          <input type="number" min="0" required className="modern-input !py-2 !px-3 text-sm" value={editForm.quantity} onChange={e => setEditForm({...editForm, quantity: Number(e.target.value)})} />
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                           <button onClick={() => handleEditSave(p._id)} className="flex-1 py-2 bg-brand-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-pink transition-colors">Update</button>
                           <button onClick={() => setEditingId(null)} className="flex-1 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-colors">Cancel</button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={p._id} className="glass-card p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-black text-brand-black leading-tight max-w-[180px] truncate">{p.name}</h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{p.category || 'Uncategorized'}</p>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${stockColor}`}>
                          {stockStatus}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-[1.5rem]">
                         <div>
                           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Price</p>
                           <p className="text-xl font-black text-brand-pink mt-1 tracking-tight">₦{p.price.toLocaleString()}</p>
                         </div>
                         <div>
                           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Qty</p>
                           <p className="text-xl font-black text-brand-black mt-1 tracking-tight">{p.quantity}</p>
                         </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <button onClick={() => { setEditingId(p._id); setEditForm(p); }} className="flex-1 py-2.5 text-[10px] uppercase tracking-wider font-black text-gray-500 hover:text-brand-black hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-center gap-1">
                        <MdEdit size={16} /> Edit
                      </button>
                      <button onClick={() => handleDeleteClick(p._id, p.name)} className="flex-1 py-2.5 text-[10px] uppercase tracking-wider font-black text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-1">
                        <MdDelete size={16} /> Trash
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>
        )}
      </main>

      <FloatingActionButton onClick={() => setIsAdding(true)} label="New Product" />
      <BottomNav />

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        placeholder="Search inventory..."
      />

      <ConfirmModal 
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"?`}
      />
    </div>
  );
};

export default InventoryTab;
