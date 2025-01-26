import db from '@/db/db';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';
import { CheckoutForm } from './_components/CheckoutForm';

// create stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({ params: { id } }: { params: { id: string } }) {
	// fetch product
	const product = await db.product.findUnique({ where: { id } });

	// if product does not exist, return notfound.
	if (product == null) return notFound();

	// create payment intent
	const paymentIntent = await stripe.paymentIntents.create({
		amount: product.priceInCents,
		currency: 'EUR',
		metadata: {
			productId: product.id,
		},
	});

	// if payment intent is not created, throw error
	if (paymentIntent.client_secret == null) {
		throw Error('Stripe failed to create payment');
	}

	return <CheckoutForm product={product} clientSecret={paymentIntent.client_secret} />;
}
