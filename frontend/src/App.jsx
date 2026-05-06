import Login from "./Login";
import React, { useState, useEffect, useRef } from "react";
import api from "./api/axios";
import { gsap } from "gsap";
import {Smartphone,Plus,Trash2,IndianRupee,ShoppingBag,Box,LogOut,} from "lucide-react";
import AddModal from "./components/AddModal";

// --- Navbar ---
const Navbar = ({ onAddClick, onLogout, onSearch,onHistoryClick }) => (
  <nav className="fixed top-0 w-full z-50 px-6 py-8">
    <div className="max-w-7xl mx-auto apple-glass rounded-[2.5rem] px-10 py-5 flex justify-between items-center border border-white/10 shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/20">
          <Smartphone className="text-white" size={28} />
        </div>
        <span className="text-3xl font-black text-white tracking-tighter uppercase italic">
          Storage<span className="text-blue-500">Vault</span>
        </span>
      </div>
      {/* vault seraching-- */}
      <input
        type="text"
        placeholder="Search mobiles......"
        onChange={(e) => onSearch(e.target.value)}
        className="bg-white/10 text-white px-4 py-2 rounded-xl outline-none placeholder:text-white/40"
      />
       {/*restock button-- */}
      <button
        onClick={onAddClick}
        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl 
        font-bold flex items-center gap-2 active:scale-95 transition-all shadow-xl shadow-blue-600/20" >
        <Plus size={20} />
        <span className="hidden md:inline">Restock Mobile</span>
      </button>
      <button onClick={onHistoryClick} className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-all">
  📊 Sales History
</button>

        {/*logout button-- */}
      <button
        onClick={onLogout}
        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-all shadow-xl shadow-blue-600/20"
      >
        <LogOut size={18} />
        <span className="hidden md:inline">LOGOUT</span>
      </button>
    </div>
  </nav>
);

// --- MobileCard ---
const MobileCard = ({ mobile, onDelete, onPurchase, onUpdate }) => {
  const cardRef = useRef();
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    gsap.to(cardRef.current, {
      rotateY: x * 15,
      rotateX: -y * 15,
      transformPerspective: 1000,
      duration: 0.4,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => gsap.to(cardRef.current, { rotateX: 0, rotateY: 0 })}
      className="apple-glass p-10 rounded-[3rem] relative shadow-2xl border border-white/5 transition-all" >
       <div className="flex justify-between mb-8">
        <Box className="text-blue-400" size={24} />
        <button
          onClick={() => onDelete(mobile._id)}
          className="text-slate-600 hover:text-red-500 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
      <h3 className="text-4xl font-black text-white tracking-tighter mb-1 uppercase leading-none">
        {mobile.modelName}
      </h3>
      <p className="text-slate-500 font-bold text-[10px] tracking-widest uppercase mb-10">
        {mobile.brand}
      </p>
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl mb-8">
        <p className="text-2xl font-black text-white flex items-center">
          <IndianRupee size={18} />
          {mobile.price.toLocaleString()}
        </p>
        <p
          className={`font-bold ${mobile.stockQuantity < 5 ? "text-orange-500" : "text-blue-500"}`}
        >
          {mobile.stockQuantity} Left
        </p>
      </div>

      <button
        disabled={mobile.stockQuantity <= 0}
        onClick={() => onPurchase(mobile)}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white rounded-2xl font-bold flex justify-center gap-2 active:scale-95 transition-all"
      >
        <ShoppingBag size={20} />{" "}
        {mobile.stockQuantity > 0 ? "Buy Unit" : "Sold Out"}
      </button>
      <button
        onClick={() => onUpdate(mobile._id)}
        className="w-full py-4 mt-3 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold flex justify-center gap-2 active:scale-95 transition-all"
      >
        <Box size={20} /> Add Stock{" "}
      </button>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobiles, setMobiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    discount: "",
    gst:"",
    paymentMode:'Cash'
  });
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [uiError, setUiError] = useState("");
  const textContainerRef = useRef();
  const [showHistory, setShowHistory] = useState(false)
  const [receipts, setReceipts] = useState([])

  const fetchReceipts = async () => {
  const { data } = await api.get('/mobiles/receipts')
  setReceipts(data)
}

  const phrases = ["INVENTORY", "SHIPMENTS", "VAULT", "ASSETS"];

  useEffect(() => {
    fetchMobiles();

    // --- GSAP Character Flip (Video Style) ---
    const tl = gsap.timeline({ repeat: -1 });
    phrases.forEach((phrase) => {
      const charsHTML = phrase
        .split("")
        .map(
          (char) => `<span class="anim-char inline-block origin-center">${char === " " ? "&nbsp;" : char}</span>`, ).join("");

      tl.add(() => {
        if (textContainerRef.current)
          textContainerRef.current.innerHTML = charsHTML;
      });

      tl.fromTo(
        ".anim-char",
        { y: 60, rotateX: 90, opacity: 0, scale: 0.5 },
        {
          duration: 1,
          y: 0,
          rotateX: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.05,
          ease: "elastic.out(1.2, 0.5)",
          delay: 0.5,
        },
      );
      tl.to({}, { duration: 2 });
      tl.to(".anim-char", {
        duration: 0.5,
        opacity: 0,
        y: -40,
        rotateX: -90,
        stagger: 0.03,
        ease: "power2.in",
      });
    });

    return () => tl.kill();
  }, []);
     {/* fetch phone fron DB array from */}
  const fetchMobiles = async () => {
    try {
      const { data } = await api.get("/mobiles");
      setMobiles(Array.isArray(data) ? data : data.mobiles || []);
    } catch (err) {
      console.error(err);
      setMobiles([]);
    }
  };
    
  const filteredMobiles = searchQuery
    ? mobiles.filter(
        (m) =>
          (m.modelName &&
            m.modelName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (m.brand &&
            m.brand.toLowerCase().includes(searchQuery.toLowerCase())),) : mobiles;

  const handleConfirmPurchase = async (e) => {
    e.preventDefault();
    setUiError("");
    const cleanPhone = customerInfo.phone.trim();
    if (cleanPhone.length !== 10) return setUiError("Phone must be 10 digits.");

    try {
      const { data } = await api.post(`/mobiles/buy/${checkoutItem._id}`,
        //{ ...customerInfo, customerPhone ,  cleanPhone }
        {
          customerName: customerInfo.name,
          customerPhone: cleanPhone,
          customerAddress: customerInfo.address,
          discount:customerInfo.discount,
          gst:customerInfo.gst,
           paymentMode:customerInfo.paymentMode,
        },
      );
      setActiveReceipt(data.receipt);
      setCheckoutItem(null);
      setCustomerInfo({ name: "", phone: "", address: "",discount:0, gst:0,paymentmode:'Cash' });
      fetchMobiles();
    } catch (err) {
      setUiError(err.response?.data?.message || "Transaction failed");
    }
  };

  return (
    <>
      {!isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <div className="min-h-screen pt-44 pb-20 px-6 overflow-hidden">
          <div className="bg-gradient-mesh fixed inset-0 -z-10" />
          {/*<Navbar onAddClick={() => setIsModalOpen(true)} onLogout={()=>setIsLoggedIn(false)} /> */}
          <Navbar
            onSearch={(query) => setSearchQuery(query)}
            onAddClick={() => setIsModalOpen(true)}
            onLogout={() => setIsLoggedIn(false)}
            onHistoryClick={() => { fetchReceipts(); setShowHistory(true) }}
            />

          <main className="max-w-7xl mx-auto relative z-10 text-center">
            <div style={{ perspective: "1500px" }} className="mb-32">
              <h1 className="text-9xl font-black text-white tracking-tighter leading-none select-none">
                Secure <br />
                <span
                  ref={textContainerRef}
                  className="text-blue-500 inline-block min-w-[500px] origin-center mt-6 uppercase"
                  style={{ textShadow: "0 0 40px rgba(59, 130, 246, 0.4)" }}
                >
                  VAULT
                </span>
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {filteredMobiles.map((m) => (
                <MobileCard
                  key={m._id}
                  mobile={m}
                  onDelete={(id) =>
                    api.delete(`/mobiles/${id}`).then(fetchMobiles)
                  }
                  onPurchase={setCheckoutItem}
                  onUpdate={(id) => {
                    const qty = prompt("Kitni quantity add karni hai?");
                    if (!qty) return;
                    const price = prompt(
                      "Naya price? (same rakhna ho toh Cancel dabao)",
                    );

                    const updateData = { quantity: Number(qty) };
                    if (price) updateData.price = Number(price);

                    api
                      .patch(`/mobiles/${id}/stock`, updateData)
                      .then(fetchMobiles);
                  }}
                />
              ))}
              {filteredMobiles.length === 0 && searchQuery && (
                <div className="text-white text-center col-span-3 mt-10">
                  <p className="text-2xl">📦 Stock is Empty!</p>
                  <p className="text-gray-400">"{searchQuery}" nahi mila</p>
                </div>
              )}
            </div>

            {/* Checkout & Receipt Modals logic stays here... */}
            {checkoutItem && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 text-left pt-34">
  <div className="apple-glass p-6 rounded-[2rem] max-w-md w-full border border-white/10 shadow-2xl">
    <h2 className="text-xl font-black text-white mb-4 tracking-tighter">Retail Dispatch</h2>
    <form onSubmit={handleConfirmPurchase} className="space-y-2">
      {uiError && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl text-center">{uiError}</div>}
      <input type="text" placeholder="Customer Name" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 text-sm" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
      <input type="tel" placeholder="10-Digit Phone" required maxLength="10" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 text-sm" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value.replace(/\D/g, '')})} />
      <textarea placeholder="Address" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none h-16 resize-none focus:border-blue-500 text-sm" value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} />
      <input type="number" placeholder="Discount %" min="0" max="100" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 text-sm" value={customerInfo.discount} onChange={(e) => setCustomerInfo({...customerInfo, discount: e.target.value})} />
      <input type="number" placeholder="GST %" min="0" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 text-sm" value={customerInfo.gst} onChange={(e) => setCustomerInfo({...customerInfo, gst: e.target.value})} />
      <select className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 text-sm" value={customerInfo.paymentMode} onChange={(e) => setCustomerInfo({...customerInfo, paymentMode: e.target.value})}>
        <option value="Cash">💵 Cash</option>
        <option value="Online">📱 Online</option>
        <option value="Card">💳 Card</option>
      </select>
      <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-black active:scale-95 transition-all shadow-xl text-sm">Finalize Sale</button>
      <button type="button" onClick={() => {setCheckoutItem(null); setUiError("");}} className="w-full text-slate-500 font-bold text-sm">Cancel</button>
    </form>
  </div>
</div>
            )}

            {/**active receipt  */}
            {activeReceipt && (
  <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 pt-28">
    <div className="apple-glass p-6 rounded-[2rem] max-w-sm w-full text-center border-white/20 shadow-2xl">
      <div className="text-emerald-500 text-3xl mb-3 italic font-black">PAID ✓</div>
      <div className="bg-white/5 p-4 rounded-2xl mb-4 text-left space-y-1 text-[11px]">
        <div className="flex justify-between"><span className="text-slate-400">INV_ID</span><span className="text-white font-mono">{activeReceipt.receiptId}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Customer</span><span className="text-white">{activeReceipt.customerName}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Phone</span><span className="text-white">{activeReceipt.customerPhone}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Address</span><span className="text-white">{activeReceipt.customerAddress}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Model</span><span className="text-white uppercase">{activeReceipt.modelName}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Price</span><span className="text-white">₹{activeReceipt.pricePaid.toLocaleString()}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Discount</span><span className="text-orange-400">{activeReceipt.discount}%</span></div>
        <div className="flex justify-between"><span className="text-slate-400">GST</span><span className="text-yellow-400">{activeReceipt.gst}%</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Payment</span><span className="text-blue-400">{activeReceipt.paymentMode}</span></div>
        <div className="flex justify-between bg-blue-500/10 p-2 rounded-xl mt-2 border border-blue-500/20 text-blue-400 font-bold text-[10px]">
          <span>Guarantee</span><span>{new Date(activeReceipt.guaranteeUntil).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-lg font-black text-emerald-400 pt-2 border-t border-white/10 mt-1">
          <span>TOTAL</span>
          <span>₹{activeReceipt.totalPaid ? activeReceipt.totalPaid.toLocaleString() : activeReceipt.pricePaid.toLocaleString()}</span>
        </div>
      </div>
      <button onClick={() => window.print()} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-xl mb-2 text-sm">
        🖨️ Print Receipt
      </button>
      <button onClick={() => setActiveReceipt(null)} className="w-full py-3 bg-white text-black rounded-xl font-bold shadow-xl text-sm">Close</button>
    </div>
  </div>
)}
          </main>
          {/**  sale mobiles*/}
          {showHistory && (
  <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
    <div className="apple-glass p-10 rounded-[3rem] max-w-4xl w-full border border-white/10 shadow-2xl overflow-y-auto max-h-[80vh]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-white tracking-tighter">Sales History</h2>
        <button onClick={() => setShowHistory(false)} className="text-slate-500 font-bold">✕ Close</button>
      </div>

      {/* Summary Cards */}
<div className="grid grid-cols-3 gap-4 mb-6">
  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
    <p className="text-emerald-400 text-xs font-mono mb-1">TOTAL SALES</p>
    <p className="text-emerald-400 text-2xl font-black">{receipts.length}</p>
  </div>
  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center">
    <p className="text-blue-400 text-xs font-mono mb-1">REVENUE</p>
      <p className="text-blue-400 text-xl font-black">
      ₹{receipts
    .filter(r => r.status !== 'returned')
    .reduce((sum, r) => sum + (r.totalPaid || r.pricePaid), 0)
    .toLocaleString()}
</p>
    
  </div>
  <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
    <p className="text-orange-400 text-xs font-mono mb-1">TODAY</p>
    <p className="text-orange-400 text-xl font-black">
      ₹{receipts
        .filter(r => new Date(r.purchaseDate).toDateString() === new Date().toDateString()&&
        r.Status !=='returned').reduce((sum,r)=> sum +(r.totalPaid ||r.pricePaid),0).toLocaleString()
        }
    </p>
  </div>
</div>
      
      {receipts.length === 0 ? (
        <p className="text-slate-500 text-center">Koi sale nahi hui abhi tak!</p>
      ) : (
        <table className="w-full text-sm text-white">
          <thead>
            <tr className="text-slate-400 border-b border-white/10">
              <th className="text-left py-3">Receipt ID</th>
              <th className="text-left py-3">Customer</th>
              <th className="text-left py-3">Phone</th>
              <th className="text-left py-3">Model</th>
              <th className="text-left py-3">Amount</th>
              <th className="text-left py-3">Date</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Action</th>

            </tr>
          </thead>
          <tbody>
            {receipts.map(r => (
              <tr key={r._id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 font-mono text-xs text-blue-400">{r.receiptId}</td>
                <td className="py-3">{r.customerName}</td>
                <td className="py-3">{r.customerPhone}</td>
                <td className="py-3 uppercase">{r.modelName}</td>
                <td className="py-3 text-emerald-400 font-bold">₹{r.pricePaid.toLocaleString()}</td>
                <td className="py-3 text-slate-400">{new Date(r.purchaseDate).toLocaleDateString()}</td>
                
                <td className="py-3">
  <span className={`font-bold text-xs ${
    r.status === 'returned' ? 'text-red-400' : 
    r.status === 'exchanged' ? 'text-yellow-400' : 
    'text-emerald-400'
  }`}>
    {r.status?.toUpperCase() || 'SOLD'}
  </span>
</td>
<td className="py-3">
  {r.status === 'sold' || !r.status ? (
    <select 
      className="bg-white/10 text-white text-xs rounded-lg p-1 outline-none"
      onChange={(e) => {
        if(e.target.value) {
          api.patch(`/mobiles/${r._id}/return`, { status: e.target.value })
            .then(() => {fetchReceipts() 
              fetchMobiles()})
        }
      }}
    >
      <option value="">Action</option>
      <option value="returned">Return</option>
      <option value="exchanged">Exchange</option>
    </select>
  ) : (
    <span className="text-slate-500 text-xs">Done</span>
  )}
</td>


              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
)}

          <AddModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onRefresh={fetchMobiles}
          />
        </div>
      )}
    </>
  );
}
