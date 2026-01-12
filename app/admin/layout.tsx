import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("admin_token")?.value;
  const pathname = headers().get("x-pathname") || "";

  // Allow login page without auth
  if (!token && !pathname.startsWith("/admin/login")) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
