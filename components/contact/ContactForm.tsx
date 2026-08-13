"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // Wiring to a server action / Firestore "messages" collection is planned
    // for a later phase — this collects the form shape and gives feedback now.
    setTimeout(() => {
      toast.success("Thanks for reaching out! We'll get back to you shortly.");
      e.currentTarget.reset();
      setSubmitting(false);
    }, 500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" required placeholder="Ama Owusu" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" placeholder="024 000 0000" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us how we can help..."
        />
      </div>

      <Button type="submit" size="lg" className="self-start" disabled={submitting}>
        {submitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
