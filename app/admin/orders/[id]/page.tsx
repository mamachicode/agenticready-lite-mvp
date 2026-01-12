import { prisma } from "@/lib/prisma";

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) return <div>Order not found.</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Order {order.id}</h1>
      <p>Email: {order.email}</p>
      <p>Status: {order.status}</p>

      <form method="POST" action={`/api/admin/orders/${order.id}/upload`} encType="multipart/form-data">
        <input type="file" name="file" required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Upload PDF</button>
      </form>

      <form method="POST" action={`/api/admin/orders/${order.id}/fulfill`}>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Mark Fulfilled</button>
      </form>

      <form method="POST" action={`/api/admin/orders/${order.id}/email`}>
        <button className="bg-purple-600 text-white px-4 py-2 rounded">Send Report Ready Email</button>
      </form>
    </div>
  );
}
