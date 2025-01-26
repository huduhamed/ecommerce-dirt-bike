import { unstable_cache as nextCache } from 'next/cache';
import { cache as reactCache } from 'react';

// type for a callback function
type Callback = (...args: any[]) => Promise<any>;

// cache results of callback function
export function cache<T extends Callback>(
	cb: T,
	keyParts: string[],
	options: { revalidate?: number | false; tags?: string[] } = {}
) {
	return nextCache(reactCache(cb), keyParts, options);
}
