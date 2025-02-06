'use server';

import db from '@/db/db';
import { notFound } from 'next/navigation';

// delete order action
export async function DeleteOrder(id: string) {
	// fetch user from db and delete
	const order = await db.order.delete({
		where: { id },
	});

	if (order == null) return notFound();

	return order;
}
