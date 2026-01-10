import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("admin_token")?.value;
  if (!token) redirect("/admin/login");
  return <div className="min-h-screen p-6 bg-gray-100">{children}</div>;
}
