import React, { useState, useEffect, useRef } from 'react';
import { MdClose, MdAdd, MdDelete, MdShoppingBag } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import type { ISalePayload, IProduct } from '../types';
import { getProducts } from '../services/api';
import { toast } from 'react-hot-toast';

interface SalesEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ISalePayload) => void;
  initialData?: any;
}

interface ItemState {
  name: string;
  price: number;
  quantity: number;
  paymentStatus: 'pending' | 'paid';
}

const defaultItem: ItemState = { name: '', price: 0, quantity: 1, paymentStatus: 'pending' };

const SalesEntryForm: React.FC<SalesEntryFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [buyerName, setBuyerName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<ItemState[]>([defaultItem]);
  const [deliveryStatus, setDeliveryStatus] = useState<'pending' | 'delivered'>('pending');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null);
  const [searchTerms, setSearchTerms] = useState<string[]>(['']);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) getProducts().then(setProducts).catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpenIndex(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (initialData) {
      setBuyerName(initialData.buyerName);
      setDate(new Date(initialData.date).toISOString().split('T')[0]);
      setDeliveryStatus(initialData.deliveryStatus || 'pending');
      const mapped: ItemState[] = initialData.items.map((item: any) => ({
        name: item.name, price: item.price, quantity: item.quantity,
        paymentStatus: item.paymentStatus || 'pending'
      }));
      const loadedItems = mapped.length ? mapped : [{ ...defaultItem }];
      setItems(loadedItems);
      setSearchTerms(loadedItems.map((i: ItemState) => i.name));
    } else {
      setBuyerName('');
      setDate(new Date().toISOString().split('T')[0]);
      setItems([{ ...defaultItem }]);
      setSearchTerms(['']);
      setDeliveryStatus('pending');
    }
  }, [initialData, isOpen]);

  const handleAddItem = () => {
    setItems(prev => [...prev, { ...defaultItem }]);
    setSearchTerms(prev => [...prev, '']);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    setSearchTerms(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const selectProduct = (index: number, product: IProduct) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], name: product.name, price: product.price };
      return next;
    });
    setSearchTerms(prev => { const n = [...prev]; n[index] = product.name; return n; });
    setDropdownOpenIndex(null);
  };

  const getFilteredProducts = (search: string) =>
    products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const allPaid = items.every(item => item.paymentStatus === 'paid');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    for (const item of items) {
      if (!item.name || item.price <= 0) {
        toast.error('Please fill all item fields correctly.');
        return;
      }
      const inv = products.find(p => p.name === item.name);
      if (inv && inv.quantity === 0) { toast.error(`"${item.name}" is out of stock.`); return; }
      if (inv && item.quantity > inv.quantity) {
        toast.error(`Only ${inv.quantity} unit(s) of "${item.name}" available.`); return;
      }
    }
    if (!buyerName) { toast.error('Please enter a buyer name.'); return; }

    onSubmit({ buyerName, date, items, paymentStatus: allPaid ? 'paid' : 'pending', deliveryStatus });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-black/40 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-xl font-black text-brand-black italic uppercase tracking-tighter">
                  {initialData ? 'Edit Order' : 'New Sale'}
                </h2>
                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">
                  {items.length} item{items.length !== 1 ? 's' : ''} · ₦{totalPrice.toLocaleString()} total
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
                <MdClose size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-8 py-6 space-y-8 custom-scrollbar">
              <form id="sales-form" onSubmit={handleSubmit} className="space-y-8">

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Customer Info</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-brand-black uppercase tracking-widest">Customer Name</label>
                      <input type="text" required value={buyerName} onChange={e => setBuyerName(e.target.value)} className="modern-input" placeholder="e.g. Amara Johnson" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-brand-black uppercase tracking-widest">Order Date</label>
                      <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="modern-input" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Items</p>
                    <button type="button" onClick={handleAddItem} className="text-[10px] font-black text-brand-pink hover:text-brand-black transition-colors flex items-center gap-1">
                      <MdAdd size={16} /> ADD ITEM
                    </button>
                  </div>

                  <div className="space-y-4" ref={dropdownRef}>
                    <AnimatePresence mode="popLayout">
                      {items.map((item, index) => {
                        const filtered = getFilteredProducts(searchTerms[index] || '');
                        const selectedProduct = products.find(p => p.name === item.name);
                        const stockRemaining = selectedProduct?.quantity ?? null;

                        return (
                          <motion.div
                            key={index} layout
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-gray-50 rounded-3xl p-5 border border-gray-100 relative"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <MdShoppingBag className="text-gray-400" size={16} />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Item {index + 1}</span>
                                {stockRemaining !== null && (
                                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                                    stockRemaining === 0 ? 'bg-red-100 text-red-600' :
                                    stockRemaining <= 5   ? 'bg-orange-100 text-orange-600' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {stockRemaining === 0 ? 'Out of stock' : `${stockRemaining} in stock`}
                                  </span>
                                )}
                              </div>
                              {items.length > 1 && (
                                <button type="button" onClick={() => handleRemoveItem(index)} className="p-1.5 hover:bg-red-100 text-red-500 rounded-lg transition-colors">
                                  <MdDelete size={16} />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-12 gap-3">
                              <div className="col-span-12 md:col-span-5 relative">
                                <input
                                  type="text" value={searchTerms[index] || ''}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setSearchTerms(prev => { const n = [...prev]; n[index] = val; return n; });
                                    updateItem(index, 'name', val);
                                    setDropdownOpenIndex(index);
                                  }}
                                  onFocus={() => setDropdownOpenIndex(index)}
                                  className="modern-input !py-2.5" placeholder="Product name..."
                                />
                                {dropdownOpenIndex === index && filtered.length > 0 && (
                                  <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                                    {filtered.map(p => (
                                      <button
                                        key={p._id} type="button" disabled={p.quantity === 0}
                                        onClick={() => selectProduct(index, p)}
                                        className={`w-full text-left px-4 py-3 flex justify-between items-center transition-colors ${
                                          p.quantity === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
                                        }`}
                                      >
                                        <span className="font-bold text-brand-black text-sm">{p.name}</span>
                                        <div className="flex items-center gap-3">
                                          <span className="text-gray-400 text-xs font-bold">₦{p.price.toLocaleString()}</span>
                                          <span className={`text-[10px] font-black ${p.quantity === 0 ? 'text-red-500' : p.quantity <= 5 ? 'text-orange-500' : 'text-green-500'}`}>
                                            {p.quantity === 0 ? 'OUT' : `×${p.quantity}`}
                                          </span>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="col-span-6 md:col-span-3">
                                <input
                                  type="number" min="0" required value={item.price || ''}
                                  onChange={e => updateItem(index, 'price', Number(e.target.value))}
                                  className="modern-input !py-2.5" placeholder="Price (₦)"
                                />
                              </div>

                              <div className="col-span-6 md:col-span-2">
                                <div className="flex items-center bg-white border-2 border-transparent rounded-xl focus-within:border-brand-pink/50 overflow-hidden h-[44px]">
                                  <button type="button" onClick={() => updateItem(index, 'quantity', Math.max(1, item.quantity - 1))} className="px-3 text-gray-400 hover:text-brand-black font-black bg-gray-50 h-full">−</button>
                                  <span className="flex-1 text-center text-sm font-black text-brand-black">{item.quantity}</span>
                                  <button type="button" onClick={() => updateItem(index, 'quantity', item.quantity + 1)} className="px-3 text-gray-400 hover:text-brand-black font-black bg-gray-50 h-full">+</button>
                                </div>
                              </div>

                              <div className="col-span-12 md:col-span-2">
                                <div className="flex items-center bg-white p-1 rounded-xl h-[44px] border border-gray-100">
                                  {(['pending', 'paid'] as const).map(s => (
                                    <button
                                      key={s} type="button" onClick={() => updateItem(index, 'paymentStatus', s)}
                                      className={`flex-1 h-full rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                        item.paymentStatus === s ? (s === 'paid' ? 'bg-green-500 text-white' : 'bg-brand-black text-white') : 'text-gray-400 hover:bg-gray-50'
                                      }`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            {item.price > 0 && item.quantity > 0 && (
                              <p className="text-right text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3">
                                Subtotal: <span className="text-brand-pink">₦{(item.price * item.quantity).toLocaleString()}</span>
                              </p>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Delivery Status</p>
                  <div className="flex gap-4">
                    {(['pending', 'delivered'] as const).map(s => (
                      <button
                        key={s} type="button" onClick={() => setDeliveryStatus(s)}
                        className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                          deliveryStatus === s
                            ? (s === 'delivered' ? 'border-green-500 bg-green-50 text-green-600' : 'border-orange-500 bg-orange-50 text-orange-600')
                            : 'border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Total</p>
                  <p className="text-3xl font-black text-brand-black mt-1">₦{totalPrice.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Status</p>
                  <p className={`text-sm font-black uppercase tracking-widest mt-1 ${allPaid ? 'text-green-500' : 'text-orange-500'}`}>
                    {allPaid ? 'Fully Paid' : 'Pending'}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={onClose} className="modern-button-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" form="sales-form" className="modern-button-primary !bg-brand-pink hover:!bg-brand-black flex-1">
                  {initialData ? 'Update Order' : 'Save Record'}
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SalesEntryForm;
