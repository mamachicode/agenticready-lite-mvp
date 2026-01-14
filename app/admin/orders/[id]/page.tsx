export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import ClientForms from "./ClientForms";

export default async function Page() {
  const token = (await cookies()).get("admin_token")?.value;
  if (token !== "ok") redirect("/admin/login");

  const path = (await headers()).get("x-pathname") || "";
  const id = path.split("/").pop() || null;

  if (!id) return <div className="p-10">Invalid order id</div>;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return <div className="p-10">Order not found</div>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-semibold">Order Detail</h1>

      <div className="space-y-2">
        <div><b>ID:</b> {order.id}</div>
        <div><b>Email:</b> {order.email}</div>
        <div><b>Status:</b> {order.status}</div>
      </div>

      <ClientForms id={order.id} />
    </div>
  );
}
