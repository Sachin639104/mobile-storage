import React from 'react'
import { Trash2, IndianRupee, ShoppingBag, Box } from 'lucide-react'

export default function MobileCard({ mobile, onDelete, onPurchase, onUpdate }) {
  const role = localStorage.getItem('role')

  return (
    <div className="mobile-card card h-100 p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <Box size={22} style={{color:'#00ffb4'}} />
        {role === 'admin' && (
          <button
            className="btn btn-sm p-1"
            style={{color:'rgba(255,255,255,0.3)', background:'none', border:'none'}}
            onClick={() => onDelete(mobile._id)}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <h5 className="fw-black text-white text-uppercase mb-1" style={{letterSpacing:'-0.02em'}}>
        {mobile.modelName}
      </h5>
      <div className="sv-label-tag mb-3">{mobile.brand} • {mobile.storageCapacity}</div>

      <div className="d-flex justify-content-between align-items-center p-3 rounded mb-3"
        style={{background:'rgba(255,255,255,0.05)'}}>
        <span className="fw-bold text-white d-flex align-items-center gap-1">
          <IndianRupee size={15} />{mobile.price.toLocaleString()}
        </span>
        <span style={{color: mobile.stockQuantity < 5 ? '#ff9500' : '#00ffb4', fontWeight:'bold'}}>
          {mobile.stockQuantity} Left
        </span>
      </div>

      <button
        disabled={mobile.stockQuantity <= 0}
        onClick={() => onPurchase(mobile)}
        className="btn sv-btn mb-2"
      >
        <ShoppingBag size={16} className="me-1" />
        {mobile.stockQuantity > 0 ? 'Buy Unit' : 'Sold Out'}
      </button>

      {role === 'admin' && (
        <button
          onClick={() => onUpdate(mobile._id)}
          className="btn w-100 py-2"
          style={{
            background:'rgba(0,200,100,0.1)',
            border:'1px solid rgba(0,200,100,0.3)',
            color:'#00c864',
            fontFamily:'Space Mono, monospace',
            fontSize:'12px'
          }}
        >
          <Box size={14} className="me-1" /> Add Stock
        </button>
      )}
    </div>
  )
}