import db from '@/db/db';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

// create a new instance of the Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// create a resend object
const resend = new Resend(process.env.RESEND_API_KEY as string);

// POST /api/webhooks/stripe
export async function POST(req: NextRequest) {
	const event = stripe.webhooks.constructEvent(
		await req.text(),
		req.headers.get('stripe-signature') as string,
		process.env.STRIPE_WEBHOOK_SECRET as string
	);

	// handle the event
	if (event.type === 'charge.succeeded') {
		const charge = event.data.object;
		const productId = charge.metadata.productId;
		const email = charge.billing_details.email;
		const pricePaidInCents = charge.amount;

		// make sure product exists
		const product = await db.product.findUnique({ where: { id: productId } });
		if (product == null || email == null) {
			return new NextResponse('bad request', { status: 400 });
		}

		// create user and order fields
		const userFields = {
			email,
			orders: {
				create: {
					productId,
					pricePaidInCents,
				},
			},
		};

		// upsert user and create an order
		const {
			orders: [order],
		} = await db.user.upsert({
			where: { email },
			create: userFields,
			update: userFields,
			select: { orders: { orderBy: { createdAt: 'desc' }, take: 1 } },
		});

		// create a download verification
		const downloadVerification = await db.downloadVerification.create({
			data: {
				productId,
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
			},
		});

		// send email
		await resend.emails.send({
			from: `Support <${process.env.SENDER_EMAIL}>`,
			to: email,
			subject: 'Order Confirmation',
			react: <h1>Hello, thank you for your purchase!</h1>,
		});
	}

	// return a response
	return new NextResponse();
}
