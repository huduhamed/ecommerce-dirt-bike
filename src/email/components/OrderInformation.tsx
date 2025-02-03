import { formatCurrency } from '@/lib/formatters';
import { Column, Img, Row, Section, Text } from '@react-email/components';

type OrderInformationProps = {
	order: { id: string; createdAt: Date; pricePaidInCents: number };
	product: { imagePath: string; name: string };
	downloadVerificationId: string;
};

// define date formatter
const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

// orderinfo component, react email
export function OrderInfomation({ order, product, downloadVerificationId }: OrderInformationProps) {
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
					src={`${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}`}
					alt={product.name}
					width="100%"
				/>
			</Section>
		</>
	);
}
