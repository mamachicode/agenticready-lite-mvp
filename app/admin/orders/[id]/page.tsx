"use client";

import { useParams } from "next/navigation";
import OrderClient from "@/app/admin/order/OrderClient";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const raw = (params as any)?.id;

  const id =
    typeof raw === "string" ? raw :
    Array.isArray(raw) ? raw[0] :
    "";

  if (!id) {
    return <div className="p-4">Invalid order id.</div>;
  }

  return (
    <div className="p-4">
      <OrderClient id={id} />
    </div>
  );
}
