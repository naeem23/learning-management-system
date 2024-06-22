import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req, {params}) {
    try {
        const user = await currentUser();

        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const course = await prismadb.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true,
            }
        });

        const purchase = await prismadb.purchase.findUnique({
            where:{
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId,
                }
            }
        });

        if (purchase) {
            return new NextResponse("Already purchased", {status: 400});
        }

        if (!course) {
            return new NextResponse("Not found", {status: 404});
        }

        const line_items = [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: course.title,
                        description: course.description,
                    },
                    unit_amount: Math.round(course.price * 100),
                }
            }
        ];

        let stripeCustomer = await prismadb.stripeCustomer.findUnique({
            where: {
                userId: user.id
            },
            select: {
                stripeCustomerId: true,
            }
        });

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress
            });

            stripeCustomer = await prismadb.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                }
            });
        }

        console.log(stripeCustomer)

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
            metadata: {
                courseId: course.id,
                userId: user.id
            }
        });

        return NextResponse.json({url: session.url});
    } catch (error) {
        console.log("COURSEID_CHECKOUT_ERROR", error);
        return new NextResponse("Internal error", {status: 500})
    }
}