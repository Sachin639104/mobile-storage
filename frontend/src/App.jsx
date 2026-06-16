import Login from "./Login";
import Register from "./Register";
import React, { useState, useEffect, useRef } from "react";
import SecureVaultLanding from "./pages/SecureVaultLanding";
import api from "./api/axios";

export default function App() {
  const [page, setPage] = useState('register')
  const [searchQuery, setSearchQuery] = useState("");
  const [mobiles, setMobiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "", phone: "", address: "", discount: "", gst: "", paymentMode: "Cash"
  });
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [uiError, setUiError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [exchangeModal, setExchangeModal] = useState(null);
  const [exchangeData, setExchangeData] = useState({ newModelName: '', newPrice: 0 });
  const [returnModal, setReturnModal] = useState(null);
  const [historySearch, setHistorySearch] = useState('');
  const role = localStorage.getItem('role');

  useEffect(() => { fetchMobiles(); }, []);

  const fetchMobiles = async () => {
    try {
      const { data } = await api.get("/mobiles");
      setMobiles(Array.isArray(data) ? data : data.mobiles || []);
    } catch (err) { setMobiles([]); }
  };

  const fetchReceipts = async () => {
    const { data } = await api.get('/mobiles/receipts');
    setReceipts(data);
  };

  const filteredMobiles = searchQuery
    ? mobiles.filter(m =>
        m.modelName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.brand?.toLowerCase().includes(searchQuery.toLowerCase()))
    : mobiles;

  const filteredReceipts = receipts.filter(r =>
    r.customerName?.toLowerCase().includes(historySearch.toLowerCase()) ||
    r.customerPhone?.includes(historySearch)
  );

  const handleConfirmPurchase = async (e) => {
    e.preventDefault();
    setUiError("");
    const cleanPhone = customerInfo.phone.trim();
    if (cleanPhone.length !== 10) return setUiError("Phone must be 10 digits.");
    try {
      const { data } = await api.post(`/mobiles/buy/${checkoutItem._id}`, {
        customerName: customerInfo.name,
        customerPhone: cleanPhone,
        customerAddress: customerInfo.address,
        discount: customerInfo.discount,
        gst: customerInfo.gst,
        paymentMode: customerInfo.paymentMode,
      });
      setActiveReceipt(data.receipt);
      setCheckoutItem(null);
      setCustomerInfo({ name: "", phone: "", address: "", discount: 0, gst: 0, paymentMode: 'Cash' });
      fetchMobiles();
    } catch (err) {
      setUiError(err.response?.data?.message || "Transaction failed");
    }
  };

  const handleReturn = async (receipt) => {
    await api.patch(`/mobiles/${receipt._id}/return`, { status: 'returned' });
    setReturnModal(receipt);
    fetchReceipts();
  };

  const handleExchange = async () => {
    const selected = mobiles.find(m => m.modelName === exchangeData.newModelName);
    await api.patch(`/mobiles/${exchangeModal._id}/exchange`, {
      newModelName: exchangeData.newModelName,
      newPrice: selected?.price || exchangeData.newPrice,
      oldPrice: exchangeModal.totalPaid
    });
    setExchangeModal(null);
    fetchReceipts();
  };

  const handlePrint = (receipt, type = 'return') => {
    const selected = mobiles.find(m => m.modelName === exchangeData.newModelName);
    const newPrice = selected?.price || 0;
    const diff = newPrice - (receipt.totalPaid || 0);

    const content = type === 'exchange' ? `
      <h2>Exchange Receipt</h2>
      <p>Customer: ${receipt.customerName}</p>
      <p>Phone: ${receipt.customerPhone}</p>
      <p>Old Model: ${receipt.modelName} — ₹${receipt.totalPaid}</p>
      <p>New Model: ${exchangeData.newModelName} — ₹${newPrice}</p>
      <p><strong>${diff > 0 ? `Customer Pays Extra: ₹${diff}` : `Refund: ₹${Math.abs(diff)}`}</strong></p>
      <p>Date: ${new Date().toLocaleDateString()}</p>
    ` : `
      <h2>Return Receipt</h2>
      <p>Customer: ${receipt.customerName}</p>
      <p>Phone: ${receipt.customerPhone}</p>
      <p>Model: ${receipt.modelName}</p>
      <p>Refund Amount: ₹${receipt.totalPaid}</p>
      <p>Date: ${new Date().toLocaleDateString()}</p>
    `;

    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>${type === 'exchange' ? 'Exchange' : 'Return'} Receipt</title>
          <style>
            body { font-family: Arial; padding: 40px; }
            h2 { border-bottom: 2px solid #333; padding-bottom: 10px; }
            p { margin: 8px 0; font-size: 16px; }
            strong { color: #2563eb; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const priceDiff = exchangeModal
    ? (mobiles.find(m => m.modelName === exchangeData.newModelName)?.price || 0) - (exchangeModal.totalPaid || 0)
    : 0;

  // Register page
  if (page === 'register') {
    return <Register onSwitchToLogin={() => setPage('login')} />;
  }

  // Login page
  if (page === 'login') {
    return (
      <Login
        onLogin={() => setPage('dashboard')}
        onSwitchToRegister={() => setPage('register')}
      />
    );
  }

  // Dashboard
  return (
    <div style={{ background: '#040812', minHeight: '100vh' }}>
      <div className="sv-grid" />
      <div className="sv-orb sv-orb-1" />
      <div className="sv-orb sv-orb-2" />

      {/* ── NAVBAR ── */}
      <nav className="vault-nav navbar fixed-top px-4" style={{zIndex:100}}>
        <div className="container-fluid">
          <span className="vault-brand navbar-brand mb-0">
            📱 Storage<span>Vault</span>
          </span>

          <input
            type="text"
            placeholder="Search mobiles..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="vault-search form-control mx-3"
            style={{ maxWidth: '240px' }}
          />

          <div className="d-flex gap-2 ms-auto">
            {role === 'admin' && (
              <button className="sv-btn btn px-3" onClick={() => setIsModalOpen(true)}>
                + Restock
              </button>
            )}
            <button
              className="btn px-3"
              onClick={() => { fetchReceipts(); setShowHistory(true); }}
              style={{
                background: 'rgba(128,0,255,0.15)',
                border: '1px solid rgba(128,0,255,0.35)',
                color: '#b44fff',
                fontFamily: 'Space Mono, monospace',
                fontSize: '12px'
              }}
            >
              📊 Sales History
            </button>
            <button
              className="btn px-3"
              onClick={() => {
                localStorage.removeItem('role');
                localStorage.removeItem('username');
                setPage('login');
              }}
              style={{
                background: 'rgba(255,60,60,0.1)',
                border: '1px solid rgba(255,60,60,0.3)',
                color: '#ff7070',
                fontFamily: 'Space Mono, monospace',
                fontSize: '12px'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div className="container-fluid pt-5 mt-5 px-4" style={{position:'relative', zIndex:1}}>
        <div className="text-center mb-5 pt-4">
          <SecureVaultLanding/>
        </div>

        {/* Stats */}
        <div className="row g-4 mb-5 mx-1">
          {[
            { label: 'Models', value: mobiles.length, color: '#00ffb4' },
            {
              label: 'Total Units',
              value: mobiles.reduce((a, c) => a + Number(c.stockQuantity), 0),
              color: '#4488ff'
            },
            {
              label: 'Total Value',
              value: '₹' + mobiles.reduce((a, c) => a + c.price * c.stockQuantity, 0).toLocaleString(),
              color: '#00c864'
            }
          ].map((s, i) => (
            <div className="col-md-4" key={i}>
              <div className="stat-card">
                <div className="sv-label-tag">{s.label}</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: s.color }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Cards */}
        <div className="row g-4 mx-1">
          {filteredMobiles.map(m => (
            <div className="col-md-4 col-lg-3" key={m._id}>
              <div className="mobile-card card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span style={{color:'#00ffb4', fontSize:'20px'}}>📦</span>
                  {role === 'admin' && (
                    <button
                      className="btn btn-sm p-0"
                      style={{color:'rgba(255,100,100,0.6)', background:'none', border:'none'}}
                      onClick={() => api.delete(`/mobiles/${m._id}`).then(fetchMobiles)}
                    >
                      🗑
                    </button>
                  )}
                </div>

                <h5 className="text-white fw-black text-uppercase mb-1">{m.modelName}</h5>
                <div className="sv-label-tag mb-3">{m.brand} • {m.storageCapacity}</div>

                <div className="d-flex justify-content-between align-items-center p-3 rounded mb-3"
                  style={{background:'rgba(255,255,255,0.05)'}}>
                  <span className="fw-bold text-white">₹{m.price.toLocaleString()}</span>
                  <span style={{color: m.stockQuantity < 5 ? '#ff9500' : '#00ffb4', fontWeight:'bold'}}>
                    {m.stockQuantity} Left
                  </span>
                </div>

                <button
                  disabled={m.stockQuantity <= 0}
                  onClick={() => setCheckoutItem(m)}
                  className="sv-btn btn w-100 mb-2"
                >
                  🛍 {m.stockQuantity > 0 ? 'Buy Unit' : 'Sold Out'}
                </button>

                {role === 'admin' && (
                  <button
                    className="btn w-100"
                    style={{
                      background:'rgba(0,200,100,0.1)',
                      border:'1px solid rgba(0,200,100,0.3)',
                      color:'#00c864',
                      fontFamily:'Space Mono, monospace',
                      fontSize:'12px'
                    }}
                    onClick={() => {
                      const qty = prompt("Kitni quantity add karni hai?");
                      if (!qty) return;
                      const price = prompt("Naya price? (same rakhna ho toh Cancel)");
                      const updateData = { quantity: Number(qty) };
                      if (price) updateData.price = Number(price);
                      api.patch(`/mobiles/${m._id}/stock`, updateData).then(fetchMobiles);
                    }}
                  >
                    📦 Add Stock
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredMobiles.length === 0 && searchQuery && (
            <div className="text-center text-white py-5">
              <p style={{fontSize:'24px'}}>📦 Stock is Empty!</p>
              <p style={{color:'rgba(255,255,255,0.4)'}}>"{searchQuery}" nahi mila</p>
            </div>
          )}
        </div>
      </div>

      {/* ── ADD MODAL ── */}
      {isModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)', zIndex:1050}}>
          <div className="vault-modal p-5 w-100" style={{maxWidth:'480px'}}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="sv-title mb-0">Inventory Console</h5>
              <button onClick={() => setIsModalOpen(false)}
                className="btn p-0" style={{color:'rgba(255,255,255,0.4)', background:'none', border:'none', fontSize:'20px'}}>
                ✕
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = Object.fromEntries(new FormData(e.target));
              await api.post('/mobiles', fd);
              fetchMobiles();
              setIsModalOpen(false);
            }}>
              {['brand','modelName','storageCapacity'].map(field => (
                <div className="mb-3" key={field}>
                  <input name={field} type="text" placeholder={field} className="sv-input" required />
                </div>
              ))}
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <input name="price" type="number" placeholder="Price" className="sv-input" required />
                </div>
                <div className="col-6">
                  <input name="stockQuantity" type="number" placeholder="Stock" className="sv-input" required />
                </div>
              </div>
              <button type="submit" className="sv-btn btn w-100">Commit to Vault</button>
            </form>
          </div>
        </div>
      )}

      {/* ── CHECKOUT MODAL ── */}
      {checkoutItem && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{background:'rgba(0,0,0,0.92)', backdropFilter:'blur(12px)', zIndex:1050}}>
          <div className="vault-modal p-4 w-100" style={{maxWidth:'440px'}}>
            <h5 className="sv-title mb-4">Retail Dispatch</h5>
            <form onSubmit={handleConfirmPurchase}>
              {uiError && (
                <div className="sv-error mb-3">{uiError}</div>
              )}
              <div className="mb-3">
                <input type="text" placeholder="Customer Name" required className="sv-input"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
              </div>
              <div className="mb-3">
                <input type="tel" placeholder="10-Digit Phone" required maxLength="10" className="sv-input"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value.replace(/\D/g,'')})} />
              </div>
              <div className="mb-3">
                <textarea placeholder="Address" required className="sv-input" style={{height:'70px', resize:'none'}}
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <input type="number" placeholder="Discount %" min="0" max="100" className="sv-input"
                    value={customerInfo.discount}
                    onChange={(e) => setCustomerInfo({...customerInfo, discount: e.target.value})} />
                </div>
                <div className="col-6">
                  <input type="number" placeholder="GST %" min="0" className="sv-input"
                    value={customerInfo.gst}
                    onChange={(e) => setCustomerInfo({...customerInfo, gst: e.target.value})} />
                </div>
              </div>
              <div className="mb-4">
                <select className="sv-select"
                  value={customerInfo.paymentMode}
                  onChange={(e) => setCustomerInfo({...customerInfo, paymentMode: e.target.value})}>
                  <option value="Cash">💵 Cash</option>
                  <option value="Online">📱 Online</option>
                  <option value="Card">💳 Card</option>
                </select>
              </div>
              <button type="submit" className="sv-btn btn w-100 mb-2">Finalize Sale</button>
              <button type="button" className="btn w-100"
                style={{color:'rgba(255,255,255,0.4)', background:'none', border:'none', fontFamily:'Space Mono, monospace', fontSize:'12px'}}
                onClick={() => { setCheckoutItem(null); setUiError(""); }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── RECEIPT MODAL ── */}
      {activeReceipt && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{background:'rgba(0,0,0,0.85)', backdropFilter:'blur(12px)', zIndex:1060}}>
          <div className="vault-modal p-4 w-100 text-center" style={{maxWidth:'400px'}}>
            <div style={{color:'#00c864', fontSize:'28px', fontWeight:900}} className="mb-3">PAID ✓</div>
            <div className="p-3 rounded mb-4 text-start" style={{background:'rgba(255,255,255,0.05)', fontSize:'13px'}}>
              {[
                ['Receipt ID', activeReceipt.receiptId],
                ['Customer', activeReceipt.customerName],
                ['Phone', activeReceipt.customerPhone],
                ['Address', activeReceipt.customerAddress],
                ['Model', activeReceipt.modelName],
                ['Price', '₹' + activeReceipt.pricePaid?.toLocaleString()],
                ['Discount', activeReceipt.discount + '%'],
                ['GST', activeReceipt.gst + '%'],
                ['Payment', activeReceipt.paymentMode],
                ['Guarantee', new Date(activeReceipt.guaranteeUntil).toLocaleDateString()],
              ].map(([label, val]) => (
                <div className="d-flex justify-content-between py-1 border-bottom" key={label}
                  style={{borderColor:'rgba(255,255,255,0.05)'}}>
                  <span style={{color:'rgba(255,255,255,0.4)'}}>{label}</span>
                  <span className="text-white fw-bold">{val}</span>
                </div>
              ))}
              <div className="d-flex justify-content-between pt-2 mt-1">
                <span style={{color:'#00c864', fontWeight:900}}>TOTAL</span>
                <span style={{color:'#00c864', fontWeight:900}}>
                  ₹{activeReceipt.totalPaid?.toLocaleString() || activeReceipt.pricePaid?.toLocaleString()}
                </span>
              </div>
            </div>
            <button className="sv-btn btn w-100 mb-2" onClick={() => window.print()}>🖨️ Print Receipt</button>
            <button className="btn w-100" style={{background:'rgba(255,255,255,0.1)', color:'#fff', border:'none'}}
              onClick={() => setActiveReceipt(null)}>Close</button>
          </div>
        </div>
      )}
{/* ── SALES HISTORY ── */}
      {showHistory && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{background:'rgba(0,0,0,0.92)', backdropFilter:'blur(12px)', zIndex:1050}}>
          <div className="vault-modal p-4 w-100" style={{maxWidth:'1000px', maxHeight:'90vh', overflowY:'auto'}}>

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="sv-title mb-0">Sales History</h5>
              <div className="d-flex gap-3 align-items-center">
                <input
                  type="text"
                  placeholder="Search name or phone..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="vault-search form-control"
                  style={{width:'250px'}}
                />
                <button onClick={() => setShowHistory(false)}
                  style={{color:'rgba(255,255,255,0.4)', background:'none', border:'none', fontSize:'20px', cursor:'pointer'}}>
                  ✕
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="row g-3 mb-4">
              {[
                { label:'Total Sales', value: receipts.length, color:'#00c864', bg:'rgba(0,200,100,0.1)', border:'rgba(0,200,100,0.2)' },
                { label:'Revenue', value:'₹'+receipts.filter(r=>r.status!=='returned').reduce((s,r)=>s+(r.totalPaid||r.pricePaid),0).toLocaleString(), color:'#4488ff', bg:'rgba(68,136,255,0.1)', border:'rgba(68,136,255,0.2)' },
                { label:'Today', value:'₹'+receipts.filter(r=>new Date(r.purchaseDate).toDateString()===new Date().toDateString()&&r.status!=='returned').reduce((s,r)=>s+(r.totalPaid||r.pricePaid),0).toLocaleString(), color:'#ff9500', bg:'rgba(255,149,0,0.1)', border:'rgba(255,149,0,0.2)' },
              ].map((s,i) => (
                <div className="col-md-4" key={i}>
                  <div className="p-3 rounded text-center" style={{background:s.bg, border:`1px solid ${s.border}`}}>
                    <div className="sv-label-tag">{s.label}</div>
                    <div style={{color:s.color, fontWeight:900, fontSize:'22px'}}>{s.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            {filteredReceipts.length === 0 ? (
              <p className="text-center py-5" style={{color:'rgba(255,255,255,0.3)'}}>Koi record nahi mila</p>
            ) : (
              <div className="table-responsive">
                <table className="table vault-table">
                  <thead>
                    <tr>
                      {['Receipt ID','Customer','Phone','Model','Amount','Date','Status','Action'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReceipts.map(r => (
                      <tr key={r._id}>
                        <td><span style={{color:'#4488ff', fontFamily:'monospace', fontSize:'12px'}}>{r.receiptId}</span></td>
                        <td>{r.customerName}</td>
                        <td>{r.customerPhone}</td>
                        <td className="text-uppercase">{r.modelName}</td>
                        <td style={{color:'#00c864', fontWeight:'bold'}}>₹{(r.totalPaid||r.pricePaid)?.toLocaleString()}</td>
                        <td style={{color:'rgba(255,255,255,0.5)'}}>{new Date(r.purchaseDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${
                            r.status === 'returned' ? 'badge-returned' :
                            r.status === 'exchanged' ? 'badge-exchanged' :
                            'badge-sold'
                          } px-2 py-1`} style={{fontSize:'11px'}}>
                            {(r.status || 'sold').toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {r.status === 'sold' && (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm px-2 py-1"
                                style={{background:'rgba(255,60,60,0.15)', color:'#ff7070', border:'1px solid rgba(255,60,60,0.3)', fontSize:'11px'}}
                                onClick={() => handleReturn(r)}
                              >
                                ↩ Return
                              </button>
                              <button
                                className="btn btn-sm px-2 py-1"
                                style={{background:'rgba(255,180,0,0.15)', color:'#ffb400', border:'1px solid rgba(255,180,0,0.3)', fontSize:'11px'}}
                                onClick={() => { setExchangeModal(r); setExchangeData({ newModelName:'', newPrice:0 }); }}
                              >
                                🔄 Exchange
                              </button>
                            </div>
                          )}
                          {r.status === 'returned' && (
                            <button
                              className="btn btn-sm px-2 py-1"
                              style={{background:'rgba(68,136,255,0.15)', color:'#4488ff', border:'1px solid rgba(68,136,255,0.3)', fontSize:'11px'}}
                              onClick={() => handlePrint(r, 'return')}
                            >
                              🖨 Print
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── RETURN RECEIPT MODAL ── */}
      {returnModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)', zIndex:1060}}>
          <div className="vault-modal p-4 w-100" style={{maxWidth:'420px'}}>
            <h5 className="sv-title mb-4">Return Receipt</h5>
            <div className="mb-4" style={{fontSize:'13px'}}>
              {[
                ['Customer', returnModal.customerName],
                ['Phone', returnModal.customerPhone],
                ['Model', returnModal.modelName],
                ['Refund Amount', '₹' + returnModal.totalPaid?.toLocaleString()],
                ['Date', new Date().toLocaleDateString()],
              ].map(([label, val]) => (
                <div className="d-flex justify-content-between py-2 border-bottom" key={label}
                  style={{borderColor:'rgba(255,255,255,0.07)'}}>
                  <span style={{color:'rgba(255,255,255,0.4)'}}>{label}</span>
                  <span className="text-white fw-bold">{val}</span>
                </div>
              ))}
            </div>
            <div className="d-flex gap-3">
              <button className="sv-btn btn flex-fill" onClick={() => handlePrint(returnModal, 'return')}>
                🖨️ Print Receipt
              </button>
              <button className="btn flex-fill"
                style={{background:'rgba(255,255,255,0.08)', color:'#fff', border:'1px solid rgba(255,255,255,0.1)'}}
                onClick={() => setReturnModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EXCHANGE MODAL ── */}
      {exchangeModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)', zIndex:1060}}>
          <div className="vault-modal p-4 w-100" style={{maxWidth:'460px'}}>
            <h5 className="sv-title mb-4">Exchange Mobile</h5>

            {/* Old mobile */}
            <div className="p-3 rounded mb-4" style={{background:'rgba(255,255,255,0.05)'}}>
              <div className="sv-label-tag mb-1">Old Mobile</div>
              <div className="text-white fw-bold">{exchangeModal.modelName}</div>
              <div style={{color:'rgba(255,255,255,0.5)'}}>₹{exchangeModal.totalPaid?.toLocaleString()}</div>
            </div>

            {/* New mobile select */}
            <div className="mb-3">
              <label className="sv-label-tag d-block mb-2">Select New Mobile</label>
              <select
                className="sv-select"
                value={exchangeData.newModelName}
                onChange={(e) => {
                  const sel = mobiles.find(m => m.modelName === e.target.value);
                  setExchangeData({ newModelName: e.target.value, newPrice: sel?.price || 0 });
                }}
              >
                <option value="">-- Select Model --</option>
                {mobiles
                  .filter(m => m.stockQuantity > 0 && m.modelName !== exchangeModal.modelName)
                  .map(m => (
                    <option key={m._id} value={m.modelName}>
                      {m.brand} {m.modelName} — ₹{m.price.toLocaleString()} ({m.stockQuantity} left)
                    </option>
                  ))}
              </select>
            </div>

            {/* Price diff */}
            {exchangeData.newModelName && (
              <div className="p-3 rounded mb-4" style={{
                background: priceDiff > 0 ? 'rgba(255,60,60,0.1)' : 'rgba(0,200,100,0.1)',
                border: `1px solid ${priceDiff > 0 ? 'rgba(255,60,60,0.3)' : 'rgba(0,200,100,0.3)'}`
              }}>
                <div style={{
                  color: priceDiff > 0 ? '#ff7070' : '#00c864',
                  fontWeight: 900, fontSize: '16px'
                }}>
                  {priceDiff > 0
                    ? `Customer Pays Extra: ₹${priceDiff.toLocaleString()}`
                    : priceDiff < 0
                      ? `Refund to Customer: ₹${Math.abs(priceDiff).toLocaleString()}`
                      : 'Same Price — No Extra Charge'}
                </div>
              </div>
            )}

            <div className="d-flex gap-3">
              <button
                className="btn flex-fill"
                disabled={!exchangeData.newModelName}
                style={{
                  background: exchangeData.newModelName ? 'rgba(255,180,0,0.2)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,180,0,0.4)',
                  color: '#ffb400',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '12px'
                }}
                onClick={async () => {
                  await handleExchange();
                  handlePrint(exchangeModal, 'exchange');
                }}
              >
                ✅ Confirm & Print
              </button>
              <button className="btn flex-fill"
                style={{background:'rgba(255,255,255,0.08)', color:'#fff', border:'1px solid rgba(255,255,255,0.1)'}}
                onClick={() => setExchangeModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}