import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Information | TrueMart",
  description: "TrueMart delivers across the UK via Royal Mail Tracked 48 and Tracked 24. Free delivery on orders over £25.",
};

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
