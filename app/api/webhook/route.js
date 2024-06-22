import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST (req) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature");

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET,
        )
    } catch (error) {
        return new NextResponse(`Webhook Error: ${error.message}`, {status: 400});
    }

    const session = event.data.object;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (event.type === 'checkout.session.completed') {
        if (!userId || !courseId) {
            return new NextResponse(`Webhook Error: Mising metadata`, {status: 400});
        }

        await prismadb.purchase.create({
            data: {
                courseId,
                userId
            }
        });
    } else {
        return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, {status: 200});
    }

    return new NextResponse(null, {status: 200});
}