export const runtime = "nodejs";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("admin_token")?.value;
  if (token !== "ok") redirect("/admin/login");
  return <>{children}</>;
}
