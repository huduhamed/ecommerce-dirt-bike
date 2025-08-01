'use server';

import db from '@/db/db';
import OrderHistoryEmail from '@/email/OrderHistory';
import { Resend } from 'resend';
import { z } from 'zod';

// sanitize email
const emailSchema = z.string().email();
// create resend
const resend = new Resend(process.env.RESEND_API_KEY as string);

// email history component
export async function emailOrderHistory(
	prevState: unknown,
	formData: FormData,
): Promise<{ message?: string; error?: string }> {
	const result = emailSchema.safeParse(formData.get('email'));

	// render invalid email on error
	if (result.success === false) {
		return { error: 'Invalid email address' };
	}

	// find user
	const user = await db.user.findUnique({
		where: { email: result.data },
		select: {
			email: true,
			orders: {
				select: {
					pricePaidInCents: true,
					id: true,
					createdAt: true,
					product: {
						select: {
							id: true,
							name: true,
							imagePath: true,
							description: true,
						},
					},
				},
			},
		},
	});

	// if user is null
	if (user == null) {
		return {
			message: 'Check your email to view your order history and download your products',
		};
	}

	// iterate orders
	const orders = user.orders.map(async (order) => {
		return {
			...order,
			downloadVerificationId: (
				await db.downloadVerification.create({
					data: {
						expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60),
						productId: order.product.id,
					},
				})
			).id,
		};
	});

	const data = await resend.emails.send({
		from: `Support <${process.env.SENDER_EMAIL}>`,
		to: user.email,
		subject: 'Order History',
		react: <OrderHistoryEmail orders={await Promise.all(orders)} />,
	});

	if (data.error) {
		return { error: 'There was an error sending your email, Please try again.' };
	}

	return { message: 'Check your email to view your order history and download your products' };
}
