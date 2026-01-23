"use client";

import { useEffect, useState } from "react";

export default function OrderClient({ id }: { id: string }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/report`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Fetch failed (${res.status})`);
      }

      const data = await res.json();
      setOrder(data);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Failed to load order");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSend() {
    if (!file) {
      setErr('Please select a PDF file.');
      return;
    }

    setErr(null);
    setMsg(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(`/api/admin/orders/${id}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!uploadRes.ok) {
        throw new Error("Upload failed");
      }

      const sendRes = await fetch(`/api/admin/orders/${id}/email`, {
        method: "POST",
        credentials: "include",
      });

      if (!sendRes.ok) {
        const errData = await sendRes.json(); throw new Error(errData?.error || "Email send failed");
      }

      setMsg("Order fulfilled and email sent.");
      await load();
    } catch (e: any) {
      setErr(e?.message || "Fulfillment failed");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-4">Loading…</div>;
  if (err) return <div className="p-4 text-red-600">{err}</div>;
  if (!order) return <div className="p-4">Order not found.</div>;

  return (
    <div className="p-6 space-y-4">
      <a href="/admin/orders" className="underline">← Back to orders</a>

      <div>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Amount:</strong> {(order.amount / 100).toLocaleString("en-US", { style: "currency", currency: order.currency?.toUpperCase() })}</p>
      </div>

      {msg && <div className="text-green-600">{msg}</div>}

      <div className="space-y-2">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={handleSend}
          className="px-4 py-2 bg-black text-white"
        >
          Upload & Send
        </button>
      </div>
    </div>
  );
}
