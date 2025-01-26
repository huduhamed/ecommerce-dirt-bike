'use server';

import db from '@/db/db';
import { z } from 'zod';
import fs from 'fs/promises';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// create schemas for file & image
const fileSchema = z.instanceof(File, { message: 'Required' });
const imageSchema = fileSchema.refine((file) => file.size === 0 || file.type.startsWith('image/'));

const addSchema = z.object({
	name: z.string().min(1),
	priceInCents: z.coerce.number().int().min(1),
	description: z.string().min(1),
	file: fileSchema.refine((file) => file.size > 0, 'Required'),
	image: imageSchema.refine((file) => file.size > 0, 'Required'),
});

// add product action
export async function AddProduct(prevState: unknown, formData: FormData) {
	const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

	if (result.success === false) {
		return result.error.formErrors.fieldErrors;
	}

	const data = result.data;

	// save files to file-system before downloads
	await fs.mkdir('products', { recursive: true });
	// create a path to new file
	const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
	// save file
	await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

	// for image
	await fs.mkdir('public/products', { recursive: true });
	const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
	// save image
	await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));

	await db.product.create({
		data: {
			isAvailableForPurchase: false,
			name: data.name,
			priceInCents: data.priceInCents,
			description: data.description,
			filePath,
			imagePath,
		},
	});

	// revalidate paths
	revalidatePath('/');
	revalidatePath('/products');

	redirect('/admin/products');
}

// toggle product availability func
export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean) {
	await db.product.update({
		where: { id },
		data: {
			isAvailableForPurchase,
		},
	});

	// revalidate paths
	revalidatePath('/');
	revalidatePath('/products');
}

// delete procduct func
export async function deleteProduct(id: string) {
	const product = await db.product.delete({
		where: { id },
	});

	if (product == null) return notFound();

	await fs.unlink(product.filePath);
	await fs.unlink(`public${product.imagePath}`);

	// revalidate paths
	revalidatePath('/');
	revalidatePath('/products');
}

// add edit schema
const editSchema = addSchema.extend({
	file: fileSchema.optional(),
	image: imageSchema.optional(),
});

// update product
export async function updateProduct(id: string, prevState: unknown, formData: FormData) {
	const result = editSchema.safeParse(Object.fromEntries(formData.entries()));

	if (result.success === false) {
		return result.error.formErrors.fieldErrors;
	}

	const data = result.data;
	const product = await db.product.findUnique({ where: { id } });

	// return not found if product is null
	if (product == null) return notFound();

	//  create a variable for filePath
	let filePath = product.filePath;

	// update file if changed
	if (data.file != null && data.file.size > 0) {
		// unlink old product file
		await fs.unlink(product.filePath);
		// create & save path to new file
		filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
		// save file
		await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
	}

	//  create a variable for imagePath
	let imagePath = product.imagePath;

	// update file if changed
	if (data.image != null && data.image.size > 0) {
		// unlink old product image
		await fs.unlink(`{public${product.imagePath}}`);
		// create & save path to new file
		imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
		// save image
		await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));
	}

	await db.product.update({
		where: { id },
		data: {
			name: data.name,
			priceInCents: data.priceInCents,
			description: data.description,
			filePath,
			imagePath,
		},
	});

	// revalidate paths
	revalidatePath('/');
	revalidatePath('/products');

	redirect('/admin/products');
}
