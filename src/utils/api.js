
const API_BASE = import.meta.env.VITE_API_URL || 'https://anti-counterfeit-backend-4jp1.onrender.com';

export async function verifyQR(payload) {
  const res = await fetch(`${API_BASE}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qrPayload: payload }),
  });
  if (!res.ok) {
    const text = await res.text().catch(()=>null);
    throw new Error('Verification failed: ' + (text || res.status));
  }
  return res.json();
}
