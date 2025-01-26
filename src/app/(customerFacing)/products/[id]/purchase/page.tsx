import db from '@/db/db';
import { notFound } from 'next/navigation';

export default async function PurchasePage({ params: { id } }: { params: { id: string } }) {
	// fetch product
	const product = await db.product.findUnique({ where: { id } });

	// if product does not exist, return notfound.
	if (product == null) return notFound();
	return <h1>Hell yh</h1>;
}
