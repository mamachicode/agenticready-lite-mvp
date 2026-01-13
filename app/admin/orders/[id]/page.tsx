export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "iad1";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { fetchAdminOrder, uploadReport, fulfillOrder } from "./actions";

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await fetchAdminOrder(params.id);

  if (!order) return <div className="p-8">Order not found</div>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-xl font-bold">Order {order.id}</h1>
      <div>Email: {order.email}</div>
      <div>Status: {order.status}</div>

      <form action={uploadReport.bind(null, order.id)} className="flex items-center space-x-2">
        <input type="file" name="file" required />
        <button type="submit" className="px-3 py-1 bg-black text-white rounded">
          Upload PDF
        </button>
      </form>

      <form action={fulfillOrder.bind(null, order.id)}>
        <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">
          Mark Fulfilled
        </button>
      </form>
    </div>
  );
}
