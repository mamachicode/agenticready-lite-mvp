import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OrdersClient from "./OrdersClient";

export const runtime = "nodejs";

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    redirect("/admin/login");
  }

  return <OrdersClient />;
}
