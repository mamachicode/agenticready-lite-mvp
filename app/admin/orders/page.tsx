import OrdersClient from "./OrdersClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Admin — Orders</h1>
      <OrdersClient />
    </main>
  );
}
