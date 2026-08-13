"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase/client";
import { establishSession } from "@/lib/auth/client";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { loginSchema } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        parsed.data.email,
        parsed.data.password
      );
      const idToken = await credential.user.getIdToken();
      await establishSession(idToken);
      toast.success("Welcome back!");
      router.push(searchParams.get("redirect") || "/account");
      router.refresh();
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required placeholder="••••••••" />
        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
      </div>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Signing In..." : "Sign In"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&rsquo;t have an account?{" "}
        <Link href="/account/register" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
