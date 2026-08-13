"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase/client";
import { establishSession } from "@/lib/auth/client";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { registerUserProfile } from "@/lib/actions/auth";
import { registerSchema } from "@/lib/validations/auth";

export function RegisterForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const parsed = registerSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
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
      const credential = await createUserWithEmailAndPassword(
        auth,
        parsed.data.email,
        parsed.data.password
      );
      const idToken = await credential.user.getIdToken();

      const profileResult = await registerUserProfile({
        idToken,
        name: parsed.data.name,
        phone: parsed.data.phone,
      });
      if (!profileResult.ok) {
        toast.error(profileResult.error);
        setSubmitting(false);
        return;
      }

      await establishSession(idToken);
      toast.success(`Welcome to RichKid Decor Store, ${parsed.data.name.split(" ")[0]}!`);
      router.push("/account");
      router.refresh();
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" required placeholder="Ama Owusu" />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone" type="tel" required placeholder="024 000 0000" />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required placeholder="At least 8 characters" />
        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
      </div>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Creating Account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/account/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
