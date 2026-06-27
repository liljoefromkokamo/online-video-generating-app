import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature")!

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const metadata = session.metadata!
    
    await prisma.user.update({
      where: { id: metadata.userId },
      data: { credits: { increment: parseInt(metadata.credits) } },
    })

    await prisma.transaction.create({
      data: {
        amount: session.amount_total!,
        credits: parseInt(metadata.credits),
        status: "COMPLETED",
        userId: metadata.userId,
      },
    })
  }

  return new NextResponse(null, { status: 200 })
}