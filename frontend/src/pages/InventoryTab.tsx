import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAdd, MdEdit, MdDelete, MdInventory2, MdClose, MdWarning } from 'react-icons/md';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import type { IProduct, IProductPayload } from '../types';
import { toast } from 'react-hot-toast';

const emptyForm: IProductPayload = { name: '', price: 0, quantity: 0 };

const InventoryTab: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [form, setForm] = useState<IProductPayload>(emptyForm);
  const [restockId, setRestockId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState(0);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const openAdd = () => { setEditingProduct(null); setForm(emptyForm); setIsFormOpen(true); };
  const openEdit = (p: IProduct) => { setEditingProduct(p); setForm({ name: p.name, price: p.price, quantity: p.quantity }); setIsFormOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.price < 0 || form.quantity < 0) {
      toast.error('Please fill all fields correctly');
      return;
    }
    const id = toast.loading(editingProduct ? 'Updating product...' : 'Adding product...');
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, form);
        toast.success('Product updated!', { id });
      } else {
        await createProduct(form);
        toast.success('Product added to inventory!', { id });
      }
      setIsFormOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving product', { id });
    }
  };

  const handleDelete = async (p: IProduct) => {
    if (!confirm(`Delete "${p.name}" from inventory?`)) return;
    const id = toast.loading('Deleting...');
    try {
      await deleteProduct(p._id);
      toast.success('Product deleted', { id });
      fetchProducts();
    } catch {
      toast.error('Delete failed', { id });
    }
  };

  const handleRestock = async (p: IProduct) => {
    if (restockQty <= 0) { toast.error('Enter a quantity greater than 0'); return; }
    const id = toast.loading('Restocking...');
    try {
      await updateProduct(p._id, { quantity: p.quantity + restockQty });
      toast.success(`Added ${restockQty} units to ${p.name}`, { id });
      setRestockId(null);
      setRestockQty(0);
      fetchProducts();
    } catch {
      toast.error('Restock failed', { id });
    }
  };

  const totalItems = products.length;
  const outOfStock = products.filter(p => p.quantity === 0).length;
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 5).length;

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-brand-black tracking-tighter italic uppercase">Inventory</h1>
            <p className="text-sm text-gray-400 font-medium mt-1">Manage your product stock levels</p>
          </div>
          <button onClick={openAdd} className="modern-button-primary flex items-center space-x-2 self-start">
            <MdAdd size={20} /> <span>Add Product</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Products', value: totalItems, color: 'text-brand-black', bg: 'bg-gray-50' },
            { label: 'Low Stock (≤5)', value: lowStock, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Out of Stock', value: outOfStock, color: 'text-red-500', bg: 'bg-red-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} p-5 rounded-[2rem] border border-gray-100`}>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
              <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Products Table */}
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-gray-50/50">
                <tr>
                  {['Product Name', 'Default Price (₦)', 'Qty in Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-24" /></td>
                      ))}
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <MdInventory2 size={48} className="text-gray-200 mx-auto mb-3" />
                      <p className="text-sm font-bold text-gray-400">No products yet. Add your first product!</p>
                    </td>
                  </tr>
                ) : (
                  products.map(p => (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-brand-black text-sm">{p.name}</td>
                      <td className="px-6 py-4 text-sm font-black text-brand-black">₦{p.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {restockId === p._id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number" min="1" value={restockQty}
                              onChange={e => setRestockQty(Number(e.target.value))}
                              className="modern-input !py-1 !text-xs w-20"
                              placeholder="Qty"
                              autoFocus
                            />
                            <button onClick={() => handleRestock(p)} className="text-[10px] font-black bg-brand-pink text-white px-3 py-1.5 rounded-xl hover:bg-brand-black transition-all">ADD</button>
                            <button onClick={() => setRestockId(null)} className="text-gray-400"><MdClose size={18} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-black text-brand-black">{p.quantity}</span>
                            <button
                              onClick={() => { setRestockId(p._id); setRestockQty(0); }}
                              className="text-[9px] font-black text-brand-pink border border-brand-pink/30 px-2 py-1 rounded-lg hover:bg-brand-pink hover:text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                              + RESTOCK
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {p.quantity === 0 ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-600 uppercase">
                            <MdWarning size={12} /><span>Out of Stock</span>
                          </span>
                        ) : p.quantity <= 5 ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-600 uppercase">
                            <MdWarning size={12} /><span>Low Stock</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-green-100 text-green-700 uppercase">In Stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-all"><MdEdit /></button>
                        <button onClick={() => handleDelete(p)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all"><MdDelete /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-brand-black/40 backdrop-blur-md" onClick={() => setIsFormOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-brand-black italic uppercase tracking-tighter">
                  {editingProduct ? 'Edit Product' : 'New Product'}
                </h2>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MdClose className="text-xl text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Product Name</label>
                  <input
                    required type="text" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="modern-input" placeholder="e.g. Knotless Braids"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Default Price (₦)</label>
                    <input
                      required type="number" min="0" value={form.price || ''}
                      onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                      className="modern-input" placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Quantity in Stock</label>
                    <input
                      required type="number" min="0" value={form.quantity || ''}
                      onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))}
                      className="modern-input" placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="modern-button-secondary flex-1">Cancel</button>
                  <button type="submit" className="modern-button-primary flex-1 !bg-brand-pink hover:!bg-brand-black">
                    {editingProduct ? 'Save Changes' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryTab;
