import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("admin_token")?.value;

  const h = await headers();
  const pathname =
    h.get("x-pathname") ||
    h.get("next-url") ||
    "/admin";

  // Only gate non-login admin pages
  if (!token && pathname.startsWith("/admin") && pathname !== "/admin/login") {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
