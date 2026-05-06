import React, { useState } from 'react';
import api from '../api/axios';
import { X, Database } from 'lucide-react';

export default function AddModal({ isOpen, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    brand: '', modelName: '', storageCapacity: '', price: '', stockQuantity: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/mobiles', formData);
      onRefresh(); 
      onClose();
      setFormData({ brand: '', modelName: '', storageCapacity: '', price: '', stockQuantity: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="apple-glass p-10 rounded-[3rem] w-full max-w-lg border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black text-white tracking-tighter">Inventory Console</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Brand" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-blue-500" 
            value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
          <input type="text" placeholder="Model Name" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-blue-500" 
            value={formData.modelName} onChange={(e) => setFormData({ ...formData, modelName: e.target.value })} required />
          <input type="text" placeholder="Storage" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-blue-500" 
            value={formData.storageCapacity} onChange={(e) => setFormData({ ...formData, storageCapacity: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Price" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-blue-500" 
              value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
            <input type="number" placeholder="Stock" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-blue-500" 
              value={formData.stockQuantity} onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })} required />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all"><Database size={20} /> Commit to Vault</button>
        </form>
      </div>
    </div>
  );
}