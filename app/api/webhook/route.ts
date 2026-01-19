import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover",
  });

  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;

    await prisma.order.upsert({
      where: { stripeSessionId: session.id },
      update: { status: "PAID" },
      create: {
        stripeSessionId: session.id,
        status: "PAID",
        email: customerEmail || "unknown"
      }
    });

    // Future step: trigger SES email send here
    // await sendAuditEmail(customerEmail);
  }

  return NextResponse.json({ received: true });
}
