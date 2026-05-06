import React, { useRef } from 'react';
import { Trash2, IndianRupee, ShoppingBag, Box } from 'lucide-react';
import { gsap } from 'gsap';

export default function MobileCard({ mobile, onDelete, onPurchase ,onUpdate }) {
  const cardRef = useRef();

  const handleMouseMove = (e) => {
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    gsap.to(cardRef.current, { rotateY: x * 15, rotateX: -y * 15, transformPerspective: 1000, duration: 0.4 });
  };

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={() => gsap.to(cardRef.current, { rotateX: 0, rotateY: 0 })}
      className="apple-glass p-10 rounded-[3rem] relative"
    >
      <div className="flex justify-between mb-8">
        <Box className="text-blue-400" size={24} />
        <button onClick={() => onDelete(mobile._id)} className="text-slate-600 hover:text-red-500"><Trash2 size={20}/></button>
      </div>
      <h3 className="text-4xl font-black text-white tracking-tighter mb-1 uppercase">{mobile.modelName}</h3>
      <p className="text-slate-500 font-bold text-[10px] tracking-widest uppercase mb-10">{mobile.brand}</p>
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl mb-8">
        <p className="text-2xl font-black text-white flex items-center"><IndianRupee size={18}/>{mobile.price.toLocaleString()}</p>
        <p className={`font-bold ${mobile.stockQuantity < 5 ? 'text-orange-500' : 'text-blue-500'}`}>{mobile.stockQuantity} Left</p>
      </div>
      <button 
        disabled={mobile.stockQuantity <= 0} 
        onClick={() => onPurchase(mobile)}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white rounded-2xl font-bold flex justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-600/10"
      >
        <ShoppingBag size={20}/> {mobile.stockQuantity > 0 ? "Buy Unit" : "Sold Out"}
      </button>

      <button 
       onClick={() => onUpdate(mobile._id)}
       className="w-full py-4 mt-3 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold flex justify-center gap-2 active:scale-95 transition-all"
>
     <Box size={20}/> Add Stock
</button>
    </div>
  );
}