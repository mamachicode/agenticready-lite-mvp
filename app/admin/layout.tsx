import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const token = cookieStore.get("admin_token")?.value;
  const pathname = headerStore.get("x-pathname") || "";

  // Allow login page without auth
  if (!token && !pathname.startsWith("/admin/login")) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
