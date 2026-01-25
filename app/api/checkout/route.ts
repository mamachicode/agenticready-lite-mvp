import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "AgenticReady Lite Audit",
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.APP_URL}/success`,
      cancel_url: `${process.env.APP_URL}/cancel`,

      custom_fields: [
        {
          key: "website",
          label: {
            type: "custom",
            custom: "Website to Audit",
          },
          type: "text",
          optional: false,
        },
      ],
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("CHECKOUT_ERROR", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
