import { Body, Container, Head, Heading, Html, Preview, Tailwind } from '@react-email/components';
import { OrderInformation } from './components/OrderInformation';

type PurchaseReceiptEmailProps = {
	product: { name: string; imagePath: string; description: string };
	order: { id: string; createdAt: Date; pricePaidInCents: number };
	downloadVerificationId: string;
};

// preview email details
PurchaseReceiptEmail.PreviewProps = {
	product: {
		name: 'Product name',
		description: 'Product description',
		imagePath: 'http://localhost:3000/products/42a72a02-7465-4df6-b1dc-183d72851fa4-headsets3.png',
	},
	order: {
		id: crypto.randomUUID(),
		createdAt: new Date(),
		pricePaidInCents: 25000,
	},
	downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps;

// purchase receipt component
export default function PurchaseReceiptEmail({
	product,
	order,
	downloadVerificationId,
}: PurchaseReceiptEmailProps) {
	return (
		<Html>
			<Preview>Download {product.name} and view receipt</Preview>
			<Tailwind>
				<Head />
				<Body className="font-sans bg-white">
					<Container className="max-w-xl">
						<Heading>Purchase Receipt</Heading>
						<OrderInformation
							order={order}
							product={product}
							downloadVerificationId={downloadVerificationId}
						/>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
