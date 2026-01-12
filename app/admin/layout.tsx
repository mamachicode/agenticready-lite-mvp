import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("admin_token")?.value;

  // Next sets `next-url` for App Router requests on Vercel; fallback to "/admin"
  const nextUrl = (await headers()).get("next-url") || "/admin";

  // Allow login page without auth
  if (!token && nextUrl.startsWith("/admin") && !nextUrl.startsWith("/admin/login")) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
