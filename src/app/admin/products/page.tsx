import { Button } from '@/components/ui/button';
import { PageHeader } from '../_components/PageHeader';
import Link from 'next/link';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import db from '@/db/db';
import { CheckCircle2, MoreVertical, XCircle } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActiveToggleDropdownItem, DeleteDropdownItem } from './_components/ProductActions';

// admin product page
export default function AdminProductsPage() {
	return (
		<>
			<div className="flex items-center justify-between gap-4">
				<PageHeader>Products</PageHeader>
				<Button asChild>
					<Link href="/admin/products/new">Add Product</Link>
				</Button>
			</div>
			<ProductsTable />
		</>
	);
}

// dynamically render product
async function ProductsTable() {
	const products = await db.product.findMany({
		select: {
			id: true,
			name: true,
			priceInCents: true,
			isAvailableForPurchase: true,
			_count: {
				select: {
					orders: true,
				},
			},
		},
		orderBy: { name: 'asc' },
	});

	if (products.length === 0) return <p>No product at the moment</p>;

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-0">
						<span className="sr-only">Available For Purchase</span>
					</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Price</TableHead>
					<TableHead>Orders</TableHead>
					<TableHead className="w-0">
						<span className="sr-only">Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{products.map((product) => (
					<TableRow key={product.id}>
						<TableCell>
							{product.isAvailableForPurchase ? (
								<>
									<span className="sr-only">Available</span>
									<CheckCircle2 className="stroke-green-600" />
								</>
							) : (
								<>
									<span className="sr-only">Unavailable</span>
									<XCircle className="stroke-destructive" />
								</>
							)}
						</TableCell>
						<TableCell>{product.name}</TableCell>
						<TableCell>{formatCurrency(product.priceInCents / 100)}</TableCell>
						<TableCell>{formatNumber(product._count.orders)}</TableCell>
						<TableCell>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<MoreVertical />
									<span className="sr-only">actions</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem asChild>
										<a download href={`/admin/products/${product.id}/download`}>
											Download
										</a>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
									</DropdownMenuItem>
									<ActiveToggleDropdownItem
										id={product.id}
										isAvailableforPurchase={product.isAvailableForPurchase}
									/>
									<DropdownMenuSeparator />
									<DeleteDropdownItem id={product.id} disabled={product._count.orders > 0} />
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
