import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/account/AuthCard";
import { LoginForm } from "@/components/account/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <AuthCard title="Welcome Back" subtitle="Sign in to your RichKid Decor Store account.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
