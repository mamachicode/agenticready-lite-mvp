import { getOrderById } from "@/lib/adminOrders";

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);

  if (!order) return <div>Order not found</div>;

  return (
    <div>
      <h1>Order Fulfillment</h1>
      <p>Email: {order.email}</p>
      <p>Status: {order.status}</p>
      <p>Amount: {order.amount} {order.currency}</p>

      {order.reportS3Key ? (
        <p>Report uploaded</p>
      ) : (
        <form action="/api/admin/upload" method="POST" encType="multipart/form-data">
          <input type="hidden" name="orderId" value={order.id} />
          <input type="file" name="file" accept="application/pdf" required />
          <button type="submit">Upload PDF</button>
        </form>
      )}
    </div>
  );
}
