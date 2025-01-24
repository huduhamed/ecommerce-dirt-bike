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

export function ProductCardSkeleton() {
	return (
		<Card className="flex flex-col overflow-hidden animate-pulse">
			<div className="w-full bg-gray-300 aspect-video" />
			<CardHeader>
				<CardTitle>
					<div className="w-3/4 h-6 rounded-full bg-gray-300" />
				</CardTitle>
				<CardDescription>
					<div className="w-1/2 h-4 rounded-full bg-gray-300" />
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="w-full h-4 rounded-full bg-gray-300" />
				<div className="w-full h-4 rounded-full bg-gray-300" />
				<div className="w-3/4 h-4 rounded-full bg-gray-300" />
			</CardContent>
			<CardFooter>
				<Button className="w-full disabled" size="lg"></Button>
			</CardFooter>
		</Card>
	);
}
