import { db } from "@/server"
import { orders } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
    apiVersion: "2024-12-18.acacia",
  })

  // Get the signature
  const sig = req.headers.get("stripe-signature") || ""
  // secret for signature
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

  // Read the request body as text
  const reqText = await req.text()
  // Convert the text to a buffer
  const reqBuffer = Buffer.from(reqText)

  let event

  try {
    // initalize the webhook event using signature and signing secret
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, {
      status: 400,
    })
  }

  // Handle the event just an example!
  switch (event.type) {
    case "payment_intent.succeeded":
      const retrieveOrder = await stripe.paymentIntents.retrieve(
        event.data.object.id,
        { expand: ["latest_charge"] }
      )
      const charge = retrieveOrder.latest_charge as Stripe.Charge

      await db
        .update(orders)
        .set({
          status: "succeeded",
          receiptURL: charge.receipt_url,
        })
        .where(eq(orders.paymentIntentId, event.data.object.id))
        .returning()

      // Then define and call a function to handle the event product.created
      break

    default:
      console.log(`${event.type}`)
  }

  return new Response("ok", { status: 200 })
}
