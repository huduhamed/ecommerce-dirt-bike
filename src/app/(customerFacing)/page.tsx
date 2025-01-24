import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

// internal imports
import { ProductCard, ProductCardSkeleton } from '../../components/ProductCard';
import { Button } from '@/components/ui/button';
import { Product } from '@prisma/client';
import db from '@/db/db';

// This function should return the 5 most popular products
function getMostPopularProducts() {
	return db.product.findMany({
		where: { isAvailableForPurchase: true },
		orderBy: { orders: { _count: 'desc' } },
		take: 5,
	});
}

// This function should return the 5 newest products
function getNewestProducts() {
	return db.product.findMany({
		where: { isAvailableForPurchase: true },
		orderBy: { createdAt: 'desc' },
		take: 5,
	});
}

// This component should render the home page
export default function HomePage() {
	return (
		<main className="space-y-12">
			<ProductGridSection title="Most Popular" productsFetcher={getMostPopularProducts} />
			<ProductGridSection title="Newest" productsFetcher={getNewestProducts} />
		</main>
	);
}

type ProductGridSectionProps = {
	title: string;
	productsFetcher: () => Promise<Product[]>;
};

// This component should render a grid of products
function ProductGridSection({ title, productsFetcher }: ProductGridSectionProps) {
	return (
		<div className="space-y-4">
			<div className="flex gap-4">
				<h2 className="font-bold text-3xl">{title}</h2>
				<Button asChild variant="outline">
					<Link href="/products" className="space-x-2">
						<span>View All</span>
						<ArrowRight className="size-4" />
					</Link>
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Suspense
					fallback={
						<>
							<ProductCardSkeleton />
							<ProductCardSkeleton />
						</>
					}
				>
					<ProductSuspense productsFetcher={productsFetcher} />
				</Suspense>
			</div>
		</div>
	);
}

// add suspense to the ProductGridSection component to handle loading states
async function ProductSuspense({ productsFetcher }: { productsFetcher: () => Promise<Product[]> }) {
	return (await productsFetcher()).map((product) => <ProductCard key={product.id} {...product} />);
}
