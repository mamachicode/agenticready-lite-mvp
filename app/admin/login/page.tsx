"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [pass, setPass] = useState("");

  async function login() {
    await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ pass }),
    });
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
      <button onClick={login} className="bg-black text-white w-full py-2 rounded">
        Login
      </button>
    </div>
  );
}
