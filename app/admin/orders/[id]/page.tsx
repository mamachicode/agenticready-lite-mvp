"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function AdminOrderDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/orders/${id}/report`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Fetch failed (${res.status})`);
        }

        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        console.error("ORDER_DETAIL_FETCH_FAILED", err);
        setError(err?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      load();
    }
  }, [id]);

  if (loading) {
    return <div className="p-4">Loading…</div>;
  }

  if (error) {
    return (
      <div className="p-4 space-y-4">
        <p className="text-red-600">
          Failed to load order detail: {error}
        </p>
        <Link href="/admin/orders" className="underline text-blue-600">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4">
        <p>Order not found.</p>
        <Link href="/admin/orders" className="underline text-blue-600">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-xl font-semibold">Admin — Fulfill Order</h1>
      <p><strong>Email:</strong> {order.email}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Order ID:</strong> {order.id}</p>

      <Link href="/admin/orders" className="underline text-blue-600">
        ← Back to Orders
      </Link>
    </div>
  );
}
