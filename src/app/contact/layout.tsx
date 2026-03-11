import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | TrueMart",
  description: "Get in touch with TrueMart. We're here to help with orders, deliveries, returns and any other questions.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
