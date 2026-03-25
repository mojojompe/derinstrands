import React, { useState, useEffect, useRef } from 'react';
import { MdClose, MdAdd, MdDelete } from 'react-icons/md';
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

  // Fetch inventory on open
  useEffect(() => {
    if (isOpen) {
      getProducts().then(setProducts).catch(() => {});
    }
  }, [isOpen]);

  // Close dropdown on outside click
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
    toast.success('Item added', { duration: 1000, position: 'top-right' });
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
    setSearchTerms(prev => {
      const next = [...prev];
      next[index] = product.name;
      return next;
    });
    setDropdownOpenIndex(null);
  };

  const getFilteredProducts = (search: string) => {
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const allPaid = items.every(item => item.paymentStatus === 'paid');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate against inventory
    for (const item of items) {
      if (!item.name || item.price <= 0) {
        toast.error('Please fill all item fields correctly.');
        return;
      }
      const inventoryItem = products.find(p => p.name === item.name);
      if (inventoryItem && inventoryItem.quantity === 0) {
        toast.error(`"${item.name}" is out of stock.`);
        return;
      }
      if (inventoryItem && item.quantity > inventoryItem.quantity) {
        toast.error(`Only ${inventoryItem.quantity} unit(s) of "${item.name}" available.`);
        return;
      }
    }

    if (!buyerName) {
      toast.error('Please enter a buyer name.');
      return;
    }

    const payload: ISalePayload = {
      buyerName, date, items,
      paymentStatus: allPaid ? 'paid' : 'pending',
      deliveryStatus,
    };
    onSubmit(payload);
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 custom-scrollbar"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-brand-black tracking-tighter italic uppercase">
                {initialData ? 'Edit Order' : 'New Sales Record'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MdClose className="text-2xl text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Buyer Name</label>
                  <input type="text" required value={buyerName} onChange={e => setBuyerName(e.target.value)}
                    className="modern-input" placeholder="Enter customer name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Order Date</label>
                  <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="modern-input" />
                </div>
              </div>

              {/* Items */}
              <div className="p-6 bg-gray-50 rounded-[2.5rem] space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-brand-black uppercase tracking-widest">Order Items</h3>
                  <button type="button" onClick={handleAddItem}
                    className="flex items-center space-x-1 text-xs font-black text-brand-pink hover:bg-white px-4 py-2 rounded-xl transition-all shadow-sm border border-transparent hover:border-brand-pink/20">
                    <MdAdd size={18} /> <span>ADD ITEM</span>
                  </button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar" ref={dropdownRef}>
                  <AnimatePresence mode="popLayout">
                    {items.map((item, index) => {
                      const filtered = getFilteredProducts(searchTerms[index] || '');
                      const selectedProduct = products.find(p => p.name === item.name);
                      const stockRemaining = selectedProduct?.quantity ?? null;

                      return (
                        <motion.div key={index} layout
                          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50, scale: 0.9 }}
                          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative group"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-12 flex justify-between items-center">
                              <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Line Item #{index + 1}</span>
                              {stockRemaining !== null && (
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                  stockRemaining === 0 ? 'bg-red-100 text-red-500' :
                                  stockRemaining <= 5 ? 'bg-orange-100 text-orange-500' :
                                  'bg-green-100 text-green-600'
                                }`}>
                                  {stockRemaining === 0 ? 'OUT OF STOCK' : `${stockRemaining} in stock`}
                                </span>
                              )}
                              {items.length > 1 && (
                                <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-600 p-1">
                                  <MdDelete size={18} />
                                </button>
                              )}
                            </div>

                            {/* Product autocomplete */}
                            <div className="md:col-span-4 relative">
                              <input
                                type="text"
                                value={searchTerms[index] || ''}
                                onChange={e => {
                                  const val = e.target.value;
                                  setSearchTerms(prev => { const n = [...prev]; n[index] = val; return n; });
                                  updateItem(index, 'name', val);
                                  setDropdownOpenIndex(index);
                                }}
                                onFocus={() => setDropdownOpenIndex(index)}
                                className="modern-input !py-2 !text-xs"
                                placeholder="Product name..."
                              />
                              {dropdownOpenIndex === index && filtered.length > 0 && (
                                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                                  {filtered.map(p => (
                                    <button
                                      key={p._id}
                                      type="button"
                                      disabled={p.quantity === 0}
                                      onClick={() => selectProduct(index, p)}
                                      className={`w-full text-left px-4 py-3 flex justify-between items-center text-xs transition-colors ${
                                        p.quantity === 0
                                          ? 'opacity-40 cursor-not-allowed bg-gray-50'
                                          : 'hover:bg-brand-pink/5 cursor-pointer'
                                      }`}
                                    >
                                      <span className="font-bold text-brand-black">{p.name}</span>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-gray-400">₦{p.price.toLocaleString()}</span>
                                        <span className={`font-black ${p.quantity === 0 ? 'text-red-400' : p.quantity <= 5 ? 'text-orange-400' : 'text-green-500'}`}>
                                          {p.quantity === 0 ? 'OUT' : `×${p.quantity}`}
                                        </span>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="md:col-span-3">
                              <input type="number" min="0" required value={item.price || ''}
                                onChange={e => updateItem(index, 'price', Number(e.target.value))}
                                className="modern-input !py-2 !text-xs" placeholder="Price (₦)" />
                            </div>
                            <div className="md:col-span-2">
                              <input type="number" min="1" required value={item.quantity || ''}
                                onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                                className="modern-input !py-2 !text-xs" placeholder="Qty" />
                            </div>
                            <div className="md:col-span-3">
                              <select value={item.paymentStatus}
                                onChange={e => updateItem(index, 'paymentStatus', e.target.value)}
                                className="modern-input !py-2 !text-xs">
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Delivery Status</label>
                  <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    <button type="button" onClick={() => setDeliveryStatus('pending')}
                      className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${deliveryStatus === 'pending' ? 'bg-white shadow-sm text-brand-black' : 'text-gray-400'}`}>
                      PENDING
                    </button>
                    <button type="button" onClick={() => setDeliveryStatus('delivered')}
                      className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${deliveryStatus === 'delivered' ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' : 'text-gray-400'}`}>
                      DELIVERED
                    </button>
                  </div>
                </div>
                <div className="text-right p-2">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Total Amount</span>
                  <span className="text-3xl font-black text-brand-black italic">₦{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={onClose} className="modern-button-secondary flex-1">CANCEL</button>
                <button type="submit" className="modern-button-primary flex-1 !bg-brand-pink hover:!bg-brand-black">
                  {initialData ? 'UPDATE ORDER' : 'SAVE RECORD'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SalesEntryForm;
