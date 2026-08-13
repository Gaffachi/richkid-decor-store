import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export default async function AccountDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login?redirect=/account");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="mb-8 font-heading text-3xl text-foreground sm:text-4xl">My Account</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <AccountSidebar user={user} />
        <div>{children}</div>
      </div>
    </div>
  );
}
