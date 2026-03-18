import React, { useState, useEffect } from 'react';
import { MdClose, MdAdd, MdDelete } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import type { ISalePayload } from '../types';
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

  useEffect(() => {
    if (initialData) {
      setBuyerName(initialData.buyerName);
      setDate(new Date(initialData.date).toISOString().split('T')[0]);
      setDeliveryStatus(initialData.deliveryStatus || 'pending');
      
      const mappedItems: ItemState[] = initialData.items.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        paymentStatus: item.paymentStatus || 'pending'
      }));
      setItems(mappedItems.length ? mappedItems : [{ ...defaultItem }]);
    } else {
      setBuyerName('');
      setDate(new Date().toISOString().split('T')[0]);
      setItems([{ ...defaultItem }]);
      setDeliveryStatus('pending');
    }
  }, [initialData, isOpen]);

  const handleAddItem = () => {
    setItems([...items, { ...defaultItem }]);
    toast.success('Item added', { duration: 1000, position: 'top-right' });
  };
  
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const allPaid = items.every(item => item.paymentStatus === 'paid');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || items.some(i => !i.name || i.price <= 0)) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    const payload: ISalePayload = {
      buyerName,
      date,
      items,
      paymentStatus: allPaid ? 'paid' : 'pending',
      deliveryStatus: deliveryStatus
    };

    onSubmit(payload);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                  <input
                    type="text" required value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="modern-input" placeholder="Enter customer name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Order Date</label>
                  <input
                    type="date" required value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="modern-input"
                  />
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-[2.5rem] space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-brand-black uppercase tracking-widest">Order Items</h3>
                  <button 
                    type="button" onClick={handleAddItem}
                    className="flex items-center space-x-1 text-xs font-black text-brand-pink hover:bg-white px-4 py-2 rounded-xl transition-all shadow-sm border border-transparent hover:border-brand-pink/20"
                  >
                    <MdAdd size={18} /> <span>ADD ITEM</span>
                  </button>
                </div>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                      <motion.div 
                        key={index}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative group"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="md:col-span-12 flex justify-between">
                             <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Line Item #{index + 1}</span>
                             {items.length > 1 && (
                               <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-600 p-1">
                                 <MdDelete size={18} />
                               </button>
                             )}
                          </div>
                          <div className="md:col-span-4">
                            <input 
                              type="text" required value={item.name}
                              onChange={(e) => updateItem(index, 'name', e.target.value)}
                              className="modern-input !py-2 !text-xs" placeholder="Item name"
                            />
                          </div>
                          <div className="md:col-span-3">
                            <input 
                              type="number" min="0" required value={item.price || ''}
                              onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                              className="modern-input !py-2 !text-xs" placeholder="Price (₦)"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <input 
                              type="number" min="1" required value={item.quantity || ''}
                              onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                              className="modern-input !py-2 !text-xs" placeholder="Qty"
                            />
                          </div>
                          <div className="md:col-span-3">
                            <select 
                              value={item.paymentStatus}
                              onChange={(e) => updateItem(index, 'paymentStatus', e.target.value)}
                              className="modern-input !py-2 !text-xs"
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Delivery Status</label>
                  <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    <button 
                      type="button" 
                      onClick={() => setDeliveryStatus('pending')}
                      className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${deliveryStatus === 'pending' ? 'bg-white shadow-sm text-brand-black' : 'text-gray-400'}`}
                    >
                      PENDING
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setDeliveryStatus('delivered')}
                      className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${deliveryStatus === 'delivered' ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' : 'text-gray-400'}`}
                    >
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
