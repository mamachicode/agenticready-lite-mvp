export const runtime = "nodejs";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("admin_token")?.value;
  if (token !== "ok") redirect("/admin/login");
  return <>{children}</>;
}
