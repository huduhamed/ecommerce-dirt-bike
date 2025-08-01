import { formatCurrency } from '@/lib/formatters';
import { Button, Column, Img, Row, Section, Text } from '@react-email/components';

type OrderInformationProps = {
	order: { id: string; createdAt: Date; pricePaidInCents: number };
	product: { imagePath: string; name: string; description: string };
	downloadVerificationId: string;
};

// define date formatter
const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

// orderinfo component, react email
export function OrderInformation({
	order,
	product,
	downloadVerificationId,
}: OrderInformationProps) {
	return (
		<>
			<Section>
				<Row>
					<Column>
						<Text className="text-nowrap whitespace-nowrap mb-0 text-gray-500">Order ID</Text>
						<Text className="mt-0 mr-4">{order.id}</Text>
					</Column>
					<Column>
						<Text className="text-nowrap whitespace-nowrap mb-0 text-gray-500">Date Purchased</Text>
						<Text className="mt-0 mr-4">{dateFormatter.format(order.createdAt)}</Text>
					</Column>
					<Column>
						<Text className="text-nowrap whitespace-nowrap mb-0 text-gray-500">Price Paid</Text>
						<Text className="mt-0 mr-4">{formatCurrency(order.pricePaidInCents / 100)}</Text>
					</Column>
				</Row>
			</Section>
			<Section className="border border-solid border-gray-500 my-4 md:p-6 p-4 rounded-lg">
				<Img
					alt={product.name}
					width="100%"
					src={
						process.env.NEXT_PUBLIC_SERVER_URL
							? `${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}`
							: product.imagePath // Fallback to absolute path if needed
					}
				/>
				<Row className="mt-8">
					<Column className="align-bottom">
						<Text className="text-lg font-bold m-0 mr-4">{product.name}</Text>
					</Column>
					<Column align="right">
						<Button
							href={`${process.env.NEXT_PUBLIC_SERVER_URL}/products/download${downloadVerificationId}`}
							className="bg-black text-white px-6 py-4 rounded text-lg"
						>
							Download
						</Button>
					</Column>
				</Row>
				<Row>
					<Column>
						<Text className="text-gray-500 mb-0">{product.description}</Text>
					</Column>
				</Row>
			</Section>
		</>
	);
}
