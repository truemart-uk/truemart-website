import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | TrueMart",
  description: "Find answers to common questions about TrueMart — orders, delivery, returns, payments and more.",
};

export default function FAQsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
