import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const DELIVERY_OPTIONS = {
  standard: {
    label: "Standard Delivery",
    description: "3–5 working days",
    price: 399, // pence
    free_threshold: 2500, // pence — free over £25
  },
  express: {
    label: "Express Delivery",
    description: "1–2 working days",
    price: 699, // pence
    free_threshold: null, // never free
  },
} as const;

export type DeliveryMethod = keyof typeof DELIVERY_OPTIONS;

export function calcDeliveryCost(method: DeliveryMethod, subtotalPence: number): number {
  const option = DELIVERY_OPTIONS[method];
  if (option.free_threshold && subtotalPence >= option.free_threshold) return 0;
  return option.price;
}
