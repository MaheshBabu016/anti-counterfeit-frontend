
import React, { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

const QR_REGION_ID = 'html5qr-region'

export default function QRScanner() {
  const ref = useRef(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const BACKEND = import.meta.env.VITE_API_URL || 'https://anti-counterfeit-backend-4jp1.onrender.com'

  useEffect(() => {
    return () => {
      if (ref.current) ref.current.stop().catch(()=>{})
    }
  }, [])

  async function startScan() {
    setError(null)
    setResult(null)
    try {
      const html5QrCode = new Html5Qrcode(QR_REGION_ID)
      ref.current = html5QrCode
      const cameras = await Html5Qrcode.getCameras()
      if (!cameras || cameras.length === 0) {
        throw new Error('No camera found')
      }
      const camId = cameras[0].id
      await html5QrCode.start(
        camId,
        { fps: 10, qrbox: 300 },
        async decodedText => {
          // stop camera
          try { await html5QrCode.stop() } catch(_) {}
          setScanning(false)
          handleDecoded(decodedText)
        },
        errorMessage => {
          // scanning error callback (ignored)
        }
      )
      setScanning(true)
    } catch (e) {
      setError(e.message || String(e))
      setScanning(false)
    }
  }

  async function handleDecoded(text) {
    setError(null)
    setResult(null)

    let payload = null
    try {
      payload = JSON.parse(text)
    } catch (e) {
      // try base64 -> JSON
      try { payload = JSON.parse(atob(text)) } catch(e2) {
        setError('Scanned QR is not valid JSON')
        return
      }
    }

    // If payload contains verifyUrl, call it; otherwise call default backend verify
    const verifyUrl = payload.verifyUrl || (BACKEND + '/verify')

    try {
      const res = await fetch(verifyUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ qrPayload: { productId: payload.productId } })
      })
      const json = await res.json()
      setResult(json)
    } catch (err) {
      setError('Verification failed: ' + (err.message || err))
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 12 }}>
      <h2>QR Scanner</h2>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ width: 360, height: 360, border: '1px solid #eee', borderRadius: 8 }}>
          <div id={QR_REGION_ID} style={{ width: '100%', height: '100%' }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 10 }}>
            <button onClick={startScan} disabled={scanning} style={{ padding: '10px 14px', marginRight: 8 }}>
              {scanning ? 'Scanning...' : 'Start Camera'}
            </button>
            <button onClick={() => { if (ref.current) ref.current.stop().catch(()=>{}); setScanning(false) }} style={{ padding: '10px 14px' }}>
              Stop
            </button>
          </div>

          <div style={{ marginTop: 8 }}>
            <h4>Result</h4>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {!error && !result && <div style={{ color: '#666' }}>No verification yet.</div>}
            {result && (
              <div style={{ marginTop: 10, padding: 12, borderRadius: 8, background: '#f7f7f9' }}>
                <div style={{ fontWeight: 700 }}>{result.valid ? '✅ GENUINE' : '❌ FAKE'}</div>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>

          <div style={{ marginTop: 14 }}>
            <h4>Manual paste</h4>
            <textarea placeholder='Paste QR JSON (or base64) here' onBlur={(e) => handleDecoded(e.target.value)} style={{ width: '100%', minHeight: 90 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

