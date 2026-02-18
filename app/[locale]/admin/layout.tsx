import AdminSidebar from "@/app/components/AdminSidebar";
import DashboardTour from "@/app/components/DashboardTour";
import prisma from "@/app/utils/db";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    redirect(`/${locale}/setup`);
  }
  return (
    <div className="flex bg-[#f8fafc] min-h-screen font-sans selection:bg-primary/10">
      <AdminSidebar />
      <DashboardTour />
      <main className="flex-1 ms-72 transition-all min-w-0">
        <div className="p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
