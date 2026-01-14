"use client";

import { useState } from "react";

export default function ClientForms({ id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!file) return alert("Select a PDF first");
    setLoading(true);

    const body = new FormData();
    body.append("file", file);

    const res = await fetch(`/api/admin/orders/${id}/upload`, {
      method: "POST",
      body
    });

    if (res.ok) alert("Uploaded");
    else alert("Upload failed");

    setLoading(false);
  }

  async function fulfill() {
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${id}/fulfill`, { method: "POST" });
    if (res.ok) alert("Order fulfilled");
    else alert("Fulfill failed");
    setLoading(false);
  }

  return (
    <div className="space-y-4 pt-6 border-t">
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
      <div className="flex gap-4">
        <button onClick={upload} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          Upload PDF
        </button>
        <button onClick={fulfill} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
          Mark Fulfilled
        </button>
      </div>
    </div>
  );
}
