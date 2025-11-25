import React from 'react'

export default function Dashboard(){
  // Replace with real API calls if needed
  const stats = { total: 128, manufacturers: 6, verified: 120 }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <h2>Admin Dashboard</h2>
        <div style={{color:'#6b7280'}}>Overview</div>
      </div>

      <div className='grid'>
        <div className='card'>
          <div style={{color:'#6b7280'}}>Total Products</div>
          <div className='kpi'>{stats.total}</div>
        </div>
        <div className='card'>
          <div style={{color:'#6b7280'}}>Manufacturers</div>
          <div className='kpi'>{stats.manufacturers}</div>
        </div>
        <div className='card'>
          <div style={{color:'#6b7280'}}>Verified</div>
          <div className='kpi'>{stats.verified}</div>
        </div>
      </div>

      <div className='section card'>
        <h3>Recent Registrations</h3>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead style={{textAlign:'left',color:'#6b7280'}}>
            <tr><th>Product ID</th><th>Manufacturer</th><th>Timestamp</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>0x4c41...0000</td><td>HP Company Ltd</td><td>2025-11-23</td><td>Registered</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
