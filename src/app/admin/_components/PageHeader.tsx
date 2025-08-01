import { ReactNode } from 'react';

// page header component
export function PageHeader({ children }: { children: ReactNode }) {
	return <h1 className="text-4xl mb-4">{children}</h1>;
}
