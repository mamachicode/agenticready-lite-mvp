import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("admin_token")?.value;

  // Allow login page to pass
  const isLogin = typeof window !== "undefined" && window.location.pathname === "/admin/login";

  if (!token && !isLogin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {children}
    </div>
  );
}
