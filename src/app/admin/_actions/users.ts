'use server';

import db from '@/db/db';
import { notFound } from 'next/navigation';

// delete user action
export async function DeleteUser(id: string) {
	// fetch user from db and delete
	const user = await db.user.delete({
		where: { id },
	});

	if (user == null) return notFound();

	return user;
}
