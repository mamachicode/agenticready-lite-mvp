"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pass }),
    });

    if (res.ok) window.location.replace("/admin");
    else setError("Invalid password");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
        <input type="password" value={pass} onChange={(e)=>setPass(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
