import OrderClient from "../../order/OrderClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Admin — Fulfill Order</h1>
      <OrderClient id={id} />
    </main>
  );
}
