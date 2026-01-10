"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  async function login() {
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

    // Only redirect AFTER cookie/token has been set by API
    location.href = "/admin/orders";
  }

  return (
    <div className="max-w-sm mx-auto mt-40 bg-white p-6 rounded shadow">
      <h1 className="text-xl mb-4">Admin Login</h1>

      <input
        type="password"
        placeholder="Admin password"
        className="border p-2 w-full mb-4"
        onChange={(e) => setPass(e.target.value)}
      />

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <button onClick={login} className="bg-black text-white w-full py-2 rounded">
        Login
      </button>
    </div>
  );
}
