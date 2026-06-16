import React from 'react'
import { Package, IndianRupee, Activity } from 'lucide-react'

export default function StatsBar({ mobiles }) {
  const totalStock = mobiles.reduce((acc, curr) => acc + Number(curr.stockQuantity), 0)
  const totalValue = mobiles.reduce((acc, curr) => acc + (Number(curr.price) * Number(curr.stockQuantity)), 0)

  return (
    <div className="row g-4 mb-5">
      <div className="col-md-4">
        <div className="stat-card d-flex align-items-center gap-3">
          <div className="p-3 rounded" style={{background:'rgba(0,255,180,0.1)'}}>
            <Activity size={22} style={{color:'#00ffb4'}} />
          </div>
          <div>
            <div className="sv-label-tag mb-1">Inventory Models</div>
            <div className="sv-title" style={{fontSize:'28px'}}>{mobiles.length}</div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="stat-card d-flex align-items-center gap-3">
          <div className="p-3 rounded" style={{background:'rgba(0,100,255,0.1)'}}>
            <Package size={22} style={{color:'#4488ff'}} />
          </div>
          <div>
            <div className="sv-label-tag mb-1">Total Units</div>
            <div className="sv-title" style={{fontSize:'28px'}}>{totalStock}</div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="stat-card d-flex align-items-center gap-3">
          <div className="p-3 rounded" style={{background:'rgba(0,200,100,0.1)'}}>
            <IndianRupee size={22} style={{color:'#00c864'}} />
          </div>
          <div>
            <div className="sv-label-tag mb-1">Total Valuation</div>
            <div className="sv-title" style={{fontSize:'28px'}}>₹{totalValue.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}