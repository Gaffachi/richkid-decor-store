import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login?redirect=/admin");
  if (user.role !== "admin") redirect("/");

  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[240px_1fr]">
      <div className="hidden lg:block">
        <AdminSidebar user={user} />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3 lg:hidden">
          <AdminMobileNav />
          <span className="font-heading text-base text-foreground">Admin</span>
        </div>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
