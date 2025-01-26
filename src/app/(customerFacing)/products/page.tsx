import db from '@/db/db';
import { Suspense } from 'react';

// internal imports
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { cache } from '@/lib/cache';

// fetches products, is cached
const getProducts = cache(() => {
	return db.product.findMany({ where: { isAvailableForPurchase: true }, orderBy: { name: 'asc' } });
}, ['/products', 'getProducts']);

// renders products page, with a fallback loading state
export default function ProductsPage() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<Suspense
				fallback={
					<>
						<ProductCardSkeleton />
						<ProductCardSkeleton />
						<ProductCardSkeleton />
						<ProductCardSkeleton />
						<ProductCardSkeleton />
						<ProductCardSkeleton />
					</>
				}
			>
				<ProductsSuspense />
			</Suspense>
		</div>
	);
}

// renders products
async function ProductsSuspense() {
	const products = await getProducts();

	return products.map((product) => <ProductCard key={product.id} {...product} />);
}
