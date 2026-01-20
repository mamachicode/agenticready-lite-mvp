import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page(props: { 
  searchParams: Promise<{ id?: string }> 
}) {
  const { id } = await props.searchParams;

  if (!id) return <div>Invalid order id</div>;

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) return notFound();

  // Use the 'status' field confirmed by the TS error
  const isFulfilled = order.status === 'FULFILLED';

  return (
    <div className="p-10 space-y-6 max-w-4xl mx-auto text-gray-900">
      <Link href="/admin/orders" className="text-blue-600 hover:underline flex items-center gap-2 mb-4">
        ← Back to Orders
      </Link>

      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">Order Detail</h1>
        {isFulfilled ? (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-400">
            Fulfilled
          </span>
        ) : (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-yellow-400">
            Pending
          </span>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Order ID:</strong> <code className="text-sm bg-gray-100 px-1">{order.id}</code></p>
          <p><strong>Customer:</strong> {order.email}</p>
          <p><strong>Amount:</strong> {(order.amount / 100).toLocaleString('en-US', { style: 'currency', currency: order.currency })}</p>
          <p><strong>Created:</strong> {order.createdAt.toLocaleDateString()}</p>
        </div>
      </div>
      
      {/* Existing Upload/Action UI below */}
    </div>
  );
}
