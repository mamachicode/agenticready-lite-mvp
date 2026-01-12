import { getOrderById } from "@/lib/adminOrders";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);

  if (!order) {
    return <div className="p-10">Order not found</div>;
  }

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Order {order.id}</h1>
      <p>Status: {order.status}</p>
      <p>Email: {order.email ?? "—"}</p>

      <form action={`/api/admin/orders/${order.id}/upload`} method="post" encType="multipart/form-data">
        <input type="file" name="file" required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Upload PDF</button>
      </form>

      <form action={`/api/admin/orders/${order.id}/fulfill`} method="post">
        <button className="bg-green-600 text-white px-4 py-2 rounded">Mark Fulfilled</button>
      </form>
    </div>
  );
}
