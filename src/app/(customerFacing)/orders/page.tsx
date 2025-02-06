'use client';
import { emailOrderHistory } from '@/actions/orders';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

// orders page
export default function MyOrdersPage() {
	const [data, action] = useActionState(emailOrderHistory, {});

	return (
		<form action={action} className="max-2-xl mx-auto">
			<Card>
				<CardHeader>
					<CardTitle>My Orders</CardTitle>
					<CardDescription>
						Enter your email and we will email your order history and download links
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input type="email" name="email" id="email" required />
						{data.error && <div className="text-destructive">{data.error}</div>}
					</div>
				</CardContent>
				<CardFooter>{data.message ? <p>{data.message}</p> : <SubmitButton />}</CardFooter>
			</Card>
		</form>
	);
}

// reusable submit button
function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button className="w-full" size="lg" type="submit" disabled={pending}>
			{pending ? 'Sending...' : 'Send'}
		</Button>
	);
}
