// check if pass is valid
export async function isValidPassword(password: string, hashedPassword: string) {
	return (await hashPassword(password)) === hashedPassword;
}

// validate password
async function hashPassword(password: string) {
	// encrpt password
	const arrayBuffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(password));

	return Buffer.from(arrayBuffer).toString('base64');
}
