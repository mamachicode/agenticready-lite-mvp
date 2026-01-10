import { prisma } from "@/lib/prisma";

export default async function Orders() {
  const orders = await prisma.order.findMany({ where: { status: "PAID" }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl mb-4">Paid Orders</h1>
      <ul className="space-y-2">
        {orders.map(o => (
          <li key={o.id} className="bg-white p-4 rounded shadow">
            <a href={`/admin/orders/${o.id}`} className="underline">{o.email}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
