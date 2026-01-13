export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "iad1";
export const fetchCache = "force-no-store";
export const revalidate = 0;


export const dynamic = "force-dynamic";
export const preferredRegion = "iad1";
export const fetchCache = "force-no-store";

import { fetchAdminOrder } from "./actions";

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await fetchAdminOrder(params.id);

  if (!order) return <div className="p-10">Order not found</div>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-semibold">Order {order.id}</h1>

      <div className="space-y-1">
        <p>Status: {order.status}</p>
        <p>Email: {order.email}</p>
      </div>

      <div className="space-y-3">
        <form
          action={`/api/admin/orders/${order.id}/upload`}
          method="post"
          encType="multipart/form-data"
        >
          <input type="file" name="file" required />
          <button className="ml-2 px-3 py-1 bg-black text-white rounded" type="submit">
            Upload PDF
          </button>
        </form>

        <form action={`/api/admin/orders/${order.id}/fulfill`} method="post">
          <button className="px-3 py-1 bg-green-700 text-white rounded" type="submit">
            Mark Fulfilled
          </button>
        </form>
      </div>
    </div>
  );
}
