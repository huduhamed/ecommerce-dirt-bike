'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps, ReactNode } from 'react';

// nav component
export function Nav({ children }: { children: ReactNode }) {
	return (
		<nav className="bg-primary text-primary-foreground flex justify-left px-4 fixed top-0 left-0 w-full z-50 shadow-md">
			{children}
		</nav>
	);
}

// nav links
export function NavLink(props: Omit<ComponentProps<typeof Link>, 'className'>) {
	const pathname = usePathname();

	return (
		<Link
			{...props}
			className={cn(
				'p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground',
				pathname === props.href && 'bg-background text-foreground',
			)}
		/>
	);
}
