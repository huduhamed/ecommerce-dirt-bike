'use client';

import { userOrderExists } from '@/app/actions/orders';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import {
	Elements,
	LinkAuthenticationElement,
	PaymentElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import { FormEvent, useState } from 'react';

type CheckoutFormProps = {
	product: {
		id: string;
		imagePath: string;
		name: string;
		priceInCents: number;
		description: string;
	};
	clientSecret: string;
};

// load stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

// CheckoutForm component
export function CheckoutForm({ product, clientSecret }: CheckoutFormProps) {
	return (
		<div className="w-full max-w-5xl mx-auto space-y-8">
			<div className="flex items-center gap-4">
				<div className="w-1/3 flex-shrink-0 relative aspect-video">
					<Image src={product.imagePath} fill alt={product.name} className="object-cover" />
				</div>
				<div>
					<div className="text-lg">{formatCurrency(product.priceInCents / 100)}</div>
					<h1 className="text-2xl font-bold">{product.name}</h1>
					<div className="text-muted-foreground line-clamp-3">{product.description}</div>
				</div>
			</div>
			<Elements stripe={stripePromise} options={{ clientSecret }}>
				<Form priceInCents={product.priceInCents} productId={product.id} />
			</Elements>
		</div>
	);
}

// Form component
function Form({ priceInCents, productId }: { priceInCents: number; productId: string }) {
	// use stripe and elements
	const stripe = useStripe();
	const elements = useElements();
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>();
	const [email, setEmail] = useState<string>();

	// handle submit
	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		if (stripe == null || elements == null || email == null) return;

		setIsLoading(true);

		// Check for existing order
		const orderExists = await userOrderExists(email, productId);

		// if order exists, show error message
		if (orderExists) {
			setErrorMessage('You already have an order for this product');
			setIsLoading(false);

			return;
		}

		// confirm payment
		stripe
			.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase/success`,
				},
			})
			.then(({ error }) => {
				if (error.type === 'card_error' || error.type === 'validation_error') {
					setErrorMessage(error.message);
				} else {
					setErrorMessage('An unexpected error occurred. Please try again.');
				}
			})
			.finally(() => setIsLoading(false));
	}

	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardHeader>
					<CardTitle>Check out</CardTitle>
					{errorMessage && (
						<CardDescription className="text-destructive">{errorMessage}</CardDescription>
					)}
				</CardHeader>
				<CardContent>
					<PaymentElement />
					<div className="mt-4">
						<LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
					</div>
				</CardContent>
				<CardFooter>
					<Button
						className="w-full"
						size="lg"
						disabled={stripe == null || elements == null || isLoading}
					>
						{isLoading ? 'Purchasing...' : `Purchase - ${formatCurrency(priceInCents / 100)}`}
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}
