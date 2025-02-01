import { Body, Container, Head, Heading, Html, Preview, Tailwind } from '@react-email/components';

type PurchaseReceiptEmailProps = {
	product: {
		name: string;
		imagePath: string;
		description: string;
	};
	order: {
		id: string;
		createdAt: Date;
		pricePaidInCents: number;
	};
	downloadVerificationId: string;
};

export function PurchaseReceiptEmail({
	product,
	// order,
	// downloadVerificationId,
}: PurchaseReceiptEmailProps) {
	return (
		<Html>
			<Preview>Download {product.name} and view receipt</Preview>
			<Tailwind>
				<Head />
				<Body className="font-sans bg-white">
					<Container className="max-w-xl">
						<Heading>Purchase Receipt</Heading>
						{/* <OrderInfomation /> */}
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
