'use server';
import { Button } from '@/components/ui/button';
import db from '@/db/db';
import { formatCurrency } from '@/lib/formatters';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';

// load stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// page for thank you message for the purchase
export default async function SuccessPage({
	searchParams,
}: {
	searchParams: { payment_intent?: string };
}) {
	// await searchParams
	const searchParamsResolved = await searchParams;

	const paymentIntentId = await searchParamsResolved.payment_intent;

	if (!paymentIntentId) {
		return notFound();
	}

	// retrieve payment intent
	const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

	// if payment intent is null, return 404
	if (paymentIntent?.metadata?.productId == null) return notFound();

	// retrieve product by id
	const product = await db.product.findUnique({ where: { id: paymentIntent.metadata.productId } });

	// if product is null, return 404
	if (product == null) return notFound();

	// check if payment intent is successful
	const isSuccess = paymentIntent.status === 'succeeded';

	return (
		<div className="w-full max-w-5xl mx-auto space-y-8">
			<h1 className="font-bold text-3xl">{isSuccess ? 'Purchase Successful' : 'Error'}</h1>
			<div className="flex items-center gap-4">
				<div className="w-1/3 flex-shrink-0 relative aspect-video">
					<Image src={product.imagePath} fill alt={product.name} className="object-cover" />
				</div>
				<div>
					<div className="text-lg">{formatCurrency(product.priceInCents / 100)}</div>
					<h1 className="text-2xl font-bold">{product.name}</h1>
					<div className="text-muted-foreground line-clamp-3">{product.description}</div>
					<Button asChild className="mt-4" size="lg">
						{isSuccess ? (
							<a href={`/products/download/${await createDownloadVerification(product.id)}`}>
								Download product
							</a>
						) : (
							<Link href={`/products/${product.id}/purchase`}>Try Again</Link>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}

// create download verification
async function createDownloadVerification(productId: string) {
	return (
		await db.downloadVerification.create({
			data: { productId, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) },
		})
	).id;
}
