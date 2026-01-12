export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { fetchPaidOrders } from "./actions";

export default async function OrdersPage() {
  const orders = await fetchPaidOrders();

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-semibold">Paid Orders</h1>

      {orders.length === 0 ? (
        <div>No paid orders found.</div>
      ) : (
        <ul className="space-y-2">
          {orders.map((o) => (
            <li key={o.id} className="p-4 bg-white rounded shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-sm">{o.id}</div>
                  <div className="text-sm">Email: {o.email}</div>
                  <div className="text-sm">Status: {o.status}</div>
                </div>
                <Link className="underline" href={`/admin/orders/${o.id}`}>
                  Open
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
