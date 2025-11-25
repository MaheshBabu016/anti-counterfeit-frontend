export const API_BASE = "https://anti-counterfeit-backend-4jp1.onrender.com";

export async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.json();
}

export function encodeProductId(input) {
  return "0x" + Buffer.from(input).toString("hex").padEnd(64, "0");
}
