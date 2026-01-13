export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Page({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/orders/${params.id}/report`, { cache: "no-store" });
  if (!res.ok) return <div className="p-10">Failed to load order</div>;
  const order = await res.json();

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-semibold">Order Detail</h1>

      <div className="space-y-2">
        <div><b>ID:</b> {order.id}</div>
        <div><b>Email:</b> {order.email}</div>
        <div><b>Status:</b> {order.status}</div>
      </div>

      <form method="POST" encType="multipart/form-data"
            action={`/api/admin/orders/${order.id}/upload`}>
        <input type="file" name="file" required />
        <button className="ml-2 px-3 py-1 bg-black text-white rounded">Upload PDF</button>
      </form>

      <form method="POST" action={`/api/admin/orders/${order.id}/fulfill`}>
        <button className="px-3 py-1 bg-green-700 text-white rounded">
          Mark Fulfilled
        </button>
      </form>
    </div>
  );
}
