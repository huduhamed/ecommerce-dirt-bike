import { Body, Container, Head, Heading, Html, Preview, Tailwind } from '@react-email/components';
import { OrderInfomation } from './components/OrderInformation';

type PurchaseReceiptEmailProps = {
	product: { name: string; imagePath: string };
	order: { id: string; createdAt: Date; pricePaidInCents: number };
	downloadVerificationId: string;
};

PurchaseReceiptEmail.PreviewProps = {
	product: {
		name: 'Product name',
		imagePath: '/products/42a72a02-7465-4df6-b1dc-183d72851fa4-headsets3.png',
	},
	order: {
		id: crypto.randomUUID(),
		createdAt: new Date(),
		pricePaidInCents: 25000,
	},
	downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps;

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
						<OrderInfomation
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
