import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    where: {
      status: "PAID",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return (
    <div>
      <h1>Paid Orders</h1>
      <pre>{JSON.stringify(orders, null, 2)}</pre>
    </div>
  );
}
