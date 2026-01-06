import AdminSidebar from "@/app/components/AdminSidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 ms-64 transition-all">
        {children}
      </main>
    </div>
  );
}
