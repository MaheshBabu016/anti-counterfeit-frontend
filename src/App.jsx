import React, { useState } from "react";
import Scanner from "./components/Scanner";
import Register from "./pages/Register";

export default function App() {
  const [page, setPage] = useState("scan");

  return (
    <div style={{ maxWidth: 900, margin: "28px auto", padding: 12 }}>
      <h1>Anti-Counterfeit System</h1>

      <div>
        <button onClick={() => setPage("scan")}>Scan Product</button>
        <button onClick={() => setPage("register")} style={{ marginLeft: 10 }}>
          Register Product
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      {page === "scan" && <Scanner />}
      {page === "register" && <Register />}
    </div>
  );
}
