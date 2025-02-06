import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
	return new PrismaClient();
};

declare global {
	// eslint-disable-next-line no-var
	var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// prisma
const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
