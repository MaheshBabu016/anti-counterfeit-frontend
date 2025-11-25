import React, { useState } from "react";
import { apiPost } from "../utils";

export default function VerifyMobile() {
  const [productId, setProductId] = useState("");
  const [result, setResult] = useState(null);

  const verify = async () => {
    if (!productId.trim()) return alert("Enter product ID");

    const encoded = "0x" + Buffer.from(productId).toString("hex").padEnd(64, "0");

    const res = await apiPost(
      "https://anti-counterfeit-backend-4jp1.onrender.com/verify",
      { qrPayload: { productId: encoded } }
    );

    setResult(res);
  };

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "auto" }}>
      <h2>Verify Product (Mobile)</h2>

      <input
        placeholder="Enter Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 16,
          border: "1px solid #ccc",
          marginBottom: 10,
          borderRadius: 6,
        }}
      />

      <button
        onClick={verify}
        style={{
          width: "100%",
          padding: 14,
          background: "black",
          color: "white",
          fontSize: 16,
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Verify
      </button>

      {result && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            background: "#f8f8f8",
            borderRadius: 6,
          }}
        >
          <h3>Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
