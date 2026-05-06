import React from 'react';
import { Smartphone, Plus, LogOut } from 'lucide-react';

export default function Navbar({ onAddClick ,onLogout ,onSearch ,onHistoryClick}) {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-8">
      <div className="max-w-7xl mx-auto apple-glass rounded-[2.5rem] px-10 py-5 flex justify-between items-center border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/20">
            <Smartphone className="text-white" size={28} />
          </div>
          {/* UPDATED: Increased Font Size and Weight */}
          <span className="text-5xl font-black text-white tracking-tighter uppercase ">
            Storage<span className="text-blue-500">Vault</span>
          </span>
        </div>

           <input type='text' placeholder='Search mobiles......' onChange={(e)=> onSearch(e.target.value)}
            className='bg-white/10 text-white px-4 py-2 rounded-xl outline-none placeholder:text-white/40' />
        
        <button 
          onClick={onAddClick}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-blue-600/20"
        >
          <Plus size={20} />
          <span className="hidden md:inline">Restock Mobile</span>
        </button>
        <button onClick={onHistoryClick} className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-all">
      📊 Sales History
         </button>
         <button 
          onClick={onLogout}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-blue-600/20"
        >
          <LogOut size={18} />
          <span>LOGOUT</span>
        </button>
      </div>
    </nav>
  );
}