import db from '@/db/db';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';

// download file if download link is valid
export async function GET(
	req: NextRequest,
	{ params: { downloadVerificationId } }: { params: { downloadVerificationId: string } }
) {
	// download verification id is valid if it exists and has not expired
	const data = await db.downloadVerification.findUnique({
		where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
		select: { product: { select: { filePath: true, name: true } } },
	});

	// redirect to expired page if download link is expired
	if (data == null) {
		return NextResponse.redirect(new URL('/products/download/expired', req.url));
	}

	// download
	const { size } = await fs.stat(data.product.filePath);
	const file = await fs.readFile(data.product.filePath);
	const extension = data.product.filePath.split('.').pop();

	// return file
	return new NextResponse(file, {
		headers: {
			'Content-Disposition': `attachment; filename="${data.product.name}.${extension}"`,
			'Content-Lenght': size.toString(),
			'Content-type': 'application/octet-stream',
		},
	});
}
