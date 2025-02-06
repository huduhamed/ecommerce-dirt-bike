import db from '@/db/db';
import { PageHeader } from '../_components/PageHeader';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { DeleteDropdownItem } from './_components/OrderActions';

// get orders
function getOrders() {
	return db.order.findMany({
		select: {
			id: true,
			pricePaidInCents: true,
			product: { select: { name: true } },
			user: { select: { email: true } },
		},
		orderBy: { createdAt: 'desc' },
	});
}

// order page, admin facing
export default function OrdersPage() {
	return (
		<>
			<PageHeader>Sales</PageHeader>
			<OrdersTable />
		</>
	);
}

// render orders
async function OrdersTable() {
	const orders = await getOrders();

	if (orders.length === 0) return <p>No Sales</p>;

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Product</TableHead>
					<TableHead>Customer</TableHead>
					<TableHead>Price Paid</TableHead>
					<TableHead className="w-0">
						<span className="sr-only">Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{orders.map((order) => (
					<TableRow key={order.id}>
						<TableCell>{order.product.name}</TableCell>
						<TableCell>{order.user.email}</TableCell>
						<TableCell>{formatCurrency(order.pricePaidInCents / 100)}</TableCell>
						<TableCell className="text-center">
							<DropdownMenu>
								<DropdownMenuTrigger>
									<MoreVertical />
									<span className="sr-only">Actions</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DeleteDropdownItem id={order.id} />
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
