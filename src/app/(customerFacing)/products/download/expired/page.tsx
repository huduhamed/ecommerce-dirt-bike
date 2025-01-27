import { Button } from '@/components/ui/button';
import Link from 'next/link';

// redirect to orders page if download link is expires
export default function ExpiredLink() {
	return (
		<>
			<h1 className="text-3xl mb-4">Download link expired</h1>
			<Button asChild size="lg">
				<Link href="/orders">Get new link</Link>
			</Button>
		</>
	);
}
