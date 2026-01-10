import { prisma } from "@/lib/prisma";

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const o = await prisma.order.findUnique({ where: { id: params.id } });

  return (
    <div>
      <h1 className="text-xl mb-4">{o?.email}</h1>

      <form action="/api/admin/upload" method="POST" encType="multipart/form-data">
        <input type="hidden" name="orderId" value={o?.id} />
        <input type="file" name="file" required />
        <button className="bg-black text-white px-4 py-2 ml-2">Upload PDF</button>
      </form>

      <form action="/api/admin/fulfill" method="POST" className="mt-4">
        <input type="hidden" name="orderId" value={o?.id} />
        <button className="bg-green-600 text-white px-4 py-2">Mark Fulfilled</button>
      </form>
    </div>
  );
}
