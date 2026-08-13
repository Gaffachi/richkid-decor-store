import type { Metadata } from "next";
import { AuthCard } from "@/components/account/AuthCard";
import { RegisterForm } from "@/components/account/RegisterForm";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <AuthCard title="Create Your Account" subtitle="Join RichKid Decor Store to save favourites and track orders.">
      <RegisterForm />
    </AuthCard>
  );
}
