import React, { useEffect } from 'react';
import { Package, IndianRupee, Activity } from 'lucide-react';
import { gsap } from 'gsap';

export default function StatsBar({ mobiles }) {
  const totalStock = mobiles.reduce((acc, curr) => acc + Number(curr.stockQuantity), 0);
  const totalValue = mobiles.reduce((acc, curr) => acc + (Number(curr.price) * Number(curr.stockQuantity)), 0);

  useEffect(() => {
    gsap.from(".stat-card", {
      scale: 0.8,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "back.out(1.7)"
    });
  }, [mobiles.length]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <StatCard icon={<Activity className="text-blue-400"/>} label="Inventory Models" value={mobiles.length} color="blue" />
      <StatCard icon={<Package className="text-indigo-400"/>} label="Total Units" value={totalStock} color="indigo" />
      <StatCard icon={<IndianRupee className="text-emerald-400"/>} label="Total Valuation" value={`₹${totalValue.toLocaleString()}`} color="emerald" />
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`stat-card relative overflow-hidden bg-white/5 border border-white/10 p-6 rounded-3xl group hover:border-${color}-500/50 transition-all cursor-default`}>
      <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}-500/10 rounded-full blur-3xl group-hover:bg-${color}-500/20 transition-all`} />
      <div className="flex items-center gap-5 relative z-10">
        <div className="p-4 bg-slate-800 rounded-2xl shadow-inner border border-white/5">{icon}</div>
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
          <p className="text-3xl font-black text-white tabular-nums tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}