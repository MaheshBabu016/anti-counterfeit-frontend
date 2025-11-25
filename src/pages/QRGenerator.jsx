
import React, { useState } from 'react'
import QRCode from 'qrcode'

/*
  QR payload format created by this page:
  {
    productId: "<bytes32>",
    productHash: "0x...",
    manufacturer: "<name>",
    verifyUrl: "<BACKEND>/verify"
  }
*/

async function sha256hex(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function encodeProductId(productId) {
  // basic bytes32-friendly conversion (frontend-only helper)
  const hex = Buffer.from(productId, 'utf8').toString('hex');
  return '0x' + hex.padEnd(64, '0');
}

export default function QRGenerator() {
  const [name, setName] = useState('');
  const [productId, setProductId] = useState('');
  const [svgDataUrl, setSvgDataUrl] = useState('');
  const [payload, setPayload] = useState(null);
  const BACKEND = import.meta.env.VITE_API_URL || 'https://anti-counterfeit-backend-4jp1.onrender.com';

  async function generate() {
    if (!name || !productId) {
      alert('Please enter manufacturer name and product id');
      return;
    }

    const productHash = await sha256hex((name + '|' + productId));
    const encodedId = encodeProductId(productId);

    const p = {
      productId: encodedId,
      productHash,
      manufacturer: name,
      verifyUrl: `${BACKEND}/verify`
    };

    setPayload(p);

    // create a PNG data URL (smaller & widely supported)
    try {
      const url = await QRCode.toDataURL(JSON.stringify(p), { width: 512 });
      setSvgDataUrl(url);
    } catch (err) {
      console.error('QR generation failed', err);
      alert('QR generation failed: ' + err.message);
    }
  }

  function downloadQR() {
    if (!svgDataUrl) return alert('Generate first');
    const a = document.createElement('a');
    a.href = svgDataUrl;
    a.download = `${productId || 'product'}-qr.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div style={{ maxWidth: 760, margin: '20px auto', padding: 16 }}>
      <h2>QR Code Generator</h2>

      <div style={{ display: 'grid', gap: 10 }}>
        <label>Manufacturer name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="HP Company Ltd" style={{ padding: 8 }} />

        <label>Product ID</label>
        <input value={productId} onChange={e => setProductId(e.target.value)} placeholder="LAPTOP-HP-2025" style={{ padding: 8 }} />

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={generate} style={{ padding: '10px 14px' }}>Generate QR</button>
          <button onClick={downloadQR} disabled={!svgDataUrl} style={{ padding: '10px 14px' }}>Download PNG</button>
        </div>
      </div>

      {payload && (
        <div style={{ marginTop: 18, padding: 12, background: '#fafafa', borderRadius: 8 }}>
          <h4>QR payload (JSON)</h4>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(payload, null, 2)}</pre>
        </div>
      )}

      {svgDataUrl && (
        <div style={{ marginTop: 18 }}>
          <h4>QR Preview</h4>
          <img src={svgDataUrl} alt="QR preview" style={{ maxWidth: '100%', border: '1px solid #eee', borderRadius: 8 }} />
        </div>
      )}
    </div>
  )
}

