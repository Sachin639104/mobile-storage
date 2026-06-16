import React from 'react'
import { Smartphone, Plus, LogOut } from 'lucide-react'

export default function Navbar({ onAddClick, onLogout, onSearch, onHistoryClick }) {
  const role = localStorage.getItem('role')

  return (
    <nav className="vault-nav navbar navbar-expand-lg fixed-top px-4">
      <div className="container-fluid">

        {/* Brand */}
        <span className="vault-brand navbar-brand mb-0">
          <Smartphone size={22} className="me-2" style={{color:'rgb(71, 190, 155)'}} />
          Storage<span>Vault</span>
        </span>

        {/* Search */}
        <input
          type="text"
          placeholder="Search mobiles..."
          onChange={(e) => onSearch(e.target.value)}
          className="vault-search form-control mx-3"
          style={{maxWidth:'260px'}}
        />

        {/* Buttons */}
        <div className="d-flex gap-2 ms-auto">
          {role === 'admin' && (
            <button className="btn sv-btn px-4" onClick={onAddClick}>
              <Plus size={16} className="me-1" /> Restock
            </button>
          )}
          <button
            className="btn px-4"
            onClick={onHistoryClick}
            style={{
              background:'rgba(128,0,255,0.15)',
              border:'1px solid rgba(128,0,255,0.35)',
              color:'#b44fff',
              fontFamily:'Space Mono, monospace',
              fontSize:'12px'
            }}
          >
            📊 Sales History
          </button>
          <button
            className="btn px-4"
            onClick={onLogout}
            style={{
              background:'rgba(255,60,60,0.1)',
              border:'1px solid rgba(255,60,60,0.3)',
              color:'#ff7070',
              fontFamily:'Space Mono, monospace',
              fontSize:'12px'
            }}
          >
            <LogOut size={14} className="me-1" /> Logout
          </button>
        </div>

      </div>
    </nav>
  )
}