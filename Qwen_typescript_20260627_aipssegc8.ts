import { getAuthSession } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  const session = await getAuthSession()
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const { credits } = body // e.g., 100 credits for $10

  const price = credits * 10 // 10 cents per credit

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: session.user.email!,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `${credits} AI Video Credits` },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: session.user.id,
      credits: credits,
    },
  })

  return NextResponse.json({ url: stripeSession.url })
}