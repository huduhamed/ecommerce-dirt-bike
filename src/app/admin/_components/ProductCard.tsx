import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
	id: string;
	name: string;
	priceInCents: number;
	description: string;
	imagePath: string;
};

export function ProductCard({ id, name, priceInCents, description, imagePath }: ProductCardProps) {
	return (
		<Card className="flex flex-col overflow-hidden">
			<div className="w-full h-auto relative aspect-video">
				<Image src={imagePath} alt="name" fill />
			</div>
			<CardHeader>
				<CardTitle>{name}</CardTitle>
				<CardDescription>{formatCurrency(priceInCents / 100)}</CardDescription>
			</CardHeader>
			<CardContent className="flex-grow">
				<p className="line-clamp-4">{description}</p>
			</CardContent>
			<CardFooter>
				<Button className="w-full" asChild>
					<Link href={`/products/${id}/purchase`}>Purchase</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
