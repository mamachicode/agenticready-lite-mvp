import Stripe from "stripe";
import { APP_ENV } from "@/lib/startup-log";

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (APP_ENV !== "production") {
    console.log("[stripe] skipped (non-production)");
    return null;
  }

  const key = process.env.STRIPE_LIVE_SECRET_KEY;

  if (!key) {
    throw new Error("[stripe] missing STRIPE_LIVE_SECRET_KEY in production");
  }

  if (!stripe) {
    console.log("[stripe] initializing live client");
    stripe = new Stripe(key, {
      apiVersion: "2025-12-15.clover",
    });
  }

  return stripe;
}
