import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("admin_token")?.value;

  // Allow login page without auth
  if (!token && typeof window !== "undefined") return <>{children}</>;

  if (token !== "ok") redirect("/admin/login");

  return <>{children}</>;
}
