import { Nav, NavLink } from '@/components/Nav';

export const dynamic = 'force-dynamic';

// admin layout page
export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Nav>
				<NavLink href="/admin">Dashboard</NavLink>
				<NavLink href="/admin/products">Products</NavLink>
				<NavLink href="/admin/users">Customers</NavLink>
				<NavLink href="/admin/orders">Sales</NavLink>
			</Nav>
			<div className="container px-4 my-6">{children}</div>
		</>
	);
}
