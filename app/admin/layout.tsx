import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("admin_token")?.value;

  const h = await headers();
  const pathname =
    h.get("x-pathname") ||
    h.get("next-url") ||
    "";

  // Allow login page always
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Gate everything else
  if (!token) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
