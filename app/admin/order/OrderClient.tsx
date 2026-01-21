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
    const res = await fetch("/api/admin/orders", { cache: "no-store" });
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.orders ?? [];
    const found = list.find((o: any) => o.id === id);
    setOrder(found ?? null);
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
        throw new Error(await res.text());
      }

      setMsg("Order fulfilled and email sent.");
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!order) return <div>Loading…</div>;

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
        Upload PDF + Send
      </button>

      <p style={{ color: "green" }}>{msg}</p>
      <p style={{ color: "crimson" }}>{err}</p>

      <p>
        <Link href="/admin/orders">← Back to orders</Link>
      </p>
    </div>
  );
}
