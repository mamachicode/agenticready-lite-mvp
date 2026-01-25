import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

function normalizeWebsite(url: string) {
  let value = url.trim();
  if (!value.startsWith("http://") && !value.startsWith("https://")) {
    value = `https://${value}`;
  }
  return value.replace(/\/$/, "");
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("WEBHOOK_SIGNATURE_ERROR", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const customFields = session.custom_fields || [];

    const websiteField = customFields.find(
      (f) => f.key === "website"
    );

    const rawWebsite = websiteField?.text?.value || null;

    const normalizedWebsite = rawWebsite
      ? normalizeWebsite(rawWebsite)
      : null;

    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        email: session.customer_details?.email || "",
        websiteUrl: normalizedWebsite,
        amount: session.amount_total || 0,
        currency: session.currency || "usd",
        status: "PAID",
      },
    });
  }

  return NextResponse.json({ received: true });
}
