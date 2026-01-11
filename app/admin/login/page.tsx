"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pass }),
    });

    if (!res.ok) {
      setError("Invalid password");
      return;
    }

    // Cookie is set by server — redirect directly
    window.location.href = "/admin/orders";
  }

  return (
    <form onSubmit={login} style={{ padding: 40 }}>
      <h1>Admin Login</h1>
      <input
        type="password"
        placeholder="Admin password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
