import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import RegisterProduct from './pages/RegisterProduct'
import VerifyMobile from './pages/VerifyMobile'
import QRScanner from './pages/QRScanner'
import QRGenerator from './pages/QRGenerator'

export default function App(){
  return (
    <BrowserRouter>
      <nav style={{ padding: 12, background: '#fff' }}>
        <Link to="/" style={{ marginRight: 12 }}>Dashboard</Link>
        <Link to="/register" style={{ marginRight: 12 }}>Register Product</Link>
        <Link to="/verify" style={{ marginRight: 12 }}>Verify</Link>
        <Link to="/scan" style={{ marginRight: 12 }}>Scan QR</Link>
        <Link to="/generate" style={{ marginRight: 12 }}>Generate QR</Link>
      </nav>

      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/register" element={<RegisterProduct/>} />
          <Route path="/verify" element={<VerifyMobile/>} />
          <Route path="/scan" element={<QRScanner/>} />
          <Route path="/generate" element={<QRGenerator/>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
