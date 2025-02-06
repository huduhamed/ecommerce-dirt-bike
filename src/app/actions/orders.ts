'use server';

import db from '@/db/db';

// verify user order existance
export async function userOrderExists(email: string, productId: string) {
	return (
		(await db.order.findFirst({
			where: { user: { email }, productId },
			select: { id: true },
		})) != null
	);
}
