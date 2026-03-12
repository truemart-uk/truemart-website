import type { Metadata } from "next";
import CategoryHero from "@/components/CategoryHero";

export const metadata: Metadata = {
  title: "Books | TrueMart — Spiritual & Cultural Books UK",
  description:
    "Shop authentic Indian spiritual books, children's books, and wellness guides at TrueMart UK. Free delivery over £25.",
};

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CategoryHero
        emoji="📚"
        label="Books Collection"
        title="Spiritual & Cultural Books"
        description="Devotional texts, children's books, and wellness guides — curated for Indian families in the UK."
        message="🎉 Free delivery on all orders over £25"
        messageStyle="orange"
      />
      {children}
    </>
  );
}
