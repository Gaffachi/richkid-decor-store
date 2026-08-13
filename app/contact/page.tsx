import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with RichKid Decor Store — questions, custom orders, or support.",
};

const details = [
  { icon: MapPin, label: "Visit", value: "Accra, Ghana" },
  { icon: Phone, label: "Call or WhatsApp", value: "+233 20 000 0000" },
  { icon: Mail, label: "Email", value: "hello@richkiddecor.store" },
  { icon: Clock, label: "Hours", value: "Mon – Sat, 9am – 6pm GMT" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-2 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
          We&rsquo;d Love to Hear From You
        </span>
        <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Contact Us</h1>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-6">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
