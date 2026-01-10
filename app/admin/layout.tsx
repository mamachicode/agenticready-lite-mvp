import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("admin_token")?.value;
  const pathname = headers().get("x-pathname") || "";

  // Allow login page through
  if (!token && !pathname.startsWith("/admin/login")) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {children}
    </div>
  );
}
