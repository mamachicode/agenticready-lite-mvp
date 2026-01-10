import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">AgenticReady — Internal Admin</h1>

      <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 max-w-xl">
        <p className="mb-4 text-zinc-400">
          This is the internal operator console for fulfilling paid customer orders.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/admin/orders"
            className="bg-white text-black px-4 py-2 rounded hover:bg-zinc-200 transition"
          >
            View Paid Orders
          </Link>

          <div className="text-xs text-zinc-500">
            Engine: Locked • Webhooks: Live • Fulfillment: Manual Operator
          </div>
        </div>
      </div>
    </div>
  );
}
