"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  email: string;
  status: string;
  createdAt: string;
};

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function load() {
    const res = await fetch("/api/admin/orders", { cache: "no-store" });
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.orders ?? [];
    setOrders(list);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.email}</td>
              <td>{o.status}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>
                <Link href={`/admin/orders/${o.id}`}>Open</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
