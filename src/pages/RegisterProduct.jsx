// frontend/src/pages/RegisterProduct.jsx
import React, { useState } from "react";

/*
  Robust RegisterProduct page:
  - generates a random bytes32 productId
  - generates productHash (SHA-256 of combined values)
  - posts a rich payload that includes productId, productHash, manufacturer, productName, owner (optional) and meta
  - displays QR preview and backend response
*/

function randBytes32Hex() {
  // generate 32 random bytes -> hex string prefixed with 0x
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  const hex = Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
  return "0x" + hex;
}

async function sha256hex(message) {
  const enc = new TextEncoder();
  const data = enc.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return "0x" + hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function RegisterProduct() {
  const [manufacturer, setManufacturer] = useState("");
  const [productName, setProductName] = useState("");
  const [owner, setOwner] = useState(""); // optional: put wallet address if you want
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  const BACKEND = import.meta.env.VITE_API_URL || "https://anti-counterfeit-backend-4jp1.onrender.com";

  async function handleRegister(e) {
    e?.preventDefault();
    setResponse(null);

    if (!manufacturer.trim() || !productName.trim()) {
      alert("Please enter Manufacturer and Product name.");
      return;
    }

    setLoading(true);

    try {
      // generate secure random productId (bytes32)
      const productId = randBytes32Hex();

      // create a productHash that ties productId + manufacturer + productName together
      const hashInput = `${productId}|${manufacturer}|${productName}`;
      const productHash = await sha256hex(hashInput);

      // full payload with many fields so backend can pick what it expects
      const payload = {
        productId,           // bytes32 hex
        productHash,         // 0x...
        manufacturer,        // string
        productName,         // string
        owner: owner || null,
        meta: {
          createdBy: "frontend",
          createdAt: Date.now()
        }
      };

      // send robust payload to backend register endpoint
      const res = await fetch(`${BACKEND}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const body = await res.json().catch(() => ({ error: true, status: res.status }));
      setResponse({ ok: res.ok, status: res.status, body });

      // Prepare QR payload – minimal fields needed for verification
      const qrPayload = {
        productId,
        productHash,
        manufacturer,
        productName,
        verifyUrl: `${BACKEND}/verify`
      };

      // create a PNG data URL for QR preview (use browser built-in QR generation library if installed)
      try {
        // If qrcode library exists, use it. Otherwise create simple text representation in QR field
        if (window.QRCode && typeof window.QRCode.toDataURL === "function") {
          const url = await window.QRCode.toDataURL(JSON.stringify(qrPayload), { width: 512 });
          setQrDataUrl(url);
        } else if (window.qrcode && window.qrcode.toDataURL) {
          const url = await window.qrcode.toDataURL(JSON.stringify(qrPayload), { width: 512 });
          setQrDataUrl(url);
        } else {
          // fallback: store JSON string (no image)
          setQrDataUrl("");
        }
      } catch (qrErr) {
        console.warn("QR generation failed (optional):", qrErr);
        setQrDataUrl("");
      }
    } catch (err) {
      console.error(err);
      setResponse({ ok: false, error: err.toString() });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Register Product</h2>

      <form onSubmit={handleRegister} style={styles.form}>
        <label style={styles.label}>Manufacturer</label>
        <input style={styles.input} value={manufacturer} onChange={e => setManufacturer(e.target.value)} placeholder="HP Company Ltd" />

        <label style={styles.label}>Product Name</label>
        <input style={styles.input} value={productName} onChange={e => setProductName(e.target.value)} placeholder="Laptop Model X" />

        <label style={styles.label}>Owner address (optional)</label>
        <input style={styles.input} value={owner} onChange={e => setOwner(e.target.value)} placeholder="0x..." />

        <div style={{ marginTop: 12 }}>
          <button style={styles.button} disabled={loading}>{loading ? "Registering..." : "Register Product"}</button>
        </div>
      </form>

      {response && (
        <div style={styles.response}>
          <h4>Backend response</h4>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {qrDataUrl ? (
        <div style={{ marginTop: 14 }}>
          <h4>QR Preview</h4>
          <img src={qrDataUrl} alt="QR code" style={{ maxWidth: 300, border: "1px solid #eee", borderRadius: 8 }} />
        </div>
      ) : (
        <div style={{ marginTop: 14, color: "#666" }}>
          <div>QR preview not available (optional QR lib not installed).</div>
          <div>You can paste the payload printed in backend response into the QR generator page to create a QR image.</div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 720, margin: "24px auto", padding: 18, background: "#fff", borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" },
  heading: { margin: 0, marginBottom: 12 },
  form: { display: "grid", gap: 10 },
  label: { fontWeight: "600" },
  input: { padding: 10, borderRadius: 8, border: "1px solid #ddd", fontSize: 16 },
  button: { padding: "12px 16px", background: "#111", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
  response: { marginTop: 16, padding: 12, background: "#f8f8f8", borderRadius: 8 }
};
