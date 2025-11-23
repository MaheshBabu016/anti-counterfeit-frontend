import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyQR } from "../api";

export default function Scanner() {
  const qrRegionId = "qr-reader";
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const html5QrRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    if (scanning) {
      const qr = new Html5Qrcode(qrRegionId, { verbose: false });
      html5QrRef.current = qr;

      Html5Qrcode.getCameras()
        .then((devices) => {
          if (!mounted) return;
          if (!devices || devices.length === 0) {
            setError("No camera available");
            setScanning(false);
            return;
          }

          qr.start(
            devices[0].id,
            { fps: 10, qrbox: 250 },
            async (text) => {
              await qr.stop().catch(() => {});
              setScanning(false);
              handleDecoded(text);
            },
            () => {}
          ).catch((err) => {
            setError("Camera start error: " + err);
            setScanning(false);
          });
        })
        .catch((err) => {
          setError("Camera error: " + err);
          setScanning(false);
        });
    }

    return () => {
      mounted = false;
      if (html5QrRef.current) html5QrRef.current.stop().catch(() => {});
    };
  }, [scanning]);

  async function handleDecoded(text) {
    setError(null);
    setResult(null);
    let payload;

    try {
      payload = JSON.parse(text);
    } catch {
      try {
        payload = JSON.parse(atob(text));
      } catch {
        setError("Invalid QR JSON payload");
        return;
      }
    }

    try {
      const data = await verifyQR(payload);
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <button
        onClick={() => {
          setScanning((s) => !s);
          setError(null);
          setResult(null);
        }}
      >
        {scanning ? "Stop Scanner" : "Start Scanner"}
      </button>

      <div
        id={qrRegionId}
        style={{ width: 360, height: 360, marginTop: 12, border: "1px solid #ccc" }}
      />

      <textarea
        rows={4}
        placeholder="Or paste QR JSON here…"
        style={{ width: "100%", marginTop: 12 }}
        onBlur={(e) => handleDecoded(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <pre style={{ marginTop: 12, background: "#eee", padding: 10 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
