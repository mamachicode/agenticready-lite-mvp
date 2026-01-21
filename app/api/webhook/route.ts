import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("Missing Stripe signature");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  console.log("WEBHOOK_HIT_V1");
  console.log("Stripe event:", event.id, event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    await prisma.order.upsert({
      where: { stripeSessionId: session.id },
      update: { status: "PAID" },
      create: {
        stripeSessionId: session.id,
        email: session.customer_details?.email ?? "",
        status: "PAID",
        amount: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
      },
    });

    console.log("Order upserted:", session.id);
  }

  return NextResponse.json({ received: true });
}
