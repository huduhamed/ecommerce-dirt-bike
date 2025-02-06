import db from '@/db/db';
import fs from 'fs/promises';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

// get product action
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
	const product = await db.product.findUnique({
		where: { id },
		select: { filePath: true, name: true },
	});

	// return not found if product is null
	if (product == null) return notFound();

	const { size } = await fs.stat(product.filePath);
	const file = await fs.readFile(product.filePath);
	const extension = product.filePath.split('.').pop();

	return new NextResponse(file, {
		headers: {
			'Content-Disposition': `attachment; filename="${product.name}.${extension}"`,
			'Content-Lenght': size.toString(),
			'Content-type': 'application/octet-stream',
		},
	});
}
