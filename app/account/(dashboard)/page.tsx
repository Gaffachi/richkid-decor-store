import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null; // Layout already redirects; this satisfies TypeScript.

  const fields = [
    { label: "Full Name", value: user.name },
    { label: "Email", value: user.email },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-heading text-xl text-foreground">Profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">Your account details.</p>

      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="rounded-lg border border-border/70 p-4">
            <dt className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              {field.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">{field.value || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
