import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Tailwind,
} from '@react-email/components';
import { OrderInformation } from './components/OrderInformation';
import React from 'react';

type OrderHistoryEmailProps = {
	orders: {
		id: string;
		pricePaidInCents: number;
		createdAt: Date;
		downloadVerificationId: string;
		product: { name: string; imagePath: string; description: string };
	}[];
};

OrderHistoryEmail.PreviewProps = {
	orders: [
		{
			id: crypto.randomUUID(),
			createdAt: new Date(),
			pricePaidInCents: 25000,
			downloadVerificationId: crypto.randomUUID(),
			product: {
				name: 'Product name',
				description: 'Product description',
				imagePath:
					'http://localhost:3000/products/42a72a02-7465-4df6-b1dc-183d72851fa4-headsets3.png',
			},
		},
		{
			id: crypto.randomUUID(),
			createdAt: new Date(),
			pricePaidInCents: 30000,
			downloadVerificationId: crypto.randomUUID(),
			product: {
				name: 'Product name 2',
				description: 'recent product description',
				imagePath:
					'http://localhost:3000/products/3d620458-6f60-4ff1-a6cf-124559d95eef-dadjokes.jpg',
			},
		},
	],
} satisfies OrderHistoryEmailProps;

// order history component
export default function OrderHistoryEmail({
	orders,
	product,
	order,
	downloadVerificationId,
}: OrderHistoryEmailProps) {
	return (
		<Html>
			<Preview>Order History and downloads</Preview>
			<Tailwind>
				<Head />
				<Body className="font-sans bg-white">
					<Container className="max-w-xl">
						<Heading>Order History</Heading>
						{orders.map((order, index) => (
							<React.Fragment key={order.id}>
								<OrderInformation
									order={order}
									product={order.product}
									downloadVerificationId={order.downloadVerificationId}
								/>
								{index < orders.length - 1 && <Hr />}
							</React.Fragment>
						))}
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
