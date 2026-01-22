"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  id: string;
  email: string;
  status: string;
  reportS3Key?: string | null;
  fulfilledAt?: string | null;
};

export default function OrderClient({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
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
    } catch (e: any) {
      setErr(e?.message || "Failed to load order");
      setOrder(null);
    }
  }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function fulfill() {
    if (!file) {
      setErr("Select a PDF first");
      return;
    }

    setBusy(true);
    setErr(null);
    setMsg(null);

    try {
      const fd = new FormData();
      fd.set("file", file);

      const res = await fetch(`/api/admin/orders/${id}/fulfill`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        let message = "Fulfillment failed."; try { const data = await res.json(); if (data?.error) message = data.error; } catch {} throw new Error(message);
      }

      setMsg("Order fulfilled and email sent.");
      await load(); setMsg("Order fulfilled and email sent.");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!order) return <div className="p-4">Order not found.</div>;

  return (
    <div>
      <p><b>Email:</b> {order.email}</p>
      <p><b>Status:</b> {order.status}</p>
      <p><b>Report:</b> {order.reportS3Key ?? "(none)"}</p>
      <p><b>Fulfilled:</b> {order.fulfilledAt ?? "(not yet)"}</p>

      <hr />

      <input
        type="file"
        accept="application/pdf"
        onChange={e => setFile(e.target.files?.[0] ?? null)}
        disabled={busy}
      />

      <br /><br />

      <button onClick={fulfill} disabled={busy || order.status === "SENT"}>
        {busy ? "Sending…" : "Upload PDF + Send"}
      </button>

      <p style={{ color: "green" }}>{msg}</p>
      <p style={{ color: "crimson" }}>{err}</p>

      <p>
        <Link href="/admin/orders">← Back to orders</Link>
      </p>
    </div>
  );
}
