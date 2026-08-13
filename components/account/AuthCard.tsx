export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <span className="font-heading text-2xl text-foreground">
          RichKid<span className="text-primary">Decor</span>
        </span>
        <h1 className="mt-4 font-heading text-2xl text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">{children}</div>
    </div>
  );
}
