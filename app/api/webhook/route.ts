import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { normalizeWebsite } from "@/lib/normalizeWebsite";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("WEBHOOK_SIGNATURE_ERROR", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("WEBHOOK_SESSION_FULL_START");
    console.log(JSON.stringify(session, null, 2));
    console.log("WEBHOOK_SESSION_FULL_END");

    // Deterministic key-based extraction (Payment Link)
    const rawUrl =
      session.custom_fields
        ?.find(f => f.key === "websitetoaudit")
        ?.text?.value ?? "";

    const websiteUrl =
      rawUrl && typeof rawUrl === "string"
        ? normalizeWebsite(rawUrl)
        : null;

    try {
      await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          email: session.customer_details?.email || "",
          amount: session.amount_total || 0,
          currency: session.currency || "usd",
          websiteUrl: websiteUrl,
          status: "PAID",
        },
      });

      return NextResponse.json({ received: true });
    } catch (dbError) {
      console.error("DATABASE_PERSISTENCE_ERROR", dbError);
      return new NextResponse("Database Error", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
