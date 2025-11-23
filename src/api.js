const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function verifyQR(payload) {
  const res = await fetch(`${API_BASE}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qrPayload: payload }),
  });

  if (!res.ok) throw new Error("Verification failed");
  return res.json();
}
