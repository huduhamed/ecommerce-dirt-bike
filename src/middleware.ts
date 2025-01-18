import { NextRequest, NextResponse } from 'next/server';
import { isValidPassword } from './lib/isValidPassword';

// create middleware for admin Auth & Oauth
export async function middleware(req: NextRequest) {
	if ((await isAuthenticated(req)) === false) {
		return new NextResponse('Unauthenticated', {
			status: 401,
			headers: {
				'www-Authenticate': 'Basic',
			},
		});
	}
}

// check & compare auth keys to authenticate
async function isAuthenticated(req: NextRequest) {
	const authHeader = req.headers.get('autorization') || req.headers.get('Autorization');

	// deny auth if null
	if (authHeader == null) return false;

	// compare username & pass
	const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
		.toString()
		.split(':');

	return (
		username === process.env.ADMIN_USERNAME &&
		(await isValidPassword(password, process.env.HASHED_ADMIN_PASSWORD as string))
	);
}

// check to target and route on admin dashboard
export const config = {
	matcher: '/admin/:path*',
};
