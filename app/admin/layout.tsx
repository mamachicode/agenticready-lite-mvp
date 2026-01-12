export const runtime = "nodejs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="p-6 bg-gray-100 min-h-screen">{children}</div>;
}
