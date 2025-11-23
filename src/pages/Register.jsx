import React, { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [qr, setQr] = useState(null);
  const [productId, setProductId] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setQr(null);

    const res = await fetch("http://localhost:4000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    const data = await res.json();
    setQr(data.qr);
    setProductId(data.productId);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Register Product</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10 }}
        />

        <textarea
          placeholder="Product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10 }}
        />

        <button type="submit">Register</button>
      </form>

      {qr && (
        <div style={{ marginTop: 20 }}>
          <h3>Product Registered!</h3>
          <p><b>Product ID:</b> {productId}</p>
          <img src={qr} alt="QR Code" style={{ width: 200, border: "1px solid #ddd" }} />

          <a href={qr} download="product-qr.png">
            <button style={{ marginTop: 10 }}>Download QR</button>
          </a>
        </div>
      )}
    </div>
  );
}
