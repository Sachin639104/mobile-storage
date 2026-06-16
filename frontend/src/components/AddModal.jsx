import React, { useState } from 'react'
import api from '../api/axios'
import { X, Database } from 'lucide-react'

export default function AddModal({ isOpen, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    brand: '', modelName: '', storageCapacity: '', price: '', stockQuantity: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/mobiles', formData)
      onRefresh()
      onClose()
      setFormData({ brand: '', modelName: '', storageCapacity: '', price: '', stockQuantity: '' })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)', zIndex:1050}}>
      <div className="vault-modal p-5 w-100" style={{maxWidth:'480px'}}>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="sv-title mb-0">Inventory Console</h5>
          <button onClick={onClose} className="btn p-1" style={{color:'rgba(255,255,255,0.4)', background:'none', border:'none'}}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" placeholder="Brand" className="sv-input"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
          </div>
          <div className="mb-3">
            <input type="text" placeholder="Model Name" className="sv-input"
              value={formData.modelName}
              onChange={(e) => setFormData({ ...formData, modelName: e.target.value })} required />
          </div>
          <div className="mb-3">
            <input type="text" placeholder="Storage (e.g. 128GB)" className="sv-input"
              value={formData.storageCapacity}
              onChange={(e) => setFormData({ ...formData, storageCapacity: e.target.value })} required />
          </div>
          <div className="row g-3 mb-4">
            <div className="col-6">
              <input type="number" placeholder="Price" className="sv-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
            </div>
            <div className="col-6">
              <input type="number" placeholder="Stock" className="sv-input"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })} required />
            </div>
          </div>
          <button type="submit" className="sv-btn btn w-100">
            <Database size={16} className="me-2" /> Commit to Vault
          </button>
        </form>

      </div>
    </div>
  )
}