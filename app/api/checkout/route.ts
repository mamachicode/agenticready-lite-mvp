import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

function normalizeUrl(input: string) {
  let url = input.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url.replace(/\/$/, "");
}

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover",
  });

  const { email, amount, currency, websiteUrl } = await req.json();

  if (!websiteUrl || typeof websiteUrl !== "string") {
    return NextResponse.json(
      { error: "Website URL is required" },
      { status: 400 }
    );
  }

  const normalizedUrl = normalizeUrl(websiteUrl);

  const rawBase = process.env.APP_URL!;
  const baseUrl = rawBase.startsWith("http")
    ? rawBase
    : `https://${rawBase}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: email,
    metadata: {
      websiteUrl: normalizedUrl,
    },
    line_items: [
      {
        price_data: {
          currency,
          product_data: { name: "AgenticReady Audit Report" },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel`,
  });

  await prisma.order.create({
    data: {
      email,
      amount,
      currency,
      status: "PENDING",
      stripeSessionId: session.id,
      websiteUrl: normalizedUrl,
    },
  });

  return NextResponse.json({ url: session.url });
}
